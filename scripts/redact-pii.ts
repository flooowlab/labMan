/**
 * scripts/redact-pii.ts
 * Redact PII for users whose last lab activity ended > 18 months ago.
 * Usage: npx tsx scripts/redact-pii.ts
 *
 * A user is eligible for redaction when:
 *   - ALL their borrows are in a final state (returned | cancelled)
 *   - ALL their reservations are in a final state (completed | rejected | cancelled | expired)
 *   - The most recent final-state event timestamp is >= 18 months in the past
 *   - redacted_at is not already set
 */
import { config } from 'dotenv';
import { readDb, withLocks, commit } from '../src/lib/db.js';
import type { User, Lab, BorrowRecord, Reservation, LabMembership } from '../src/lib/types.js';

config();

const MONTHS_18 = 18 * 30 * 24 * 60 * 60 * 1000;
const FINAL_BORROW = new Set(['returned', 'cancelled']);
const FINAL_RES    = new Set(['completed', 'rejected', 'cancelled', 'expired']);

async function main() {
  const labs  = readDb<Lab>('_global', 'labs.json').filter((l) => l.is_active);
  const users = readDb<User>('_global', 'users.json');

  // Collect all borrows and reservations across all labs keyed by user_id
  const lastActivity = new Map<string, number>(); // user_id → latest final-state ms
  const eligible     = new Map<string, boolean>(); // user_id → all activity is final

  for (const lab of labs) {
    const borrows      = readDb<BorrowRecord>(lab.id, 'borrows.json');
    const reservations = readDb<Reservation>(lab.id, 'reservations.json');

    for (const b of borrows) {
      const isFinal = FINAL_BORROW.has(b.status);
      if (!isFinal) {
        eligible.set(b.user_id, false);
        continue;
      }
      if (eligible.get(b.user_id) === false) continue;
      eligible.set(b.user_id, true);
      const ts = new Date(b.returned_at ?? b.updated_at).getTime();
      lastActivity.set(b.user_id, Math.max(lastActivity.get(b.user_id) ?? 0, ts));
    }

    for (const r of reservations) {
      const isFinal = FINAL_RES.has(r.status);
      if (!isFinal) {
        eligible.set(r.user_id, false);
        continue;
      }
      if (eligible.get(r.user_id) === false) continue;
      eligible.set(r.user_id, eligible.get(r.user_id) !== false);
      const ts = new Date(r.updated_at).getTime();
      lastActivity.set(r.user_id, Math.max(lastActivity.get(r.user_id) ?? 0, ts));
    }
  }

  const cutoff = Date.now() - MONTHS_18;
  const toRedact = users.filter((u) => {
    if (u.redacted_at) return false;
    if (eligible.get(u.id) === false) return false; // has active records
    const last = lastActivity.get(u.id) ?? 0;
    return last > 0 && last < cutoff;
  });

  if (toRedact.length === 0) {
    console.log('[redact-pii] no users eligible for redaction');
    return;
  }

  console.log(`[redact-pii] redacting ${toRedact.length} users`);

  await withLocks('_global', ['users.json'], async () => {
    const allUsers = readDb<User>('_global', 'users.json');
    const now = new Date().toISOString();
    for (const u of toRedact) {
      const target = allUsers.find((x) => x.id === u.id);
      if (!target) continue;
      target.name           = '[REDACTED]';
      target.email          = `redacted-${target.id.slice(0, 8)}@redacted.invalid`;
      target.rfid_tag       = null;
      target.password_hash  = '';
      target.totp_secret_enc = null;
      target.totp_enabled   = false;
      target.redacted_at    = now;
      target.updated_at     = now;
      console.log(`  redacted user ${u.id.slice(0, 8)}`);
    }
    await commit({
      labId: '_global',
      writes: [['users.json', allUsers]],
      audit: {
        actor_id: 'system',
        actor_role: 'system',
        action: 'users.pii_redaction',
        entity_type: 'user',
        entity_id: '_global',
        after: { count: toRedact.length },
      },
    });
  });

  console.log('[redact-pii] done');
}

main().catch((e) => { console.error(e); process.exit(1); });
