import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import { v as verifyToken } from './auth-ByWUbuPz.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'jose';

const load = async ({ cookies }) => {
  const allLabs = readDb("_global", "labs.json").filter((l) => l.is_active);
  let loggedInUser = null;
  const tok = cookies.get("token");
  if (tok) {
    try {
      const p = await verifyToken(tok);
      if (!p.partial) loggedInUser = p;
    } catch {
    }
  }
  if (loggedInUser) {
    const myLabs = allLabs.filter(
      (l) => loggedInUser.memberships.some((m) => m.lab_id === l.id)
    );
    if (myLabs.length === 1) throw redirect(302, `/${myLabs[0].slug}/`);
  } else {
    if (allLabs.length === 1) throw redirect(302, `/${allLabs[0].slug}/catalog`);
  }
  return { labs: allLabs, loggedInUser };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DdvULtbk.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/3.DpNChcV8.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-CXkfyYF9.js.map
