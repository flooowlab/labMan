import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { w as withLocks, a as readDb, c as commit } from './db-CfhGAyvN.js';
import { f as findConflicts } from './reservations-BDHRs154.js';
import { c as createAlert } from './alerts-D7Ogxya5.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import './ids-CipgF91a.js';

const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  const body = await ctx.request.json().catch(() => ({}));
  try {
    return withLocks(
      labId,
      ["borrows.json", "items.json", "reservations.json", "units.json"],
      async () => {
        const reservations = readDb(labId, "reservations.json");
        const r = reservations.find((x) => x.id === id);
        if (!r) return err(404, "Reservation not found");
        if (r.status !== "pending_manager") return err(409, "Reservation is not pending manager approval");
        const conflicts = findConflicts(labId, {
          lines: r.lines,
          start_at: r.start_at,
          end_at: r.end_at,
          exclude_id: id
        });
        if (conflicts.length > 0) {
          return err(409, JSON.stringify({ message: "Conflict detected at approval time", conflicts }));
        }
        const now = (/* @__PURE__ */ new Date()).toISOString();
        r.status = "approved";
        r.manager_decision_by = user.user_id;
        r.manager_decision_at = now;
        r.manager_notes = body.notes ?? "";
        r.updated_at = now;
        await commit({
          labId,
          writes: [["reservations.json", reservations]],
          audit: {
            action: "reservation.manager_approve",
            entity_type: "reservation",
            entity_id: id,
            actor_id: user.user_id,
            actor_role: membership?.role ?? "manager",
            before: { status: "pending_manager" },
            after: { status: "approved" },
            ip: ctx.getClientAddress()
          }
        });
        await createAlert(labId, {
          kind: "pending_approval",
          severity: "info",
          message: `Reservation ${id} approved`,
          reservation_id: id,
          user_id: r.user_id
        }).catch(() => {
        });
        return ok({ ok: true });
      }
    );
  } catch (e) {
    throw e;
  }
}, { minRole: "manager" });

export { POST };
//# sourceMappingURL=_server.ts-DCVxgGRM.js.map
