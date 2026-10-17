import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const GET = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  const reservations = readDb(labId, "reservations.json");
  const r = reservations.find((x) => x.id === id);
  if (!r) return err(404, "Reservation not found");
  if (membership?.role === "student" && r.user_id !== user.user_id) {
    return err(403, "Forbidden");
  }
  if (membership?.role === "instructor" && r.user_id !== user.user_id && r.instructor_id !== user.user_id) {
    return err(403, "Forbidden");
  }
  return ok(r);
}, { minRole: "viewer" });
const DELETE = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  return withLocks(labId, ["reservations.json"], async () => {
    const reservations = readDb(labId, "reservations.json");
    const r = reservations.find((x) => x.id === id);
    if (!r) return err(404, "Reservation not found");
    const isOwner = r.user_id === user.user_id;
    const isManagerPlus = membership && ["admin", "manager"].includes(membership.role);
    if (!isOwner && !isManagerPlus) return err(403, "Forbidden");
    const cancellableStatuses = [
      "draft",
      "pending_instructor",
      "pending_manager",
      "approved"
    ];
    if (!cancellableStatuses.includes(r.status)) {
      return err(409, `Cannot cancel a reservation with status "${r.status}"`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    r.status = "cancelled";
    r.cancelled_at = now;
    r.cancelled_by = user.user_id;
    r.updated_at = now;
    await commit({
      labId,
      writes: [["reservations.json", reservations]],
      audit: {
        action: "reservation.cancel",
        entity_type: "reservation",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "student",
        ip: ctx.getClientAddress()
      }
    });
    return ok({ ok: true });
  });
}, { minRole: "viewer" });

export { DELETE, GET };
//# sourceMappingURL=_server.ts-DZ8mAH_4.js.map
