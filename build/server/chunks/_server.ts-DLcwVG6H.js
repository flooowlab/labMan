import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { p as parseBody, K as KitSchema } from './validate-NtJDb-c4.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId;
  const id = ctx.params.id;
  const kits = readDb(labId, "kits.json");
  const kit = kits.find((k) => k.id === id && !k.deleted_at);
  if (!kit) return err(404, "Kit not found");
  return ok(kit);
}, { minRole: "viewer" });
const PATCH = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const id = ctx.params.id;
  const parsed = await parseBody(ctx.request, KitSchema.partial());
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;
  return withLocks(labId, ["kits.json"], async () => {
    const kits = readDb(labId, "kits.json");
    const kit = kits.find((k) => k.id === id && !k.deleted_at);
    if (!kit) return err(404, "Kit not found");
    const before = { name: kit.name, version: kit.version };
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (data.name !== void 0) kit.name = data.name;
    if (data.description !== void 0) kit.description = data.description ?? "";
    if (data.availability_rule_id !== void 0)
      kit.availability_rule_id = data.availability_rule_id ?? null;
    if (data.lines !== void 0) {
      kit.lines = data.lines.map((l) => ({
        item_id: l.item_id,
        quantity: l.quantity,
        is_required: l.is_required ?? true
      }));
      kit.version += 1;
    }
    kit.updated_at = now;
    await commit({
      labId,
      writes: [["kits.json", kits]],
      audit: {
        action: "kit.update",
        entity_type: "kit",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        before,
        after: { name: kit.name, version: kit.version },
        ip: ctx.getClientAddress()
      }
    });
    return ok(kit);
  });
}, { minRole: "manager" });
const DELETE = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const id = ctx.params.id;
  return withLocks(labId, ["kits.json"], async () => {
    const kits = readDb(labId, "kits.json");
    const kit = kits.find((k) => k.id === id && !k.deleted_at);
    if (!kit) return err(404, "Kit not found");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    kit.deleted_at = now;
    kit.updated_at = now;
    await commit({
      labId,
      writes: [["kits.json", kits]],
      audit: {
        action: "kit.delete",
        entity_type: "kit",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        ip: ctx.getClientAddress()
      }
    });
    return ok({ deleted: true });
  });
}, { minRole: "manager" });

export { DELETE, GET, PATCH };
//# sourceMappingURL=_server.ts-DLcwVG6H.js.map
