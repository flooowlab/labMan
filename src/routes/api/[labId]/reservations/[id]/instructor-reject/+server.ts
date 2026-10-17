import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import type { Reservation } from '$lib/types.js';

// POST /api/:labId/reservations/:id/instructor-reject
export const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  const body = await ctx.request.json().catch(() => ({})) as { notes?: string; reason?: string };

  return withLocks(labId, ['reservations.json'], async () => {
    const reservations = readDb<Reservation>(labId, 'reservations.json');
    const r = reservations.find((x) => x.id === id);
    if (!r) return err(404, 'Reservation not found');
    if (r.status !== 'pending_instructor') return err(409, 'Reservation is not pending instructor approval');
    if (r.instructor_id !== user.user_id) return err(403, 'Only the assigned instructor may reject');

    const now = new Date().toISOString();
    r.status = 'rejected';
    r.instructor_decision_at = now;
    r.instructor_notes = body.notes ?? '';
    r.rejection_reason = body.reason ?? '';
    r.updated_at = now;

    await commit({
      labId,
      writes: [['reservations.json', reservations]],
      audit: {
        action: 'reservation.instructor_reject',
        entity_type: 'reservation',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'instructor',
        before: { status: 'pending_instructor' },
        after: { status: 'rejected' },
        ip: ctx.getClientAddress(),
      },
    });

    return ok({ ok: true });
  });
}, { minRole: 'instructor' });
