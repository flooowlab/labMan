import { redirect } from '@sveltejs/kit';
import { requirePage } from '$lib/page-auth.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, cookies }) => {
  const auth = await requirePage(cookies.get('token'), params.lab);
  if ('redirect' in auth) throw redirect(302, auth.redirect);
  return auth; // { user, membership, lab }
};
