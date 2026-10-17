import { redirect } from '@sveltejs/kit';
import { v as verifyToken } from './auth-ByWUbuPz.js';
import 'jose';

const load = async ({ cookies, url }) => {
  const tok = cookies.get("token");
  if (tok) {
    try {
      const p = await verifyToken(tok);
      if (!p.partial) throw redirect(302, "/");
    } catch (e) {
      if (e?.status === 302) throw e;
    }
  }
  return { next: url.searchParams.get("next") ?? "/" };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BrIBFzf7.js')).default;
const server_id = "src/routes/login/+page.server.ts";
const imports = ["_app/immutable/nodes/4.CKF57H3l.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/BQWXWHRU.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/bCdJT07O.js","_app/immutable/chunks/DZ7lF1Hu.js","_app/immutable/chunks/wy-rGcs9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-0nIrgHJm.js.map
