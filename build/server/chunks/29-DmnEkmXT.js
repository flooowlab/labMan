import { redirect } from '@sveltejs/kit';
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
  if (!lab) throw redirect(302, "/");
  const item = readDb(lab.id, "items.json").find((i) => i.id === params.id && !i.deleted_at);
  if (!item) throw redirect(302, `/${params.lab}/catalog`);
  const token = cookies.get("token") ?? null;
  let userMembership = null;
  if (token) {
    try {
      const payload = await verifyToken(token);
      userMembership = payload.memberships.find((m) => m.lab_slug === params.lab) ?? null;
    } catch {
    }
  }
  return { item, lab, token, userMembership };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 29;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Dy-TE5BG.js')).default;
const server_id = "src/routes/[lab]/catalog/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/29.DD34CxCy.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js"];
const stylesheets = ["_app/immutable/assets/29.C21AlS9A.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=29-DmnEkmXT.js.map
