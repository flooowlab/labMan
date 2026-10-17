// @ts-nocheck
import { readDb } from '$lib/db.js';
import { verifyToken } from '$lib/auth.js';
import type { Item, Lab, LabMembership, User } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ params, cookies }: Parameters<PageServerLoad>[0]) => {
  const labs = readDb<Lab>('_global', 'labs.json');
  const lab = labs.find((l) => l.slug === params.lab);
  if (!lab) return { items: [], lab: null, token: null, userRole: null, coordinator: null };
  const items = readDb<Item>(lab.id, 'items.json').filter((i) => !i.deleted_at);
  const token = cookies.get('token') ?? null;
  let userRole: string | null = null;
  if (token) {
    try {
      const payload = await verifyToken(token);
      userRole = payload.memberships.find((m) => m.lab_slug === params.lab)?.role ?? null;
    } catch { /* ignore */ }
  }
  // Derive coordinator: find first admin/manager member and look up their name
  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json')
    .filter((m) => m.lab_id === lab.id && m.is_active && ['admin', 'manager'].includes(m.role));
  const users = readDb<User>('_global', 'users.json');
  const coordMember = memberships.sort((a, b) => (a.role === 'admin' ? -1 : 1))[0];
  const coordUser = coordMember ? users.find((u) => u.id === coordMember.user_id && !u.redacted_at) : null;
  const coordinator = coordUser ? { name: coordUser.name, email: coordUser.email } : null;
  return { items, lab, token, userRole, coordinator };
};
