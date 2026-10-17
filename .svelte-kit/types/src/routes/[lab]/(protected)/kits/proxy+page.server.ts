// @ts-nocheck
import { readDb } from '$lib/db.js';
import type { Kit, Item } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ parent }: Parameters<PageServerLoad>[0]) => {
  const { lab, membership } = await parent();
  const labId = lab!.id;
  const kits = readDb<Kit>(labId, 'kits.json').filter((k) => !k.deleted_at);
  const items = readDb<Item>(labId, 'items.json').filter((i) => !i.deleted_at);

  const rows = kits.map((k) => ({
    id: k.id,
    name: k.name,
    version: k.version,
    lineCount: k.lines.length,
    linePreview: k.lines.slice(0, 3).map((l) => items.find((i) => i.id === l.item_id)?.name ?? '(deleted)').join(', ') + (k.lines.length > 3 ? ` +${k.lines.length - 3} more` : ''),
  }));

  return { rows, isManager: ['admin', 'manager'].includes(membership!.role) };
};
