import { v as verifyToken, g as getMembership } from './auth-ByWUbuPz.js';

const ROLE_HIERARCHY = {
  admin: 6,
  manager: 5,
  technician: 4,
  instructor: 3,
  student: 2,
  viewer: 1
};
function err(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
function ok(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
function withAuth(handler, options = {}) {
  return async (event) => {
    const token = event.cookies.get("token");
    if (!token) return err(401, "Unauthorized");
    let user;
    try {
      user = await verifyToken(token);
    } catch {
      return err(401, "Unauthorized");
    }
    if (user.partial) return err(401, "TOTP verification required");
    const labId = event.params.labId;
    const isSuper = user.memberships.some(
      (m) => m.lab_id === "_global" && m.role === "admin"
    );
    const membership = labId ? getMembership(user, labId) : void 0;
    if (labId) {
      if (!isSuper) {
        if (!membership) return err(403, "Forbidden");
        const role = membership.role;
        if (options.minRole && ROLE_HIERARCHY[role] < ROLE_HIERARCHY[options.minRole]) {
          return err(403, "Forbidden");
        }
        if (options.anyOf && !options.anyOf.includes(role)) {
          return err(403, "Forbidden");
        }
      }
    } else if (options.minRole || options.anyOf) {
      if (!isSuper) return err(403, "Forbidden");
    }
    return handler(event, user, membership);
  };
}

export { err as e, ok as o, withAuth as w };
//# sourceMappingURL=middleware-ngQf4GKt.js.map
