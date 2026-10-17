import { readDb } from '$lib/db.js';
import type { BorrowRecord, Reservation, Alert, LabMembership, User } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { lab } = await parent();
  const labId = lab!.id;

  const borrows       = readDb<BorrowRecord>(labId, 'borrows.json');
  const reservations  = readDb<Reservation>(labId, 'reservations.json');
  const alerts        = readDb<Alert>(labId, 'alerts.json');
  const members       = readDb<LabMembership>('_global', 'lab_memberships.json').filter((m) => m.lab_id === labId);
  const users         = readDb<User>('_global', 'users.json');

  const overdue       = borrows.filter((b) => b.status === 'overdue');
  const activeLoans   = borrows.filter((b) => ['active', 'overdue', 'partially_returned'].includes(b.status));
  const pendingRes    = reservations.filter((r) => ['pending_instructor', 'pending_manager'].includes(r.status));
  const openAlerts    = alerts.filter((a) => !a.resolved_at);

  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name ?? u.id.slice(0, 8)]));

  return { overdue, activeLoans: activeLoans.length, pendingRes, openAlerts: openAlerts.length, memberCount: members.length, userMap };
};
