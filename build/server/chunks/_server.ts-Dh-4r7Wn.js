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
  try {
    const borrow = await withLocks(
      labId,
      ["alerts.json", "borrow_extensions.json", "borrows.json"],
      async () => {
        const borrows = readDb(labId, "borrows.json");
        const extensions = readDb(labId, "borrow_extensions.json");
        const alerts = readDb(labId, "alerts.json");
        const borrow2 = borrows.find((b) => b.id === borrowId);
        const ext = extensions.find((e) => e.borrow_id === borrowId && e.status === "pending");
        if (!ext || !borrow2) return err(404, "Pending extension not found");
        const now = (/* @__PURE__ */ new Date()).toISOString();
        ext.status = "approved";
        ext.reviewed_by = user.user_id;
        ext.reviewed_at = now;
        borrow2.due_date = ext.requested_due_date;
        borrow2.updated_at = now;
        alerts.filter(
          (a) => a.borrow_id === borrowId && a.kind === "extension_requested" && !a.resolved_at
        ).forEach((a) => {
          a.resolved_at = now;
        });
        await commit({
          labId,
          writes: [
            ["borrows.json", borrows],
            ["borrow_extensions.json", extensions],
            ["alerts.json", alerts]
          ],
          audit: {
            action: "extension.approve",
            entity_type: "borrow",
            entity_id: borrowId,
            actor_id: user.user_id,
            actor_role: membership?.role ?? "manager",
            after: { new_due_date: borrow2.due_date },
            ip: ctx.getClientAddress()
          }
        });
        return borrow2;
      }
    );
    if (borrow instanceof Response) return borrow;
    return ok(borrow);
  } catch (e) {
    throw e;
  }
}, { minRole: "manager" });

export { POST };
//# sourceMappingURL=_server.ts-Dh-4r7Wn.js.map
