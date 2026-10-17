// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import type { User, LabMembership, BorrowRecord, Item } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ parent, params }: Parameters<PageServerLoad>[0]) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab!.id;
  const { id } = params;

  const isSelf = id === authUser.user_id;
  const isManagerPlus = ['admin', 'manager'].includes(membership!.role);
  if (!isSelf && !isManagerPlus) throw redirect(302, `/${params.lab}/`);

  const users = readDb<User>('_global', 'users.json');
  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');
  const u = users.find((x) => x.id === id);
  if (!u) throw redirect(302, `/${params.lab}/users`);
  const m = memberships.find((x) => x.user_id === id && x.lab_id === labId);
  if (!m) throw redirect(302, `/${params.lab}/users`);

  const borrows = readDb<BorrowRecord>(labId, 'borrows.json')
    .filter((b) => b.user_id === id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 50);

  const items = readDb<Item>(labId, 'items.json');
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.name]));

  return {
    labId,
    targetUser: { id: u.id, name: u.redacted_at ? '[REDACTED]' : (u.name ?? ''), email: u.redacted_at ? '[REDACTED]' : u.email, rfid_tag: u.rfid_tag, is_active: u.is_active, totp_enabled: u.totp_enabled, redacted_at: u.redacted_at ?? null },
    membership: { role: m.role, user_type: m.user_type, no_show_count: m.no_show_count ?? 0, borrow_restricted_until: m.borrow_restricted_until ?? null },
    borrows,
    itemMap,
    isManagerPlus,
    isAdmin: membership!.role === 'admin',
    isSelf,
  };
};
