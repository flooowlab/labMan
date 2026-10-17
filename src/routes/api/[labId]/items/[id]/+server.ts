import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { ItemPatchSchema, parseBody } from '$lib/validate.js';
import type { Item, Unit, BorrowRecord } from '$lib/types.js';

// GET /api/:labId/items/:id
export const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  const items = readDb<Item>(labId, 'items.json');
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, 'Item not found');

  let available_count: number;
  if (item.tracking_mode === 'serialized') {
    const units = readDb<Unit>(labId, 'units.json');
    available_count = units.filter(
      (u) => u.item_id === id && u.status === 'available' && !u.deleted_at,
    ).length;
  } else {
    available_count = item.quantity_available ?? 0;
  }

  return ok({ ...item, available_count });
}, { minRole: 'viewer' });

// PATCH /api/:labId/items/:id  — partial update; guards tracking_mode change
export const PATCH = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  const parsed = await parseBody(ctx.request, ItemPatchSchema);
  if ('error' in parsed) return parsed.error;
  const data = parsed.data;

  return withLocks(labId, ['borrows.json', 'items.json', 'units.json'], async () => {
    const items = readDb<Item>(labId, 'items.json');
    const item = items.find((i) => i.id === id && !i.deleted_at);
    if (!item) return err(404, 'Item not found');

    // Guard: forbid tracking_mode change when units or borrows reference the item
    if (data.tracking_mode && data.tracking_mode !== item.tracking_mode) {
      const units = readDb<Unit>(labId, 'units.json');
      const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
      const hasUnits = units.some((u) => u.item_id === id && !u.deleted_at);
      const hasBorrows = borrows.some((b) => b.lines.some((l) => l.item_id === id));
      if (hasUnits || hasBorrows) {
        return err(
          409,
          'Cannot change tracking_mode: existing references exist. Create a new item instead.',
        );
      }
    }

    // Validate bulk quantity constraints after merge
    const newMode = data.tracking_mode ?? item.tracking_mode;
    const newTotal =
      data.quantity_total !== undefined ? data.quantity_total : item.quantity_total;
    const newAvailable =
      data.quantity_available !== undefined ? data.quantity_available : item.quantity_available;
    if (newMode === 'bulk') {
      if (newTotal == null || newAvailable == null)
        return err(422, 'Bulk items must have quantity_total and quantity_available');
      if (newAvailable < 0 || newAvailable > newTotal)
        return err(422, 'quantity_available must be between 0 and quantity_total');
    }

    const before = { name: item.name, tracking_mode: item.tracking_mode };
    const now = new Date().toISOString();

    // Merge — skip undefined values so absent fields don't overwrite with undefined
    const patch = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
    Object.assign(item, patch, { updated_at: now });

    await commit({
      labId,
      writes: [['items.json', items]],
      audit: {
        action: 'item.update',
        entity_type: 'item',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        before,
        after: { name: item.name, tracking_mode: item.tracking_mode },
        ip: ctx.getClientAddress(),
      },
    });

    return ok(item);
  });
}, { minRole: 'technician' });

// DELETE /api/:labId/items/:id  — soft-delete; refuses if active borrows exist
export const DELETE = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  return withLocks(labId, ['borrows.json', 'items.json'], async () => {
    const items = readDb<Item>(labId, 'items.json');
    const item = items.find((i) => i.id === id && !i.deleted_at);
    if (!item) return err(404, 'Item not found');

    const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
    const hasActive = borrows.some(
      (b) =>
        ['active', 'partially_returned', 'overdue'].includes(b.status) &&
        b.lines.some((l) => l.item_id === id),
    );
    if (hasActive) return err(409, 'Cannot delete item: active borrows exist');

    const now = new Date().toISOString();
    item.deleted_at = now;
    item.updated_at = now;

    await commit({
      labId,
      writes: [['items.json', items]],
      audit: {
        action: 'item.delete',
        entity_type: 'item',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        ip: ctx.getClientAddress(),
      },
    });

    return ok({ deleted: true });
  });
}, { minRole: 'manager' });
