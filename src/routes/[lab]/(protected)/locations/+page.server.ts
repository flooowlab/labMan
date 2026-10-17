import { readDb } from '$lib/db.js';
import type { Location } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { lab, membership } = await parent();
  const labId = lab!.id;
  const locations = readDb<Location>(labId, 'locations.json').filter((l) => !l.deleted_at);
  return { locations, labId, labSlug: lab!.slug, role: membership!.role };
};
