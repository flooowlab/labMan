import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, params }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab.id;
  const res = readDb(labId, "reservations.json").find((r) => r.id === params.id);
  if (!res) throw redirect(302, `/${params.lab}/reservations`);
  const isSelf = res.user_id === authUser.user_id;
  const isPrivileged = ["admin", "manager", "instructor"].includes(membership.role);
  if (!isSelf && !isPrivileged && ["student", "viewer"].includes(membership.role)) {
    throw redirect(302, `/${params.lab}/reservations`);
  }
  const users = readDb("_global", "users.json");
  const items = readDb(labId, "items.json");
  const requester = users.find((u) => u.id === res.user_id);
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.name]));
  const canApproveInstructor = membership.role === "instructor" && res.status === "pending_instructor";
  const canApproveManager = ["admin", "manager"].includes(membership.role) && res.status === "pending_manager";
  const canConvert = ["admin", "manager", "technician"].includes(membership.role) && res.status === "approved";
  return { res, requester: requester ? { name: requester.name, email: requester.email } : null, itemMap, canApproveInstructor, canApproveManager, canConvert, labId };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 25;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CLlUd0Ze.js')).default;
const server_id = "src/routes/[lab]/(protected)/reservations/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/25.BI1Nd12q.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/B4JtRxJy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=25-Dx4kKf37.js.map
