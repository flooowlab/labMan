import { readDb, withLocks, commit } from './db.js';
import { newId } from './ids.js';
import type { Alert, AlertKind, AlertSeverity } from './types.js';

/**
 * Creates an alert record for the given lab.
 * Input:  labId + partial Alert fields (id, lab_id, triggered_at auto-filled)
 * Output: the created Alert
 */
export async function createAlert(
  labId: string,
  fields: {
    kind: AlertKind;
    severity: AlertSeverity;
    message: string;
    borrow_id?: string | null;
    reservation_id?: string | null;
    item_id?: string | null;
    user_id?: string | null;
  },
): Promise<Alert> {
  return withLocks(labId, ['alerts.json'], async () => {
    const alerts = readDb<Alert>(labId, 'alerts.json');
    const now = new Date().toISOString();
    const alert: Alert = {
      id: newId(),
      lab_id: labId,
      kind: fields.kind,
      borrow_id: fields.borrow_id ?? null,
      reservation_id: fields.reservation_id ?? null,
      item_id: fields.item_id ?? null,
      user_id: fields.user_id ?? null,
      message: fields.message,
      triggered_at: now,
      resolved_at: null,
      severity: fields.severity,
      acknowledged: false,
      acknowledged_by: null,
      acknowledged_at: null,
    };
    await commit({
      labId,
      writes: [['alerts.json', [...alerts, alert]]],
      audit: {
        action: 'alert.create',
        entity_type: 'alert',
        entity_id: alert.id,
        actor_id: 'system',
        actor_role: 'admin',
        after: { kind: fields.kind, severity: fields.severity },
      },
    });
    return alert;
  });
}

/**
 * Resolves all open alerts matching the given filter.
 * Runs inside the caller's lock if labId + files already locked, or opens a new lock.
 */
export async function resolveAlerts(
  labId: string,
  filter: {
    borrow_id?: string;
    reservation_id?: string;
    kind?: AlertKind;
    item_id?: string;
  },
  alertsRef?: Alert[],
): Promise<void> {
  const now = new Date().toISOString();
  if (alertsRef) {
    // Mutate in-place when called from inside an existing lock
    alertsRef
      .filter(
        (a) =>
          !a.resolved_at &&
          (!filter.borrow_id || a.borrow_id === filter.borrow_id) &&
          (!filter.reservation_id || a.reservation_id === filter.reservation_id) &&
          (!filter.kind || a.kind === filter.kind) &&
          (!filter.item_id || a.item_id === filter.item_id),
      )
      .forEach((a) => {
        a.resolved_at = now;
      });
  } else {
    await withLocks(labId, ['alerts.json'], async () => {
      const alerts = readDb<Alert>(labId, 'alerts.json');
      alerts
        .filter(
          (a) =>
            !a.resolved_at &&
            (!filter.borrow_id || a.borrow_id === filter.borrow_id) &&
            (!filter.reservation_id || a.reservation_id === filter.reservation_id) &&
            (!filter.kind || a.kind === filter.kind) &&
            (!filter.item_id || a.item_id === filter.item_id),
        )
        .forEach((a) => {
          a.resolved_at = now;
        });
      await commit({ labId, writes: [['alerts.json', alerts]], audit: undefined as never });
    });
  }
}
