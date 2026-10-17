import { w as withAuth, e as err, o as ok } from "../../../../../../../chunks/middleware.js";
import { w as withLocks, a as readDb, c as commit } from "../../../../../../../chunks/db.js";
const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  return withLocks(labId, ["alerts.json"], async () => {
    const alerts = readDb(labId, "alerts.json");
    const alert = alerts.find((a) => a.id === id);
    if (!alert) return err(404, "Alert not found");
    if (alert.acknowledged) return ok(alert);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    alert.acknowledged = true;
    alert.acknowledged_by = user.user_id;
    alert.acknowledged_at = now;
    await commit({
      labId,
      writes: [["alerts.json", alerts]],
      audit: {
        action: "alert.acknowledge",
        entity_type: "alert",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "manager",
        after: { acknowledged: true },
        ip: ctx.getClientAddress()
      }
    });
    return ok(alert);
  });
}, { minRole: "manager" });
export {
  POST
};
