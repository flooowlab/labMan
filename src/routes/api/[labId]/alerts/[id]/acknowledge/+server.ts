import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import type { Alert } from '$lib/types.js';

/**
 * POST /api/:labId/alerts/:id/acknowledge
 * Marks the alert as acknowledged. Manager+ only.
 */
export const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  return withLocks(labId, ['alerts.json'], async () => {
    const alerts = readDb<Alert>(labId, 'alerts.json');
    const alert = alerts.find((a) => a.id === id);
    if (!alert) return err(404, 'Alert not found');
    if (alert.acknowledged) return ok(alert); // idempotent

    const now = new Date().toISOString();
    alert.acknowledged = true;
    alert.acknowledged_by = user.user_id;
    alert.acknowledged_at = now;

    await commit({
      labId,
      writes: [['alerts.json', alerts]],
      audit: {
        action: 'alert.acknowledge',
        entity_type: 'alert',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'manager',
        after: { acknowledged: true },
        ip: ctx.getClientAddress(),
      },
    });

    return ok(alert);
  });
}, { minRole: 'manager' });
