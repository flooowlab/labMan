import { w as withAuth, e as err, o as ok } from "../../../../../../chunks/middleware.js";
import { w as withLocks, a as readDb, c as commit } from "../../../../../../chunks/db.js";
import { d as LocationSchema } from "../../../../../../chunks/validate.js";
const PATCH = withAuth(async (ctx, actor, membership) => {
  const { labId, id } = ctx.params;
  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return err(400, "Invalid JSON");
  }
  const parsed = LocationSchema.partial().safeParse(body);
  if (!parsed.success) return err(400, parsed.error.issues[0]?.message ?? "Validation error");
  return withLocks(labId, ["locations.json"], async () => {
    const locations = readDb(labId, "locations.json");
    const loc = locations.find((l) => l.id === id);
    if (!loc) return err(404, "Location not found");
    Object.assign(loc, Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== void 0)
    ));
    await commit({
      labId,
      writes: [["locations.json", locations]],
      audit: {
        action: "location.update",
        entity_type: "location",
        entity_id: id,
        actor_id: actor.user_id,
        actor_role: membership?.role ?? "admin",
        ip: ctx.getClientAddress()
      }
    });
    return ok(loc);
  });
}, { minRole: "manager" });
const DELETE = withAuth(async (ctx, actor, membership) => {
  const { labId, id } = ctx.params;
  return withLocks(labId, ["items.json", "locations.json", "units.json"], async () => {
    const locations = readDb(labId, "locations.json");
    const loc = locations.find((l) => l.id === id);
    if (!loc) return err(404, "Location not found");
    const items = readDb(labId, "items.json");
    const units = readDb(labId, "units.json");
    const inUse = items.some((i) => !i.deleted_at && i.default_location_id === id) || units.some((u) => !u.deleted_at && u.location_id === id);
    if (inUse) return err(409, "Location is still referenced by items or units. Reassign them first.");
    loc.deleted_at = (/* @__PURE__ */ new Date()).toISOString();
    await commit({
      labId,
      writes: [["locations.json", locations]],
      audit: {
        action: "location.delete",
        entity_type: "location",
        entity_id: id,
        actor_id: actor.user_id,
        actor_role: membership?.role ?? "admin",
        ip: ctx.getClientAddress()
      }
    });
    return ok({ ok: true });
  });
}, { minRole: "manager" });
export {
  DELETE,
  PATCH
};
