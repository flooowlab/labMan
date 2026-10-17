import { w as withAuth, o as ok, e as err } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { p as parseBody, L as LabSchema } from './validate-NtJDb-c4.js';
import { n as newId } from './ids-CipgF91a.js';
import { r as runMigrations } from './runner-DQcmKiSu.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const GET = withAuth(async (_ctx, user) => {
  const labs = readDb("_global", "labs.json");
  const isSuper = user.memberships.some((m) => m.lab_id === "_global" && m.role === "admin");
  if (isSuper) return ok(labs);
  const memberLabIds = new Set(user.memberships.map((m) => m.lab_id));
  return ok(labs.filter((l) => memberLabIds.has(l.id) && l.is_active));
});
const POST = withAuth(async (ctx, user) => {
  const isSuper = user.memberships.some((m) => m.lab_id === "_global" && m.role === "admin");
  if (!isSuper) return err(403, "Only super-admins can create labs");
  const parsed = await parseBody(ctx.request, LabSchema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;
  return withLocks("_global", ["labs.json"], async () => {
    const labs = readDb("_global", "labs.json");
    if (labs.find((l) => l.slug === data.slug)) return err(409, "Slug already in use");
    const id = newId();
    const lab = {
      id,
      slug: data.slug,
      name: data.name,
      room: data.room ?? "",
      contact_email: data.contact_email ?? "",
      is_active: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    await commit({
      labId: "_global",
      writes: [["labs.json", [...labs, lab]]],
      audit: {
        action: "lab.create",
        entity_type: "lab",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: "admin",
        after: { slug: lab.slug, name: lab.name },
        ip: ctx.getClientAddress()
      }
    });
    await runMigrations(id);
    return ok(lab, 201);
  });
});

export { GET, POST };
//# sourceMappingURL=_server.ts-vHK9CsCi.js.map
