import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ parent }) => {
  const { lab } = await parent();
  return { labId: lab!.id };
};
