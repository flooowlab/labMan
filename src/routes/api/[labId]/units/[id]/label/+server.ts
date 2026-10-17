import { withAuth, err } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import { buildLabelHtml } from '$lib/label.js';
import type { Item, Unit, Lab } from '$lib/types.js';

/**
 * GET /api/:labId/units/:id/label
 * Returns a single-label HTML page for the given unit.
 */
export const GET = withAuth(async (ctx, _user, _membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  const units = readDb<Unit>(labId, 'units.json');
  const unit = units.find((u) => u.id === id && !u.deleted_at);
  if (!unit) return err(404, 'Unit not found');

  const items = readDb<Item>(labId, 'items.json');
  const item = items.find((i) => i.id === unit.item_id && !i.deleted_at);
  if (!item) return err(404, 'Item not found');

  const labs = readDb<Lab>('_global', 'labs.json');
  const lab = labs.find((l) => l.id === labId);
  const labName = lab?.name ?? labId;

  const html = await buildLabelHtml(item, [unit], { labName });

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}, { minRole: 'viewer' });
