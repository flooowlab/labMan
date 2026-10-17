import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { w as withLocks, a as readDb, c as commit } from './db-CfhGAyvN.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id: borrowId } = ctx.params;
  let rejection_reason = "";
  try {
    const body = await ctx.request.json();
    rejection_reason = body?.reason ?? "";
  } catch {
  }
  return withLocks(
    labId,
    ["alerts.json", "borrow_extensions.json"],
    async () => {
      const extensions = readDb(labId, "borrow_extensions.json");
      const alerts = readDb(labId, "alerts.json");
      const ext = extensions.find((e) => e.borrow_id === borrowId && e.status === "pending");
      if (!ext) return err(404, "Pending extension not found");
      const now = (/* @__PURE__ */ new Date()).toISOString();
      ext.status = "rejected";
      ext.reviewed_by = user.user_id;
      ext.reviewed_at = now;
      ext.rejection_reason = rejection_reason;
      alerts.filter(
        (a) => a.borrow_id === borrowId && a.kind === "extension_requested" && !a.resolved_at
      ).forEach((a) => {
        a.resolved_at = now;
      });
      await commit({
        labId,
        writes: [
          ["borrow_extensions.json", extensions],
          ["alerts.json", alerts]
        ],
        audit: {
          action: "extension.reject",
          entity_type: "borrow",
          entity_id: borrowId,
          actor_id: user.user_id,
          actor_role: membership?.role ?? "manager",
          after: { rejection_reason },
          ip: ctx.getClientAddress()
        }
      });
      return ok(ext);
    }
  );
}, { minRole: "manager" });

export { POST };
//# sourceMappingURL=_server.ts-BcdQk_FD.js.map
