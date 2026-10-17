import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent }) => {
  const { lab } = await parent();
  const labId = lab.id;
  const borrows = readDb(labId, "borrows.json");
  const reservations = readDb(labId, "reservations.json");
  const alerts = readDb(labId, "alerts.json");
  const members = readDb("_global", "lab_memberships.json").filter((m) => m.lab_id === labId);
  const users = readDb("_global", "users.json");
  const overdue = borrows.filter((b) => b.status === "overdue");
  const activeLoans = borrows.filter((b) => ["active", "overdue", "partially_returned"].includes(b.status));
  const pendingRes = reservations.filter((r) => ["pending_instructor", "pending_manager"].includes(r.status));
  const openAlerts = alerts.filter((a) => !a.resolved_at);
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name ?? u.id.slice(0, 8)]));
  return { overdue, activeLoans: activeLoans.length, pendingRes, openAlerts: openAlerts.length, memberCount: members.length, userMap };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BCtWwDhW.js')).default;
const server_id = "src/routes/[lab]/(protected)/+page.server.ts";
const imports = ["_app/immutable/nodes/5.DcQ5zQT1.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/B4JtRxJy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-5SrZTt1D.js.map
