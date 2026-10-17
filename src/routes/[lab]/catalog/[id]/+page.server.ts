import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import { verifyToken } from '$lib/auth.js';
import type { Item, Lab, LabMembershipToken } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const labs = readDb<Lab>('_global', 'labs.json');
  const lab = labs.find((l) => l.slug === params.lab);
  if (!lab) throw redirect(302, '/');
  const item = readDb<Item>(lab.id, 'items.json').find((i) => i.id === params.id && !i.deleted_at);
  if (!item) throw redirect(302, `/${params.lab}/catalog`);
  const token = cookies.get('token') ?? null;
  let userMembership: LabMembershipToken | null = null;
  if (token) {
    try {
      const payload = await verifyToken(token);
      userMembership = payload.memberships.find((m) => m.lab_slug === params.lab) ?? null;
    } catch { /* invalid token — treat as unauthenticated */ }
  }
  return { item, lab, token, userMembership };
};
