import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import { sanitizeCode } from '$lib/validate.js';
import type { Item, Unit } from '$lib/types.js';

// GET /api/:labId/items/barcode/:code
// Dispatches to items or units table based on the discriminator in position [2]:
//   LAB-{YEAR}-I-{n}  →  item
//   LAB-{YEAR}-U-{n}  →  unit
export const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId!;
  const code = sanitizeCode(ctx.params.code ?? '');
  if (!code) return err(400, 'Invalid barcode');

  const discriminator = code.split('-')[2]; // 'I' or 'U'

  if (discriminator === 'I') {
    const items = readDb<Item>(labId, 'items.json');
    const item = items.find((i) => i.barcode === code && !i.deleted_at);
    if (!item) return err(404, 'Item not found');
    return ok({ type: 'item' as const, data: item });
  }

  if (discriminator === 'U') {
    const units = readDb<Unit>(labId, 'units.json');
    const unit = units.find((u) => u.barcode === code && !u.deleted_at);
    if (!unit) return err(404, 'Unit not found');
    return ok({ type: 'unit' as const, data: unit });
  }

  return err(400, 'Unrecognized barcode format — expected LAB-{YEAR}-I-{n} or LAB-{YEAR}-U-{n}');
}, { minRole: 'viewer' });
