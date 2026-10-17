import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import type { Location } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  if (!['admin', 'manager'].includes(membership!.role)) throw redirect(302, `/${params.lab}/inventory`);
  const locations = readDb<Location>(lab!.id, 'locations.json');
  return { labId: lab!.id, labSlug: params.lab, locations };
};
