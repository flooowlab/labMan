// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import type { Unit, Location } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ parent, params }: Parameters<PageServerLoad>[0]) => {
  const { lab, membership } = await parent();
  if (!['admin', 'manager', 'technician'].includes(membership!.role))
    throw redirect(302, `/${params.lab}/inventory/${params.id}`);

  const labId = lab!.id;
  const unit = readDb<Unit>(labId, 'units.json').find(
    (u) => u.id === params.unitId && !u.deleted_at,
  );
  if (!unit) throw redirect(302, `/${params.lab}/inventory/${params.id}`);

  const locations = readDb<Location>(labId, 'locations.json').filter((l) => !l.deleted_at);
  return { unit, locations, labId, labSlug: params.lab, itemId: params.id };
};
