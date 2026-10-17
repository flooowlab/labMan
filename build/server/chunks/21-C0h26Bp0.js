import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, url }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab.id;
  const role = membership.role;
  const statusFilter = url.searchParams.get("status") ?? "";
  const allRes = readDb(labId, "reservations.json");
  const users = readDb("_global", "users.json");
  const visible = ["student", "viewer"].includes(role) ? allRes.filter((r) => r.user_id === authUser.user_id) : allRes;
  const filtered = statusFilter ? visible.filter((r) => r.status === statusFilter) : visible;
  const sorted = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name ?? u.id.slice(0, 8)]));
  return { reservations: sorted, userMap, statusFilter, labId, labSlug: lab.slug };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 21;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C0CPzU96.js')).default;
const server_id = "src/routes/[lab]/(protected)/reservations/+page.server.ts";
const imports = ["_app/immutable/nodes/21.CgBLiwB7.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/B4JtRxJy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=21-C0h26Bp0.js.map
