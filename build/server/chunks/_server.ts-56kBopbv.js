import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb } from './db-CfhGAyvN.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const GET = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  const borrows = readDb(labId, "borrows.json");
  const borrow = borrows.find((b) => b.id === id);
  if (!borrow) return err(404, "Borrow not found");
  if (membership?.role === "student" && borrow.user_id !== user.user_id) {
    return err(403, "Forbidden");
  }
  return ok(borrow);
}, { minRole: "viewer" });

export { GET };
//# sourceMappingURL=_server.ts-56kBopbv.js.map
