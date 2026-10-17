import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { p as parseBody, b as ItemPatchSchema } from './validate-NtJDb-c4.js';
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
  const items = readDb(labId, "items.json");
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, "Item not found");
  let available_count;
  if (item.tracking_mode === "serialized") {
    const units = readDb(labId, "units.json");
    available_count = units.filter(
      (u) => u.item_id === id && u.status === "available" && !u.deleted_at
    ).length;
  } else {
    available_count = item.quantity_available ?? 0;
  }
  return ok({ ...item, available_count });
}, { minRole: "viewer" });
const PATCH = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const id = ctx.params.id;
  const parsed = await parseBody(ctx.request, ItemPatchSchema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;
  return withLocks(labId, ["borrows.json", "items.json", "units.json"], async () => {
    const items = readDb(labId, "items.json");
    const item = items.find((i) => i.id === id && !i.deleted_at);
    if (!item) return err(404, "Item not found");
    if (data.tracking_mode && data.tracking_mode !== item.tracking_mode) {
      const units = readDb(labId, "units.json");
      const borrows = readDb(labId, "borrows.json");
      const hasUnits = units.some((u) => u.item_id === id && !u.deleted_at);
      const hasBorrows = borrows.some((b) => b.lines.some((l) => l.item_id === id));
      if (hasUnits || hasBorrows) {
        return err(
          409,
          "Cannot change tracking_mode: existing references exist. Create a new item instead."
        );
      }
    }
    const newMode = data.tracking_mode ?? item.tracking_mode;
    const newTotal = data.quantity_total !== void 0 ? data.quantity_total : item.quantity_total;
    const newAvailable = data.quantity_available !== void 0 ? data.quantity_available : item.quantity_available;
    if (newMode === "bulk") {
      if (newTotal == null || newAvailable == null)
        return err(422, "Bulk items must have quantity_total and quantity_available");
      if (newAvailable < 0 || newAvailable > newTotal)
        return err(422, "quantity_available must be between 0 and quantity_total");
    }
    const before = { name: item.name, tracking_mode: item.tracking_mode };
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const patch = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== void 0)
    );
    Object.assign(item, patch, { updated_at: now });
    await commit({
      labId,
      writes: [["items.json", items]],
      audit: {
        action: "item.update",
        entity_type: "item",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        before,
        after: { name: item.name, tracking_mode: item.tracking_mode },
        ip: ctx.getClientAddress()
      }
    });
    return ok(item);
  });
}, { minRole: "technician" });
const DELETE = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const id = ctx.params.id;
  return withLocks(labId, ["borrows.json", "items.json"], async () => {
    const items = readDb(labId, "items.json");
    const item = items.find((i) => i.id === id && !i.deleted_at);
    if (!item) return err(404, "Item not found");
    const borrows = readDb(labId, "borrows.json");
    const hasActive = borrows.some(
      (b) => ["active", "partially_returned", "overdue"].includes(b.status) && b.lines.some((l) => l.item_id === id)
    );
    if (hasActive) return err(409, "Cannot delete item: active borrows exist");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    item.deleted_at = now;
    item.updated_at = now;
    await commit({
      labId,
      writes: [["items.json", items]],
      audit: {
        action: "item.delete",
        entity_type: "item",
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
//# sourceMappingURL=_server.ts-DHSg8zO8.js.map
