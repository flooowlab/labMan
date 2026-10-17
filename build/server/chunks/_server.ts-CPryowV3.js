import { w as withAuth, o as ok, e as err } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { d as LocationSchema } from './validate-NtJDb-c4.js';
import { n as newId } from './ids-CipgF91a.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId;
  const locations = readDb(labId, "locations.json");
  return ok(locations);
}, { minRole: "viewer" });
const POST = withAuth(async (ctx, actor, membership) => {
  const labId = ctx.params.labId;
  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return err(400, "Invalid JSON");
  }
  const parsed = LocationSchema.safeParse(body);
  if (!parsed.success) return err(400, parsed.error.issues[0]?.message ?? "Validation error");
  return withLocks(labId, ["locations.json"], async () => {
    const locations = readDb(labId, "locations.json");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const loc = {
      id: newId(),
      lab_id: labId,
      name: parsed.data.name,
      room: parsed.data.room ?? "",
      shelf: parsed.data.shelf ?? null,
      notes: parsed.data.notes ?? "",
      created_at: now
    };
    locations.push(loc);
    await commit({
      labId,
      writes: [["locations.json", locations]],
      audit: {
        action: "location.create",
        entity_type: "location",
        entity_id: loc.id,
        actor_id: actor.user_id,
        actor_role: membership?.role ?? "admin",
        ip: ctx.getClientAddress()
      }
    });
    return ok(loc, 201);
  });
}, { minRole: "manager" });

export { GET, POST };
//# sourceMappingURL=_server.ts-CPryowV3.js.map
