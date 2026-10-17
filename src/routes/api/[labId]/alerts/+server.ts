import { withAuth, ok } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import type { Alert } from '$lib/types.js';

/**
 * GET /api/:labId/alerts
 * Query params: kind, severity, resolved (true|false), acknowledged (true|false)
 *
 * Role filter:
 *   student   → only alerts for their own user_id or borrow_id
 *   manager+  → all alerts for the lab
 */
export const GET = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const { searchParams } = ctx.url;

  let alerts = readDb<Alert>(labId, 'alerts.json');

  if (membership?.role === 'student') {
    alerts = alerts.filter((a) => a.user_id === user.user_id);
  }

  const kind = searchParams.get('kind');
  if (kind) alerts = alerts.filter((a) => a.kind === kind);

  const severity = searchParams.get('severity');
  if (severity) alerts = alerts.filter((a) => a.severity === severity);

  const resolved = searchParams.get('resolved');
  if (resolved === 'true') alerts = alerts.filter((a) => a.resolved_at !== null);
  if (resolved === 'false') alerts = alerts.filter((a) => a.resolved_at === null);

  const acknowledged = searchParams.get('acknowledged');
  if (acknowledged === 'true') alerts = alerts.filter((a) => a.acknowledged);
  if (acknowledged === 'false') alerts = alerts.filter((a) => !a.acknowledged);

  return ok(alerts);
}, { minRole: 'viewer' });
