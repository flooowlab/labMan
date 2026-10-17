import { w as withAuth, o as ok } from "../../../../../chunks/middleware.js";
import { a as readDb, w as withLocks, c as commit } from "../../../../../chunks/db.js";
import { p as parseBody, K as KitSchema } from "../../../../../chunks/validate.js";
import { n as newId } from "../../../../../chunks/ids.js";
const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId;
  const kits = readDb(labId, "kits.json").filter((k) => !k.deleted_at);
  return ok(kits);
}, { minRole: "viewer" });
const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const parsed = await parseBody(ctx.request, KitSchema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;
  return withLocks(labId, ["kits.json"], async () => {
    const kits = readDb(labId, "kits.json");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = newId();
    const kit = {
      id,
      lab_id: labId,
      name: data.name,
      version: 1,
      description: data.description ?? "",
      availability_rule_id: data.availability_rule_id ?? null,
      lines: data.lines.map((l) => ({
        item_id: l.item_id,
        quantity: l.quantity,
        is_required: l.is_required ?? true
      })),
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    await commit({
      labId,
      writes: [["kits.json", [...kits, kit]]],
      audit: {
        action: "kit.create",
        entity_type: "kit",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        after: { name: kit.name, line_count: kit.lines.length },
        ip: ctx.getClientAddress()
      }
    });
    return ok(kit, 201);
  });
}, { minRole: "manager" });
export {
  GET,
  POST
};
