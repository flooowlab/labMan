// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/auth.js';
import type { PageServerLoad } from './$types';

export const load = async ({ cookies, url }: Parameters<PageServerLoad>[0]) => {
  const tok = cookies.get('token');
  if (tok) {
    try {
      const p = await verifyToken(tok);
      if (!p.partial) throw redirect(302, '/');
    } catch (e) {
      if ((e as { status?: number })?.status === 302) throw e;
      /* expired/invalid — fall through to login */
    }
  }
  return { next: url.searchParams.get('next') ?? '/' };
};
