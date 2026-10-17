import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import type { User, LabMembership, BorrowRecord, Reservation } from '$lib/types.js';

// GET /api/:labId/users/:id/export?format=json|csv
export const GET = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };
  const isSelf = id === user.user_id;
  const isManagerPlus = membership && ['admin', 'manager'].includes(membership.role);
  if (!isSelf && !isManagerPlus) return err(403, 'Forbidden');

  const users = readDb<User>('_global', 'users.json');
  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');

  const u = users.find((x) => x.id === id);
  if (!u) return err(404, 'User not found');
  const m = memberships.find((x) => x.user_id === id && x.lab_id === labId);
  if (!m) return err(404, 'User is not a member of this lab');

  const borrows = readDb<BorrowRecord>(labId, 'borrows.json').filter((b) => b.user_id === id);
  const reservations = readDb<Reservation>(labId, 'reservations.json').filter(
    (r) => r.user_id === id,
  );

  const redacted = !!u.redacted_at;
  const userData = {
    id: u.id,
    name: redacted ? '[REDACTED]' : u.name,
    email: redacted ? '[REDACTED]' : u.email,
    rfid_tag: redacted ? null : u.rfid_tag,
    is_active: u.is_active,
    created_at: u.created_at,
    redacted_at: u.redacted_at,
  };

  const format = ctx.url.searchParams.get('format') ?? 'json';

  if (format === 'csv') {
    const rows = [
      'borrow_id,status,borrowed_at,due_date,returned_at,line_count',
      ...borrows.map((b) =>
        [b.id, b.status, b.borrowed_at, b.due_date, b.returned_at ?? '', b.lines.length].join(','),
      ),
    ];
    return new Response(rows.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="user-${id}-export.csv"`,
      },
    });
  }

  return ok({ user: userData, membership: m, borrows, reservations });
}, { minRole: 'viewer' });
