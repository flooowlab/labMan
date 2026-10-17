import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const canApprove = ["admin", "manager", "instructor"].includes(membership.role);
  const pending = readDb(labId, "reservations.json").filter((r) => ["pending_instructor", "pending_manager"].includes(r.status));
  const users = readDb("_global", "users.json");
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name ?? u.id.slice(0, 8)]));
  return { pending, userMap, canApprove, labId };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 24;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-bOAHH7oB.js')).default;
const server_id = "src/routes/[lab]/(protected)/reservations/pending/+page.server.ts";
const imports = ["_app/immutable/nodes/24.BXLf_YTJ.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/B4JtRxJy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=24-MUQWoz1T.js.map
