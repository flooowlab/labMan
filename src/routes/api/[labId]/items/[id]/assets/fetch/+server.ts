import { withAuth, ok, err } from '$lib/middleware.js';
import { fetchItemAssets } from '$lib/assets.js';
import { readDb } from '$lib/db.js';
import type { Item } from '$lib/types.js';

// POST /api/:labId/items/:id/assets/fetch
// Triggers a manual asset fetch for a single item.
export const POST = withAuth(async (ctx) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  const items = readDb<Item>(labId, 'items.json');
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, 'Item not found');

  const result = await fetchItemAssets(labId, id);
  return ok(result);
}, { minRole: 'manager' });
