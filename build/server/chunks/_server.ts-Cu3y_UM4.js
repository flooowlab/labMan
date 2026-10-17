import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { w as withLocks, a as readDb, c as commit } from './db-CfhGAyvN.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  const body = await ctx.request.json().catch(() => ({}));
  return withLocks(labId, ["reservations.json"], async () => {
    const reservations = readDb(labId, "reservations.json");
    const r = reservations.find((x) => x.id === id);
    if (!r) return err(404, "Reservation not found");
    if (r.status !== "pending_instructor") return err(409, "Reservation is not pending instructor approval");
    if (r.instructor_id !== user.user_id) return err(403, "Only the assigned instructor may approve");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    r.status = "pending_manager";
    r.instructor_decision_at = now;
    r.instructor_notes = body.notes ?? "";
    r.updated_at = now;
    await commit({
      labId,
      writes: [["reservations.json", reservations]],
      audit: {
        action: "reservation.instructor_approve",
        entity_type: "reservation",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "instructor",
        before: { status: "pending_instructor" },
        after: { status: "pending_manager" },
        ip: ctx.getClientAddress()
      }
    });
    return ok({ ok: true });
  });
}, { minRole: "instructor" });

export { POST };
//# sourceMappingURL=_server.ts-Cu3y_UM4.js.map
