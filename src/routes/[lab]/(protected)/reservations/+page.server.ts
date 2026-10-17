import { readDb } from '$lib/db.js';
import type { Reservation, User } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab!.id;
  const role = membership!.role;
  const statusFilter = url.searchParams.get('status') ?? '';

  const allRes = readDb<Reservation>(labId, 'reservations.json');
  const users = readDb<User>('_global', 'users.json');

  const visible = ['student', 'viewer'].includes(role)
    ? allRes.filter((r) => r.user_id === authUser.user_id)
    : allRes;

  const filtered = statusFilter ? visible.filter((r) => r.status === statusFilter) : visible;
  const sorted = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name ?? u.id.slice(0, 8)]));

  return { reservations: sorted, userMap, statusFilter, labId, labSlug: lab!.slug };
};
