import { withAuth, ok, err } from '$lib/middleware.js';
import { readAuditLog, verifyAuditChain } from '$lib/db.js';
import { createAlert } from '$lib/alerts.js';

// GET /api/:labId/audit
// Returns audit entries with chain_valid flag.
// A broken chain triggers a critical alert.
// Query params: actor_id, action, entity_type, from (ISO), to (ISO), limit (default 500)
export const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId!;
  const sp = ctx.url.searchParams;

  const actorFilter     = sp.get('actor_id') ?? '';
  const actionFilter    = sp.get('action') ?? '';
  const entityFilter    = sp.get('entity_type') ?? '';
  const fromFilter      = sp.get('from') ?? '';
  const toFilter        = sp.get('to') ?? '';
  const limit           = Math.min(parseInt(sp.get('limit') ?? '500', 10), 2000);

  const all = readAuditLog(labId);
  const chain_valid = verifyAuditChain(all);

  // Fire a one-time critical alert if chain is broken
  if (!chain_valid) {
    await createAlert(labId, {
      kind: 'incident_open',
      severity: 'critical',
      message: `Audit log HMAC chain is broken for lab ${labId} — possible tampering`,
    });
  }

  let filtered = all;
  if (actorFilter)  filtered = filtered.filter((e) => e.actor_id === actorFilter);
  if (actionFilter) filtered = filtered.filter((e) => e.action.includes(actionFilter));
  if (entityFilter) filtered = filtered.filter((e) => e.entity_type === entityFilter);
  if (fromFilter)   filtered = filtered.filter((e) => e.ts >= fromFilter);
  if (toFilter)     filtered = filtered.filter((e) => e.ts <= toFilter);

  // Return most recent first, capped by limit
  const entries = filtered.slice(-limit).reverse();

  return ok({ entries, chain_valid, total: filtered.length });
}, { minRole: 'admin' });
