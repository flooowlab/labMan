import { withAuth, err } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import { buildLabelHtml } from '$lib/label.js';
import type { Item, Unit, Lab } from '$lib/types.js';

/**
 * GET /api/:labId/items/:id/label
 * Query params:
 *   format = "pdf" (default) | "sheet" | "units-sheet"
 *   count  = integer (sheet only, default 8)
 *
 * Returns HTML suitable for browser printing.
 * "pdf"         — single label for bulk items
 * "sheet"       — N repeated labels on one page (bulk)
 * "units-sheet" — one label per unit (serialized)
 */
export const GET = withAuth(async (ctx, _user, _membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };
  const format = ctx.url.searchParams.get('format') ?? 'pdf';
  const count = parseInt(ctx.url.searchParams.get('count') ?? '8', 10) || 8;

  const items = readDb<Item>(labId, 'items.json');
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, 'Item not found');

  const labs = readDb<Lab>('_global', 'labs.json');
  const lab = labs.find((l) => l.id === labId);
  const labName = lab?.name ?? labId;

  let units: Unit[] = [];
  if (format === 'units-sheet' || item.tracking_mode === 'serialized') {
    units = readDb<Unit>(labId, 'units.json').filter(
      (u) => u.item_id === id && !u.deleted_at && u.status !== 'retired',
    );
  }

  const html = await buildLabelHtml(item, units, {
    labName,
    count: format === 'sheet' ? count : 1,
  });

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}, { minRole: 'viewer' });
