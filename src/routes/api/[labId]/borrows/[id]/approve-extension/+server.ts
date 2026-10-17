import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { getMembership } from '$lib/auth.js';
import type { BorrowRecord, BorrowExtension, Alert } from '$lib/types.js';

// POST /api/:labId/borrows/:id/approve-extension
export const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id: borrowId } = ctx.params as { labId: string; id: string };

  try {
    const borrow = await withLocks(
      labId,
      ['alerts.json', 'borrow_extensions.json', 'borrows.json'],
      async () => {
        const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
        const extensions = readDb<BorrowExtension>(labId, 'borrow_extensions.json');
        const alerts = readDb<Alert>(labId, 'alerts.json');

        const borrow = borrows.find((b) => b.id === borrowId);
        const ext = extensions.find((e) => e.borrow_id === borrowId && e.status === 'pending');
        if (!ext || !borrow) return err(404, 'Pending extension not found');

        const now = new Date().toISOString();
        ext.status = 'approved';
        ext.reviewed_by = user.user_id;
        ext.reviewed_at = now;
        borrow.due_date = ext.requested_due_date;
        borrow.updated_at = now;

        // Resolve any extension_requested alerts for this borrow
        alerts
          .filter(
            (a) => a.borrow_id === borrowId && a.kind === 'extension_requested' && !a.resolved_at,
          )
          .forEach((a) => {
            a.resolved_at = now;
          });

        await commit({
          labId,
          writes: [
            ['borrows.json', borrows],
            ['borrow_extensions.json', extensions],
            ['alerts.json', alerts],
          ],
          audit: {
            action: 'extension.approve',
            entity_type: 'borrow',
            entity_id: borrowId,
            actor_id: user.user_id,
            actor_role: membership?.role ?? 'manager',
            after: { new_due_date: borrow.due_date },
            ip: ctx.getClientAddress(),
          },
        });

        return borrow;
      },
    );
    if (borrow instanceof Response) return borrow;
    return ok(borrow);
  } catch (e) {
    throw e;
  }
}, { minRole: 'manager' });
