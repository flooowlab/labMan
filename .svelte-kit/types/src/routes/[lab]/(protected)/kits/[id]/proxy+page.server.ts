// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import type { Kit, Item } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ parent, params }: Parameters<PageServerLoad>[0]) => {
  const { lab, membership } = await parent();
  const labId = lab!.id;
  const kit = readDb<Kit>(labId, 'kits.json').find((k) => k.id === params.id && !k.deleted_at);
  if (!kit) throw redirect(302, `/${params.lab}/kits`);
  const items = readDb<Item>(labId, 'items.json');
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.name]));
  const canEdit = ['admin', 'manager'].includes(membership!.role);
  return { kit, itemMap, labId, labSlug: params.lab, canEdit };
};
