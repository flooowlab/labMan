import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { getMembership } from '$lib/auth.js';
import { ReservationSchema, parseBody } from '$lib/validate.js';
import { newId } from '$lib/ids.js';
import { findConflicts } from '$lib/reservations.js';
import { expandKit } from '$lib/kits.js';
import { ApiError } from '$lib/types.js';
import type {
  Reservation,
  ReservationLine,
  Config,
  LabMembership,
} from '$lib/types.js';

// GET /api/:labId/reservations — role-filtered list
export const GET = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const { searchParams } = ctx.url;

  let reservations = readDb<Reservation>(labId, 'reservations.json');

  switch (membership?.role) {
    case 'student':
      reservations = reservations.filter((r) => r.user_id === user.user_id);
      break;
    case 'instructor':
      reservations = reservations.filter(
        (r) => r.user_id === user.user_id || r.instructor_id === user.user_id,
      );
      break;
    // manager / admin / technician see all
  }

  const status = searchParams.get('status');
  if (status) reservations = reservations.filter((r) => r.status === status);

  return ok(reservations);
}, { minRole: 'viewer' });

// POST /api/:labId/reservations — create reservation
export const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;

  const parsed = await parseBody(ctx.request, ReservationSchema);
  if ('error' in parsed) return parsed.error;
  const input = parsed.data;

  // Students require at least lead-time gap
  const cfg = readDb<Config>(labId, 'config.json')[0];
  const minLeadMs =
    membership?.role === 'student'
      ? cfg.min_lead_time_minutes_student * 60_000
      : cfg.min_lead_time_minutes_staff * 60_000;
  if (new Date(input.start_at).getTime() - Date.now() < minLeadMs) {
    return err(422, 'Reservation is too soon given minimum lead time');
  }
  if (
    new Date(input.start_at).getTime() - Date.now() >
    cfg.max_advance_booking_days * 86_400_000
  ) {
    return err(422, 'Reservation is too far in advance');
  }

  try {
    const record = await withLocks(
      labId,
      ['borrows.json', 'items.json', 'reservations.json', 'units.json'],
      async () => {
        // Expand kit lines if provided
        const rawLines: ReservationLine[] = (
          input.kit_id
            ? expandKit(labId, input.kit_id).map((kl) => ({
                id: newId(),
                item_id: kl.item_id,
                unit_id: null,
                quantity: kl.quantity,
              }))
            : input.lines.map((l) => ({ id: newId(), item_id: l.item_id, unit_id: l.unit_id ?? null, quantity: l.quantity }))
        );

        const conflicts = findConflicts(labId, {
          lines: rawLines,
          start_at: input.start_at,
          end_at: input.end_at,
        });
        if (conflicts.length > 0) {
          throw new ApiError(409, JSON.stringify({ conflicts }));
        }

        const reservations = readDb<Reservation>(labId, 'reservations.json');

        // Determine initial status based on user type
        const membershipDb = readDb<LabMembership>('_global', 'lab_memberships.json').find(
          (m) => m.user_id === user.user_id && m.lab_id === labId,
        );
        let initialStatus: Reservation['status'] = 'pending_manager';
        if (membershipDb?.user_type === 'student' && input.instructor_id) {
          initialStatus = 'pending_instructor';
        }

        const now = new Date().toISOString();
        const reservation: Reservation = {
          id: newId(),
          lab_id: labId,
          user_id: user.user_id,
          kit_id: input.kit_id ?? null,
          lines: rawLines,
          start_at: input.start_at,
          end_at: input.end_at,
          purpose: input.purpose,
          course_code: input.course_code ?? '',
          status: initialStatus,
          instructor_id: input.instructor_id ?? null,
          instructor_decision_at: null,
          instructor_notes: '',
          manager_decision_by: null,
          manager_decision_at: null,
          manager_notes: '',
          rejection_reason: '',
          borrow_id: null,
          cancelled_at: null,
          cancelled_by: null,
          created_at: now,
          updated_at: now,
        };

        await commit({
          labId,
          writes: [['reservations.json', [...reservations, reservation]]],
          audit: {
            action: 'reservation.create',
            entity_type: 'reservation',
            entity_id: reservation.id,
            actor_id: user.user_id,
            actor_role: membership?.role ?? 'student',
            after: { status: reservation.status, start_at: reservation.start_at },
            ip: ctx.getClientAddress(),
          },
        });

        return reservation;
      },
    );
    return ok(record, 201);
  } catch (e) {
    if (e instanceof ApiError) return err(e.status, e.message);
    throw e;
  }
}, { minRole: 'viewer' });
