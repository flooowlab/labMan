import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { w as withLocks, a as readDb, c as commit } from './db-CfhGAyvN.js';
import { p as parseBody, S as SignatureSchema } from './validate-NtJDb-c4.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id: borrowId, role } = ctx.params;
  if (!["borrower", "technician", "return"].includes(role)) {
    return err(400, "role must be borrower, technician, or return");
  }
  const parsed = await parseBody(ctx.request, SignatureSchema);
  if ("error" in parsed) return parsed.error;
  const { sig_data } = parsed.data;
  return withLocks(labId, ["borrows.json"], async () => {
    const borrows = readDb(labId, "borrows.json");
    const borrow = borrows.find((b) => b.id === borrowId);
    if (!borrow) return err(404, "Borrow not found");
    if (borrow.status === "returned" || borrow.status === "cancelled") {
      return err(409, `Borrow is ${borrow.status}`);
    }
    if (role === "borrower" && borrow.user_id !== user.user_id) {
      return err(403, "Only the borrower may provide the borrower signature");
    }
    if (role === "technician") {
      const m = membership;
      if (!m || !["admin", "manager", "technician"].includes(m.role)) {
        return err(403, "Only lab staff may provide the technician signature");
      }
    }
    if (role === "return") {
      const m = membership;
      if (!m || !["admin", "manager", "technician"].includes(m.role)) {
        return err(403, "Only lab staff may provide the return signature");
      }
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (role === "borrower") borrow.borrower_sig_data = sig_data;
    else if (role === "technician") borrow.technician_sig_data = sig_data;
    else borrow.return_sig_data = sig_data;
    borrow.updated_at = now;
    await commit({
      labId,
      writes: [["borrows.json", borrows]],
      audit: {
        action: `borrow.signature.${role}`,
        entity_type: "borrow",
        entity_id: borrowId,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "viewer",
        ip: ctx.getClientAddress()
      }
    });
    return ok({ ok: true });
  });
}, { minRole: "viewer" });

export { POST };
//# sourceMappingURL=_server.ts-CFGRbH2A.js.map
