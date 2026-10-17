import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import type { Reservation } from '$lib/types.js';

// GET /api/:labId/reservations/:id
export const GET = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };
  const reservations = readDb<Reservation>(labId, 'reservations.json');
  const r = reservations.find((x) => x.id === id);
  if (!r) return err(404, 'Reservation not found');

  // Role-based visibility
  if (membership?.role === 'student' && r.user_id !== user.user_id) {
    return err(403, 'Forbidden');
  }
  if (membership?.role === 'instructor' && r.user_id !== user.user_id && r.instructor_id !== user.user_id) {
    return err(403, 'Forbidden');
  }
  return ok(r);
}, { minRole: 'viewer' });

// DELETE /api/:labId/reservations/:id — cancel (pre-active only)
export const DELETE = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  return withLocks(labId, ['reservations.json'], async () => {
    const reservations = readDb<Reservation>(labId, 'reservations.json');
    const r = reservations.find((x) => x.id === id);
    if (!r) return err(404, 'Reservation not found');

    const isOwner = r.user_id === user.user_id;
    const isManagerPlus = membership && ['admin', 'manager'].includes(membership.role);
    if (!isOwner && !isManagerPlus) return err(403, 'Forbidden');

    const cancellableStatuses: Reservation['status'][] = [
      'draft', 'pending_instructor', 'pending_manager', 'approved',
    ];
    if (!cancellableStatuses.includes(r.status)) {
      return err(409, `Cannot cancel a reservation with status "${r.status}"`);
    }

    const now = new Date().toISOString();
    r.status = 'cancelled';
    r.cancelled_at = now;
    r.cancelled_by = user.user_id;
    r.updated_at = now;

    await commit({
      labId,
      writes: [['reservations.json', reservations]],
      audit: {
        action: 'reservation.cancel',
        entity_type: 'reservation',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'student',
        ip: ctx.getClientAddress(),
      },
    });

    return ok({ ok: true });
  });
}, { minRole: 'viewer' });
