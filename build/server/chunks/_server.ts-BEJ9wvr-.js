import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { a as AuthorizationSchema } from './validate-NtJDb-c4.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const GET = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  const auths = readDb(labId, "authorizations.json");
  const auth = auths.find((a) => a.id === id);
  if (!auth) return err(404, "Authorization not found");
  if (membership?.role === "instructor" && auth.instructor_id !== user.user_id) {
    return err(403, "Forbidden");
  }
  return ok(auth);
}, { minRole: "viewer" });
const PATCH = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  return withLocks(labId, ["authorizations.json"], async () => {
    const auths = readDb(labId, "authorizations.json");
    const auth = auths.find((a) => a.id === id);
    if (!auth) return err(404, "Authorization not found");
    if (membership?.role === "instructor" && auth.instructor_id !== user.user_id) {
      return err(403, "Forbidden");
    }
    let body;
    try {
      body = await ctx.request.json();
    } catch {
      return err(400, "Invalid JSON");
    }
    const patch = AuthorizationSchema.pick({ expires_at: true, is_active: true }).partial().safeParse(body);
    if (!patch.success) return err(422, JSON.stringify(patch.error.issues));
    const clean = Object.fromEntries(
      Object.entries(patch.data).filter(([, v]) => v !== void 0)
    );
    Object.assign(auth, clean);
    await commit({
      labId,
      writes: [["authorizations.json", auths]],
      audit: {
        action: patch.data.is_active === false ? "authorization.revoke" : "authorization.update",
        entity_type: "authorization",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        after: clean,
        ip: ctx.getClientAddress()
      }
    });
    return ok(auth);
  });
}, { minRole: "instructor" });

export { GET, PATCH };
//# sourceMappingURL=_server.ts-BEJ9wvr-.js.map
