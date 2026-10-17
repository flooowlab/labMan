// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import type { Item, Location } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ parent, params }: Parameters<PageServerLoad>[0]) => {
  const { lab, membership } = await parent();
  if (!['admin', 'manager', 'technician'].includes(membership!.role)) throw redirect(302, `/${params.lab}/inventory/${params.id}`);
  const labId = lab!.id;
  const item = readDb<Item>(labId, 'items.json').find((i) => i.id === params.id && !i.deleted_at);
  if (!item) throw redirect(302, `/${params.lab}/inventory`);
  const locations = readDb<Location>(labId, 'locations.json');
  return { item, locations, labId, labSlug: params.lab };
};
