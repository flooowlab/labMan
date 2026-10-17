import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ parent, params }) => {
  const { lab } = await parent();
  return { labId: lab!.id, labSlug: params.lab };
};
