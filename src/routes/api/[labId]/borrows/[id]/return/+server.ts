import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { getMembership } from '$lib/auth.js';
import { ReturnSchema, parseBody } from '$lib/validate.js';
import { ApiError } from '$lib/types.js';
import type { BorrowRecord, Item, Unit } from '$lib/types.js';

// POST /api/:labId/borrows/:id/return
export const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id: borrowId } = ctx.params as { labId: string; id: string };

  const parsed = await parseBody(ctx.request, ReturnSchema);
  if ('error' in parsed) return parsed.error;
  const input = parsed.data;

  try {
    const borrow = await withLocks(
      labId,
      ['borrows.json', 'items.json', 'units.json'],
      async () => {
        const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
        const items = readDb<Item>(labId, 'items.json');
        const units = readDb<Unit>(labId, 'units.json');
        const borrow = borrows.find((b) => b.id === borrowId);
        if (!borrow) throw new ApiError(404, 'Borrow not found');
        if (borrow.status === 'returned' || borrow.status === 'cancelled') {
          throw new ApiError(409, `Borrow is already ${borrow.status}`);
        }

        const now = new Date().toISOString();
        for (const ret of input.lines) {
          const line = borrow.lines.find((l) => l.id === ret.line_id);
          if (!line) throw new ApiError(404, `Line ${ret.line_id} not found`);
          const remaining = line.quantity - line.returned_quantity;
          if (ret.returned_quantity > remaining) {
            throw new ApiError(
              422,
              `Cannot return ${ret.returned_quantity}; only ${remaining} remaining`,
            );
          }
          line.returned_quantity += ret.returned_quantity;
          if (ret.returned_condition) line.returned_condition = ret.returned_condition;
          if (line.returned_quantity >= line.quantity) line.returned_at = now;

          if (line.unit_id) {
            const unit = units.find((u) => u.id === line.unit_id)!;
            unit.status = 'available';
            unit.current_borrow_id = null;
            if (ret.returned_condition) unit.condition = ret.returned_condition;
          } else {
            const item = items.find((i) => i.id === line.item_id)!;
            item.quantity_available = Math.min(
              item.quantity_available! + ret.returned_quantity,
              item.quantity_total!,
            );
          }
        }

        const allSettled = borrow.lines.every((l) => l.returned_quantity >= l.quantity);
        const anySettled = borrow.lines.some((l) => l.returned_quantity > 0);
        borrow.status = allSettled
          ? 'returned'
          : anySettled
            ? 'partially_returned'
            : borrow.status;
        if (allSettled) borrow.returned_at = now;
        if (input.return_sig_data) borrow.return_sig_data = input.return_sig_data;
        borrow.updated_at = now;

        await commit({
          labId,
          writes: [
            ['borrows.json', borrows],
            ['items.json', items],
            ['units.json', units],
          ],
          audit: {
            action: allSettled ? 'borrow.return' : 'borrow.partial_return',
            entity_type: 'borrow',
            entity_id: borrowId,
            actor_id: user.user_id,
            actor_role: membership?.role ?? 'technician',
            after: { status: borrow.status },
            ip: ctx.getClientAddress(),
          },
        });

        return borrow;
      },
    );
    return ok(borrow);
  } catch (e) {
    if (e instanceof ApiError) return err(e.status, e.message);
    throw e;
  }
}, { minRole: 'technician' });
