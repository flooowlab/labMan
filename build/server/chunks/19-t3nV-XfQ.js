import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const locations = readDb(labId, "locations.json").filter((l) => !l.deleted_at);
  return { locations, labId, labSlug: lab.slug, role: membership.role };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 19;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Du70vhv-.js')).default;
const server_id = "src/routes/[lab]/(protected)/locations/+page.server.ts";
const imports = ["_app/immutable/nodes/19.CkyNKMrj.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=19-t3nV-XfQ.js.map
