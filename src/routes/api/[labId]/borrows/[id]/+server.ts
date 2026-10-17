import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import type { BorrowRecord } from '$lib/types.js';

// GET /api/:labId/borrows/:id
export const GET = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };
  const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
  const borrow = borrows.find((b) => b.id === id);
  if (!borrow) return err(404, 'Borrow not found');

  // Students may only see their own
  if (membership?.role === 'student' && borrow.user_id !== user.user_id) {
    return err(403, 'Forbidden');
  }
  return ok(borrow);
}, { minRole: 'viewer' });
