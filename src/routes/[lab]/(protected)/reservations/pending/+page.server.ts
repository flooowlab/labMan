import { readDb } from '$lib/db.js';
import type { Reservation, User } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { lab, membership } = await parent();
  const labId = lab!.id;
  const canApprove = ['admin', 'manager', 'instructor'].includes(membership!.role);

  const pending = readDb<Reservation>(labId, 'reservations.json')
    .filter((r) => ['pending_instructor', 'pending_manager'].includes(r.status));
  const users = readDb<User>('_global', 'users.json');
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name ?? u.id.slice(0, 8)]));

  return { pending, userMap, canApprove, labId };
};
