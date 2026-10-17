import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  if (!['admin', 'manager'].includes(membership!.role)) throw redirect(302, `/${params.lab}/kits`);
  return { labId: lab!.id, labSlug: params.lab };
};
