// @ts-nocheck
import { readDb } from '$lib/db.js';
import type { Item, User, LabMembership } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load = async ({ parent, params }: Parameters<PageServerLoad>[0]) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab!.id;
  const allItems = readDb<Item>(labId, 'items.json').filter((i) => !i.deleted_at);
  const allMemberships = readDb<LabMembership>('_global', 'lab_memberships.json');
  const allUsers = readDb<User>('_global', 'users.json');
  const instructors = allMemberships
    .filter((m) => m.lab_id === labId && m.role === 'instructor' && m.is_active)
    .map((m) => allUsers.find((u) => u.id === m.user_id && !u.redacted_at))
    .filter(Boolean)
    .map((u) => ({ id: (u as User).id, name: (u as User).name ?? '' }));

  return {
    labId,
    labSlug: params.lab,
    userId: authUser.user_id,
    isStudent: membership!.role === 'student',
    items: allItems.map((i) => ({ id: i.id, name: i.name, category: i.category ?? null })),
    instructors,
  };
};
