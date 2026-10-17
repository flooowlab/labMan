// @ts-nocheck
import type { PageServerLoad } from './$types';
export const load = async ({ parent, params }: Parameters<PageServerLoad>[0]) => {
  const { lab } = await parent();
  return { labId: lab!.id, labSlug: params.lab, borrowId: params.id };
};
