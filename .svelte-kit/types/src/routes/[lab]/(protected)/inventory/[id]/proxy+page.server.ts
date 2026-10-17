// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import type { Item, Unit } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ parent, params }: Parameters<PageServerLoad>[0]) => {
  const { lab, membership } = await parent();
  const labId = lab!.id;
  const item = readDb<Item>(labId, 'items.json').find((i) => i.id === params.id && !i.deleted_at);
  if (!item) throw redirect(302, `/${params.lab}/inventory`);

  const units = readDb<Unit>(labId, 'units.json').filter((u) => u.item_id === item.id && !u.deleted_at);
  const availCount = item.tracking_mode === 'bulk'
    ? (item.quantity_available ?? 0)
    : units.filter((u) => u.status === 'available').length;

  const canEdit = ['admin', 'manager', 'technician'].includes(membership!.role);
  return { item, units, availCount, labId, canEdit };
};
