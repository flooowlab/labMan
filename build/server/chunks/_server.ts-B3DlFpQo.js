import { w as withAuth, o as ok } from './middleware-ngQf4GKt.js';
import { r as readAuditLog, v as verifyAuditChain } from './db-CfhGAyvN.js';
import { c as createAlert } from './alerts-D7Ogxya5.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import './ids-CipgF91a.js';

const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId;
  const sp = ctx.url.searchParams;
  const actorFilter = sp.get("actor_id") ?? "";
  const actionFilter = sp.get("action") ?? "";
  const entityFilter = sp.get("entity_type") ?? "";
  const fromFilter = sp.get("from") ?? "";
  const toFilter = sp.get("to") ?? "";
  const limit = Math.min(parseInt(sp.get("limit") ?? "500", 10), 2e3);
  const all = readAuditLog(labId);
  const chain_valid = verifyAuditChain(all);
  if (!chain_valid) {
    await createAlert(labId, {
      kind: "incident_open",
      severity: "critical",
      message: `Audit log HMAC chain is broken for lab ${labId} — possible tampering`
    });
  }
  let filtered = all;
  if (actorFilter) filtered = filtered.filter((e) => e.actor_id === actorFilter);
  if (actionFilter) filtered = filtered.filter((e) => e.action.includes(actionFilter));
  if (entityFilter) filtered = filtered.filter((e) => e.entity_type === entityFilter);
  if (fromFilter) filtered = filtered.filter((e) => e.ts >= fromFilter);
  if (toFilter) filtered = filtered.filter((e) => e.ts <= toFilter);
  const entries = filtered.slice(-limit).reverse();
  return ok({ entries, chain_valid, total: filtered.length });
}, { minRole: "admin" });

export { GET };
//# sourceMappingURL=_server.ts-B3DlFpQo.js.map
