import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { A as AccessorySchema } from './validate-NtJDb-c4.js';
import { n as newId } from './ids-CipgF91a.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

function readAccessories(labId, parentId) {
  return readDb(labId, "item_accessories.json").filter(
    (a) => a.parent_item_id === parentId && !a.deleted_at
  );
}
const GET = withAuth(async (ctx) => {
  const { labId, id } = ctx.params;
  const items = readDb(labId, "items.json");
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, "Item not found");
  const accessories = readAccessories(labId, id);
  const enriched = accessories.map((a) => {
    const accItem = items.find((i) => i.id === a.accessory_item_id && !i.deleted_at);
    return {
      ...a,
      accessory_item_name: accItem?.name ?? "(deleted)",
      accessory_item_category: accItem?.category ?? "",
      accessory_item_sku: accItem?.sku ?? ""
    };
  });
  return ok(enriched);
}, { minRole: "viewer" });
const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return err(400, "Invalid JSON");
  }
  const parsed = AccessorySchema.safeParse(body);
  if (!parsed.success) return err(422, parsed.error.issues[0]?.message ?? "Validation error");
  const data = parsed.data;
  return withLocks(labId, ["item_accessories.json", "items.json"], async () => {
    const items = readDb(labId, "items.json");
    const item = items.find((i) => i.id === id && !i.deleted_at);
    if (!item) return err(404, "Item not found");
    const accItem = items.find((i) => i.id === data.accessory_item_id && !i.deleted_at);
    if (!accItem) return err(404, "Accessory item not found");
    if (accItem.id === id) return err(400, "An item cannot be its own accessory");
    const accessories = readDb(labId, "item_accessories.json");
    const existing = accessories.find(
      (a) => !a.deleted_at && a.parent_item_id === id && a.accessory_item_id === data.accessory_item_id
    );
    if (existing) return err(409, "This accessory relationship already exists");
    const acc = {
      id: newId(),
      lab_id: labId,
      parent_item_id: id,
      accessory_item_id: data.accessory_item_id,
      relation_type: data.relation_type,
      is_required: data.is_required,
      quantity_required: data.quantity_required,
      deleted_at: null
    };
    accessories.push(acc);
    await commit({
      labId,
      writes: [["item_accessories.json", accessories]],
      audit: {
        action: "item_accessory.create",
        entity_type: "item_accessory",
        entity_id: acc.id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        ip: ctx.getClientAddress()
      }
    });
    return ok(
      {
        ...acc,
        accessory_item_name: accItem.name,
        accessory_item_category: accItem.category,
        accessory_item_sku: accItem.sku ?? ""
      },
      201
    );
  });
}, { minRole: "manager" });
const DELETE = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  const accessoryId = new URL(ctx.request.url).searchParams.get("id");
  if (!accessoryId) return err(400, "Missing id query parameter");
  return withLocks(labId, ["item_accessories.json"], async () => {
    const accessories = readDb(labId, "item_accessories.json");
    const acc = accessories.find(
      (a) => a.id === accessoryId && a.parent_item_id === id && !a.deleted_at
    );
    if (!acc) return err(404, "Accessory relationship not found");
    acc.deleted_at = (/* @__PURE__ */ new Date()).toISOString();
    await commit({
      labId,
      writes: [["item_accessories.json", accessories]],
      audit: {
        action: "item_accessory.delete",
        entity_type: "item_accessory",
        entity_id: accessoryId,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        ip: ctx.getClientAddress()
      }
    });
    return ok({ ok: true });
  });
}, { minRole: "manager" });

export { DELETE, GET, POST };
//# sourceMappingURL=_server.ts-Si-LTqtb.js.map
