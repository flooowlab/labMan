import { w as withAuth, e as err, o as ok } from "../../../../../../../chunks/middleware.js";
import { w as withLocks, a as readDb, c as commit } from "../../../../../../../chunks/db.js";
const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  const body = await ctx.request.json().catch(() => ({}));
  return withLocks(labId, ["reservations.json"], async () => {
    const reservations = readDb(labId, "reservations.json");
    const r = reservations.find((x) => x.id === id);
    if (!r) return err(404, "Reservation not found");
    if (r.status !== "pending_manager") return err(409, "Reservation is not pending manager approval");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    r.status = "rejected";
    r.manager_decision_by = user.user_id;
    r.manager_decision_at = now;
    r.manager_notes = body.notes ?? "";
    r.rejection_reason = body.reason ?? "";
    r.updated_at = now;
    await commit({
      labId,
      writes: [["reservations.json", reservations]],
      audit: {
        action: "reservation.manager_reject",
        entity_type: "reservation",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "manager",
        before: { status: "pending_manager" },
        after: { status: "rejected" },
        ip: ctx.getClientAddress()
      }
    });
    return ok({ ok: true });
  });
}, { minRole: "manager" });
export {
  POST
};
