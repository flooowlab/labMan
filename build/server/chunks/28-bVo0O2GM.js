import { a as readDb } from './db-CfhGAyvN.js';
import { v as verifyToken } from './auth-ByWUbuPz.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'jose';

const load = async ({ params, cookies }) => {
  const labs = readDb("_global", "labs.json");
  const lab = labs.find((l) => l.slug === params.lab);
  if (!lab) return { items: [], lab: null, token: null, userRole: null, coordinator: null };
  const items = readDb(lab.id, "items.json").filter((i) => !i.deleted_at);
  const token = cookies.get("token") ?? null;
  let userRole = null;
  if (token) {
    try {
      const payload = await verifyToken(token);
      userRole = payload.memberships.find((m) => m.lab_slug === params.lab)?.role ?? null;
    } catch {
    }
  }
  const memberships = readDb("_global", "lab_memberships.json").filter((m) => m.lab_id === lab.id && m.is_active && ["admin", "manager"].includes(m.role));
  const users = readDb("_global", "users.json");
  const coordMember = memberships.sort((a, b) => a.role === "admin" ? -1 : 1)[0];
  const coordUser = coordMember ? users.find((u) => u.id === coordMember.user_id && !u.redacted_at) : null;
  const coordinator = coordUser ? { name: coordUser.name, email: coordUser.email } : null;
  return { items, lab, token, userRole, coordinator };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 28;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-xcrpFXYq.js')).default;
const server_id = "src/routes/[lab]/catalog/+page.server.ts";
const imports = ["_app/immutable/nodes/28.CDddmGXF.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/BM__fTDz.js","_app/immutable/chunks/bCdJT07O.js","_app/immutable/chunks/BQWXWHRU.js","_app/immutable/chunks/DZ7lF1Hu.js","_app/immutable/chunks/wy-rGcs9.js"];
const stylesheets = ["_app/immutable/assets/28.Ci1Romq3.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=28-bVo0O2GM.js.map
