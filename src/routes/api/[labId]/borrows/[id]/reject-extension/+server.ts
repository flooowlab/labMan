import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import type { BorrowExtension, Alert } from '$lib/types.js';

// POST /api/:labId/borrows/:id/reject-extension
export const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id: borrowId } = ctx.params as { labId: string; id: string };

  let rejection_reason = '';
  try {
    const body = await ctx.request.json() as { reason?: string };
    rejection_reason = body?.reason ?? '';
  } catch { /* body is optional */ }

  return withLocks(
    labId,
    ['alerts.json', 'borrow_extensions.json'],
    async () => {
      const extensions = readDb<BorrowExtension>(labId, 'borrow_extensions.json');
      const alerts = readDb<Alert>(labId, 'alerts.json');

      const ext = extensions.find((e) => e.borrow_id === borrowId && e.status === 'pending');
      if (!ext) return err(404, 'Pending extension not found');

      const now = new Date().toISOString();
      ext.status = 'rejected';
      ext.reviewed_by = user.user_id;
      ext.reviewed_at = now;
      ext.rejection_reason = rejection_reason;

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
          ['borrow_extensions.json', extensions],
          ['alerts.json', alerts],
        ],
        audit: {
          action: 'extension.reject',
          entity_type: 'borrow',
          entity_id: borrowId,
          actor_id: user.user_id,
          actor_role: membership?.role ?? 'manager',
          after: { rejection_reason },
          ip: ctx.getClientAddress(),
        },
      });

      return ok(ext);
    },
  );
}, { minRole: 'manager' });
