// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import { verifyToken } from '$lib/auth.js';
import type { Lab, JwtPayload } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  const allLabs = readDb<Lab>('_global', 'labs.json').filter((l) => l.is_active);

  let loggedInUser: JwtPayload | null = null;
  const tok = cookies.get('token');
  if (tok) {
    try {
      const p = await verifyToken(tok);
      if (!p.partial) loggedInUser = p;
    } catch { /* expired / invalid */ }
  }

  if (loggedInUser) {
    const myLabs = allLabs.filter((l) =>
      loggedInUser!.memberships.some((m) => m.lab_id === l.id),
    );
    if (myLabs.length === 1) throw redirect(302, `/${myLabs[0]!.slug}/`);
  } else {
    if (allLabs.length === 1) throw redirect(302, `/${allLabs[0]!.slug}/catalog`);
  }

  return { labs: allLabs, loggedInUser };
};
