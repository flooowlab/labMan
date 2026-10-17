/**
 * scripts/check-overdue.ts
 * Run hourly via cron or manually: npx tsx scripts/check-overdue.ts <lab-id>
 *
 * Responsibilities:
 * 1. Mark active borrows as overdue and apply penalty escalation
 * 2. Cancel no-show reservations past the grace period
 * 3. Expire stale pending reservations past TTL
 * 4. Trigger low-stock alerts for bulk items
 */
import { join } from 'path';
import { config } from 'dotenv';
import { readDb, withLocks, commit } from '../src/lib/db.js';
import { createAlert, resolveAlerts } from '../src/lib/alerts.js';
import { notifyUser } from '../src/lib/notifications.js';
import type {
  BorrowRecord,
  Reservation,
  Item,
  LabMembership,
  Config,
  Alert,
} from '../src/lib/types.js';

config();

const labId = process.argv[2];
if (!labId) {
  console.error('Usage: npx tsx scripts/check-overdue.ts <lab-id>');
  process.exit(1);
}

async function main() {
  console.log(`[check-overdue] running for lab ${labId}`);

  const cfg = readDb<Config>(labId, 'config.json')[0];
  if (!cfg) {
    console.error(`No config found for lab ${labId}`);
    process.exit(1);
  }

  await Promise.all([
    checkOverdueBorrows(cfg),
    checkNoShowReservations(cfg),
    checkStalePendingReservations(cfg),
    checkLowStock(cfg),
  ]);

  console.log('[check-overdue] done');
}

// ---------------------------------------------------------------------------
// 1. Overdue borrows + penalty escalation
// ---------------------------------------------------------------------------
async function checkOverdueBorrows(cfg: Config) {
  const now = Date.now();

  await withLocks(
    labId,
    ['alerts.json', 'borrows.json', 'lab_memberships.json'],
    async () => {
      const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
      const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');
      const alerts = readDb<Alert>(labId, 'alerts.json');

      const active = borrows.filter(
        (b) => b.status === 'active' || b.status === 'partially_returned',
      );

      let changed = false;

      for (const borrow of active) {
        const dueMs = new Date(borrow.due_date).getTime();
        if (dueMs >= now) continue; // not overdue

        const daysOverdue = (now - dueMs) / 86_400_000;

        // Flip status to overdue if not already
        if (borrow.status === 'active') {
          borrow.status = 'overdue';
          changed = true;
        }

        // Ensure an overdue alert exists
        const hasAlert = alerts.some(
          (a) => a.kind === 'overdue' && a.borrow_id === borrow.id && !a.resolved_at,
        );
        if (!hasAlert) {
          const alert: Alert = {
            id: crypto.randomUUID(),
            lab_id: labId,
            kind: 'overdue',
            borrow_id: borrow.id,
            reservation_id: null,
            item_id: null,
            user_id: borrow.user_id,
            message: `Borrow ${borrow.id} is ${Math.floor(daysOverdue)} day(s) overdue`,
            triggered_at: new Date().toISOString(),
            resolved_at: null,
            severity: daysOverdue >= 3 ? 'critical' : 'overdue',
            acknowledged: false,
            acknowledged_by: null,
            acknowledged_at: null,
          };
          alerts.push(alert);
          changed = true;
        }

        // Penalty escalation
        const m = memberships.find(
          (x) => x.user_id === borrow.user_id && x.lab_id === labId,
        );
        if (!m) continue;

        if (
          daysOverdue >= cfg.penalty_suspension_days_overdue &&
          borrow.penalty_level < 2
        ) {
          m.borrow_restricted_until = new Date(
            now + cfg.penalty_suspension_duration_days * 86_400_000,
          ).toISOString();
          borrow.penalty_level = 2;
          changed = true;
          notifyUser(borrow.user_id, 'borrow_suspended', {
            borrow_id: borrow.id,
            until: m.borrow_restricted_until,
          }).catch(console.error);
        } else if (
          daysOverdue >= cfg.penalty_warning_days_overdue &&
          borrow.penalty_level < 1
        ) {
          borrow.penalty_level = 1;
          changed = true;
          notifyUser(borrow.user_id, 'borrow_overdue_warning', {
            borrow_id: borrow.id,
          }).catch(console.error);
        }
      }

      if (!changed) return;

      await commit({
        labId,
        writes: [
          ['borrows.json', borrows],
          ['alerts.json', alerts],
          ['lab_memberships.json', memberships],
        ],
        audit: {
          action: 'cron.overdue_check',
          entity_type: 'borrow',
          entity_id: '',
          actor_id: 'system',
          actor_role: 'admin',
          after: { ran_at: new Date().toISOString() },
        },
      });
    },
  );
}

// ---------------------------------------------------------------------------
// 2. No-show reservations
// ---------------------------------------------------------------------------
async function checkNoShowReservations(cfg: Config) {
  const now = Date.now();
  const graceMs = cfg.no_show_grace_minutes * 60_000;

  await withLocks(
    labId,
    ['alerts.json', 'lab_memberships.json', 'reservations.json'],
    async () => {
      const reservations = readDb<Reservation>(labId, 'reservations.json');
      const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');
      const alerts = readDb<Alert>(labId, 'alerts.json');

      const noShows = reservations.filter(
        (r) =>
          r.status === 'approved' &&
          new Date(r.start_at).getTime() + graceMs < now,
      );

      if (noShows.length === 0) return;

      for (const r of noShows) {
        r.status = 'cancelled';
        r.cancelled_at = new Date().toISOString();
        r.cancelled_by = 'system';
        r.updated_at = new Date().toISOString();

        const m = memberships.find(
          (x) => x.user_id === r.user_id && x.lab_id === labId,
        );
        if (m) {
          m.no_show_count = (m.no_show_count ?? 0) + 1;
          if (m.no_show_count >= cfg.no_show_restriction_threshold) {
            m.borrow_restricted_until = new Date(
              now + cfg.no_show_restriction_days * 86_400_000,
            ).toISOString();
          }
        }

        const alert: Alert = {
          id: crypto.randomUUID(),
          lab_id: labId,
          kind: 'no_show',
          borrow_id: null,
          reservation_id: r.id,
          item_id: null,
          user_id: r.user_id,
          message: `No-show on reservation ${r.id}`,
          triggered_at: new Date().toISOString(),
          resolved_at: null,
          severity: 'warning',
          acknowledged: false,
          acknowledged_by: null,
          acknowledged_at: null,
        };
        alerts.push(alert);
      }

      await commit({
        labId,
        writes: [
          ['reservations.json', reservations],
          ['lab_memberships.json', memberships],
          ['alerts.json', alerts],
        ],
        audit: {
          action: 'cron.no_show_check',
          entity_type: 'reservation',
          entity_id: '',
          actor_id: 'system',
          actor_role: 'admin',
          after: { no_shows: noShows.length },
        },
      });
    },
  );
}

// ---------------------------------------------------------------------------
// 3. Stale pending reservations
// ---------------------------------------------------------------------------
async function checkStalePendingReservations(cfg: Config) {
  const now = Date.now();
  const ttlMs = cfg.pending_ttl_hours * 3_600_000;

  await withLocks(labId, ['reservations.json'], async () => {
    const reservations = readDb<Reservation>(labId, 'reservations.json');

    const stale = reservations.filter(
      (r) =>
        (r.status === 'pending_instructor' || r.status === 'pending_manager') &&
        new Date(r.created_at).getTime() + ttlMs < now,
    );

    if (stale.length === 0) return;

    for (const r of stale) {
      r.status = 'expired';
      r.updated_at = new Date().toISOString();
    }

    await commit({
      labId,
      writes: [['reservations.json', reservations]],
      audit: {
        action: 'cron.stale_pending_check',
        entity_type: 'reservation',
        entity_id: '',
        actor_id: 'system',
        actor_role: 'admin',
        after: { expired: stale.length },
      },
    });
  });
}

// ---------------------------------------------------------------------------
// 4. Low-stock alerts
// ---------------------------------------------------------------------------
async function checkLowStock(cfg: Config) {
  const items = readDb<Item>(labId, 'items.json').filter(
    (i) => !i.deleted_at && i.tracking_mode === 'bulk' && i.min_stock_alert != null,
  );

  for (const item of items) {
    if ((item.quantity_available ?? 0) <= item.min_stock_alert!) {
      await createAlert(labId, {
        kind: 'low_stock',
        severity: 'warning',
        message: `"${item.name}" is low on stock (${item.quantity_available} remaining)`,
        item_id: item.id,
      }).catch(console.error);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
