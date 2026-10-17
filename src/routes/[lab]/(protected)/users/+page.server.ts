import { redirect } from '@sveltejs/kit';
import { readDb } from '$lib/db.js';
import type { User, LabMembership, BorrowRecord } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url }) => {
  const { lab, membership } = await parent();
  if (!['admin', 'manager'].includes(membership!.role)) throw redirect(302, `/${(await parent()).lab?.slug}/`);

  const labId = lab!.id;
  const members = readDb<LabMembership>('_global', 'lab_memberships.json').filter((m) => m.lab_id === labId && m.is_active);
  const users = readDb<User>('_global', 'users.json');
  const borrows = readDb<BorrowRecord>(labId, 'borrows.json');

  const q = url.searchParams.get('q')?.toLowerCase() ?? '';

  const rows = members.map((m) => {
    const u = users.find((x) => x.id === m.user_id);
    if (!u) return null;
    const activeBorrows = borrows.filter((b) => b.user_id === m.user_id && ['active', 'overdue', 'partially_returned'].includes(b.status)).length;
    return { userId: u.id, name: u.redacted_at ? '[REDACTED]' : (u.name ?? ''), email: u.redacted_at ? '[REDACTED]' : u.email, role: m.role, userType: m.user_type ?? null, activeBorrows, noShows: m.no_show_count ?? 0, restrictedUntil: m.borrow_restricted_until ?? null };
  }).filter(Boolean) as { userId: string; name: string; email: string; role: string; userType: string | null; activeBorrows: number; noShows: number; restrictedUntil: string | null }[];

  const filtered = q ? rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)) : rows;

  return { rows: filtered, q, labId, labSlug: lab!.slug, role: membership!.role };
};
