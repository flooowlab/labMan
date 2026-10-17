// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { requirePage } from '$lib/page-auth.js';
import type { LayoutServerLoad } from './$types';

export const load = async ({ params, cookies }: Parameters<LayoutServerLoad>[0]) => {
  const auth = await requirePage(cookies.get('token'), params.lab);
  if ('redirect' in auth) throw redirect(302, auth.redirect);
  return auth; // { user, membership, lab }
};
