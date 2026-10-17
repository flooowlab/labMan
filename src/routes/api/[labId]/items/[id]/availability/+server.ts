import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import type { Item, Unit, BorrowRecord } from '$lib/types.js';

// GET /api/:labId/items/:id/availability
// Returns current unit/quantity availability breakdown.
// Window-based conflict checking (reservations) is added in Phase 5.
export const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  const items = readDb<Item>(labId, 'items.json');
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, 'Item not found');

  if (item.tracking_mode === 'serialized') {
    const units = readDb<Unit>(labId, 'units.json').filter(
      (u) => u.item_id === id && !u.deleted_at,
    );
    const byStatus: Record<string, number> = {};
    for (const u of units) {
      byStatus[u.status] = (byStatus[u.status] ?? 0) + 1;
    }
    return ok({
      item_id: id,
      tracking_mode: 'serialized' as const,
      total: units.length,
      available: byStatus['available'] ?? 0,
      borrowed: byStatus['borrowed'] ?? 0,
      reserved: byStatus['reserved'] ?? 0,
      maintenance: byStatus['maintenance'] ?? 0,
      retired: byStatus['retired'] ?? 0,
      lost: byStatus['lost'] ?? 0,
    });
  } else {
    const activeBorrows = readDb<BorrowRecord>(labId, 'borrows.json').filter(
      (b) => b.status === 'active' || b.status === 'partially_returned',
    );
    const borrowed = activeBorrows
      .flatMap((b) => b.lines.filter((l) => l.item_id === id && !l.unit_id && !l.returned_at))
      .reduce((s, l) => s + (l.quantity - l.returned_quantity), 0);

    return ok({
      item_id: id,
      tracking_mode: 'bulk' as const,
      total: item.quantity_total ?? 0,
      available: item.quantity_available ?? 0,
      borrowed,
    });
  }
}, { minRole: 'viewer' });
