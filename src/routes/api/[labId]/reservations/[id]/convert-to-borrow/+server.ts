import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { newId, generatePrintToken } from '$lib/ids.js';
import { findConflicts } from '$lib/reservations.js';
import { assertEligible } from '$lib/eligibility.js';
import { ApiError } from '$lib/types.js';
import type {
  Reservation,
  BorrowRecord,
  BorrowLine,
  Item,
  Unit,
  Config,
} from '$lib/types.js';

// POST /api/:labId/reservations/:id/convert-to-borrow
export const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };
  const body = await ctx.request.json().catch(() => ({})) as {
    due_date?: string;
    notes?: string;
  };

  try {
    const record = await withLocks(
      labId,
      ['borrows.json', 'items.json', 'reservations.json', 'units.json'],
      async () => {
        const reservations = readDb<Reservation>(labId, 'reservations.json');
        const r = reservations.find((x) => x.id === id);
        if (!r) throw new ApiError(404, 'Reservation not found');
        if (r.status !== 'approved') {
          throw new ApiError(409, `Reservation is "${r.status}", not approved`);
        }

        // Re-check conflicts inside lock
        const conflicts = findConflicts(labId, {
          lines: r.lines,
          start_at: r.start_at,
          end_at: r.end_at,
          exclude_id: id,
        });
        if (conflicts.length > 0) {
          throw new ApiError(409, JSON.stringify({ message: 'Conflict at conversion time', conflicts }));
        }

        const items = readDb<Item>(labId, 'items.json');
        const units = readDb<Unit>(labId, 'units.json');
        const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
        const cfg = readDb<Config>(labId, 'config.json')[0];

        const allocatedUnitIds = new Set<string>();
        const builtLines: BorrowLine[] = [];

        for (const rLine of r.lines) {
          const item = items.find((i) => i.id === rLine.item_id && !i.deleted_at);
          if (!item) throw new ApiError(404, `Item ${rLine.item_id} not found`);
          await assertEligible(labId, item, user);

          if (item.tracking_mode === 'serialized') {
            let unitId = rLine.unit_id;
            if (!unitId) {
              const free = units.find(
                (u) =>
                  u.item_id === item.id &&
                  u.status === 'available' &&
                  !u.deleted_at &&
                  !allocatedUnitIds.has(u.id),
              );
              if (!free) throw new ApiError(409, `No available unit for "${item.name}"`);
              unitId = free.id;
            }
            const unit = units.find((u) => u.id === unitId);
            if (!unit || unit.deleted_at) throw new ApiError(404, `Unit ${unitId} not found`);
            if (unit.status !== 'available') {
              throw new ApiError(409, `Unit ${unit.serial_number ?? unitId} is ${unit.status}`);
            }
            allocatedUnitIds.add(unitId);
            unit.status = 'borrowed';
            unit.current_borrow_id = '__pending__';
            builtLines.push({
              id: newId(),
              item_id: item.id,
              unit_id: unitId,
              quantity: 1,
              is_accessory: false,
              is_required: true,
              borrowed_condition: unit.condition,
              returned_condition: null,
              returned_quantity: 0,
              returned_at: null,
              incident_report_id: null,
            });
          } else {
            const qty = rLine.quantity;
            if (item.quantity_available! < qty) {
              throw new ApiError(409, `Only ${item.quantity_available} of "${item.name}" available`);
            }
            item.quantity_available! -= qty;
            if (item.quantity_available! < 0 || item.quantity_available! > item.quantity_total!) {
              throw new Error('INVARIANT: quantity_available out of bounds');
            }
            builtLines.push({
              id: newId(),
              item_id: item.id,
              unit_id: null,
              quantity: qty,
              is_accessory: false,
              is_required: true,
              borrowed_condition: null,
              returned_condition: null,
              returned_quantity: 0,
              returned_at: null,
              incident_report_id: null,
            });
          }
        }

        const now = new Date().toISOString();
        const due = body.due_date ?? new Date(r.end_at).toISOString();
        const borrow: BorrowRecord = {
          id: newId(),
          lab_id: labId,
          user_id: r.user_id,
          reservation_id: id,
          kit_id: r.kit_id,
          lines: builtLines,
          borrowed_at: now,
          due_date: due,
          max_due_date: new Date(
            Date.now() + cfg.default_max_borrow_days * 86_400_000,
          ).toISOString(),
          returned_at: null,
          status: 'active',
          approved_by: user.user_id,
          instructor_auth_id: null,
          borrower_sig_data: null,
          technician_sig_data: null,
          return_sig_data: null,
          print_token: '',
          penalty_level: 0,
          notes: body.notes ?? '',
          created_at: now,
          updated_at: now,
        };

        for (const u of units) {
          if (u.current_borrow_id === '__pending__') u.current_borrow_id = borrow.id;
        }
        borrow.print_token = generatePrintToken(borrow.id);

        r.status = 'active';
        r.borrow_id = borrow.id;
        r.updated_at = now;

        await commit({
          labId,
          writes: [
            ['borrows.json', [...borrows, borrow]],
            ['items.json', items],
            ['reservations.json', reservations],
            ['units.json', units],
          ],
          audit: {
            action: 'reservation.convert_to_borrow',
            entity_type: 'reservation',
            entity_id: id,
            actor_id: user.user_id,
            actor_role: membership?.role ?? 'technician',
            after: { borrow_id: borrow.id, status: 'active' },
            ip: ctx.getClientAddress(),
          },
        });

        return borrow;
      },
    );
    return ok(record, 201);
  } catch (e) {
    if (e instanceof ApiError) return err(e.status, e.message);
    throw e;
  }
}, { minRole: 'technician' });
