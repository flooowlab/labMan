import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { UnitSchema, parseBody } from '$lib/validate.js';
import { generateUnitBarcode, newId } from '$lib/ids.js';
import type { Item, Unit, Lab } from '$lib/types.js';

// GET /api/:labId/items/:id/units  — list units for a serialized item
export const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  const items = readDb<Item>(labId, 'items.json');
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, 'Item not found');
  if (item.tracking_mode !== 'serialized')
    return err(422, 'Item is not serialized; it has no units');

  const status = new URL(ctx.request.url).searchParams.get('status');
  let units = readDb<Unit>(labId, 'units.json').filter(
    (u) => u.item_id === id && !u.deleted_at,
  );
  if (status) units = units.filter((u) => u.status === status);

  return ok(units);
}, { minRole: 'viewer' });

// POST /api/:labId/items/:id/units  — add a unit to a serialized item
export const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  // item_id comes from URL param, not request body
  const parsed = await parseBody(ctx.request, UnitSchema.omit({ item_id: true }));
  if ('error' in parsed) return parsed.error;
  const data = parsed.data;

  const items = readDb<Item>(labId, 'items.json');
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, 'Item not found');
  if (item.tracking_mode !== 'serialized')
    return err(422, 'Units can only be added to serialized items');

  const labs = readDb<Lab>('_global', 'labs.json');
  const lab = labs.find((l) => l.id === labId);
  const origin = new URL(ctx.request.url).origin;

  return withLocks(labId, ['units.json'], async () => {
    const units = readDb<Unit>(labId, 'units.json');
    const unitId = newId();
    const barcode = generateUnitBarcode(units);
    const qr_code = `${origin}/${lab?.slug ?? labId}/u/${unitId}`;
    const now = new Date().toISOString();

    const unit: Unit = {
      id: unitId,
      lab_id: labId,
      item_id: id,
      barcode,
      qr_code,
      serial_number: data.serial_number ?? null,
      asset_tag: data.asset_tag ?? null,
      status: 'available',
      condition: data.condition ?? 'good',
      current_borrow_id: null,
      location_id: data.location_id ?? null,
      purchase_date: data.purchase_date ?? null,
      purchase_price: data.purchase_price ?? null,
      warranty_until: data.warranty_until ?? null,
      notes: data.notes ?? '',
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };

    await commit({
      labId,
      writes: [['units.json', [...units, unit]]],
      audit: {
        action: 'unit.create',
        entity_type: 'unit',
        entity_id: unitId,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        after: { item_id: id, barcode: unit.barcode },
        ip: ctx.getClientAddress(),
      },
    });

    return ok(unit, 201);
  });
}, { minRole: 'technician' });
