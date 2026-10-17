import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit, appendAudit } from '$lib/db.js';
import { getMembership } from '$lib/auth.js';
import { ExtensionRequestSchema, parseBody } from '$lib/validate.js';
import { newId } from '$lib/ids.js';
import type { BorrowRecord, BorrowExtension, Alert } from '$lib/types.js';

// POST /api/:labId/borrows/:id/request-extension
export const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id: borrowId } = ctx.params as { labId: string; id: string };

  const parsed = await parseBody(ctx.request, ExtensionRequestSchema);
  if ('error' in parsed) return parsed.error;
  const { requested_due_date, reason } = parsed.data;

  const borrows = readDb<BorrowRecord>(labId, 'borrows.json');
  const borrow = borrows.find((b) => b.id === borrowId);
  if (!borrow) return err(404, 'Borrow not found');
  if (borrow.user_id !== user.user_id) return err(403, 'Not your borrow');
  if (['returned', 'cancelled'].includes(borrow.status)) {
    return err(409, 'Cannot extend a completed borrow');
  }
  if (new Date(requested_due_date) > new Date(borrow.max_due_date)) {
    return err(422, `Requested date exceeds maximum allowed (${borrow.max_due_date})`);
  }

  const extensions = readDb<BorrowExtension>(labId, 'borrow_extensions.json');
  const existing = extensions.find((e) => e.borrow_id === borrowId && e.status === 'pending');
  if (existing) return err(409, 'An extension is already pending');

  const now = new Date().toISOString();
  const ext: BorrowExtension = {
    id: newId(),
    lab_id: labId,
    borrow_id: borrowId,
    requested_by: user.user_id,
    requested_due_date,
    status: 'pending',
    reviewed_by: null,
    reviewed_at: null,
    rejection_reason: '',
    created_at: now,
  };

  await withLocks(labId, ['alerts.json', 'borrow_extensions.json'], async () => {
    const extsFresh = readDb<BorrowExtension>(labId, 'borrow_extensions.json');
    const alerts = readDb<Alert>(labId, 'alerts.json');

    const alert: Alert = {
      id: newId(),
      lab_id: labId,
      kind: 'extension_requested',
      borrow_id: borrowId,
      reservation_id: null,
      item_id: null,
      user_id: user.user_id,
      message: `Extension requested for borrow ${borrowId}: ${reason}`,
      triggered_at: now,
      resolved_at: null,
      severity: 'info',
      acknowledged: false,
      acknowledged_by: null,
      acknowledged_at: null,
    };

    await commit({
      labId,
      writes: [
        ['borrow_extensions.json', [...extsFresh, ext]],
        ['alerts.json', [...alerts, alert]],
      ],
      audit: {
        action: 'extension.request',
        entity_type: 'borrow',
        entity_id: borrowId,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'student',
        after: { requested_due_date },
        ip: ctx.getClientAddress(),
      },
    });
  });

  return ok(ext, 201);
}, { minRole: 'viewer' });
