import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  if (!["admin", "manager"].includes(membership.role)) throw redirect(302, `/${params.lab}/inventory`);
  const locations = readDb(lab.id, "locations.json");
  return { labId: lab.id, labSlug: params.lab, locations };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Cqg0n0z5.js')).default;
const server_id = "src/routes/[lab]/(protected)/inventory/new/+page.server.ts";
const imports = ["_app/immutable/nodes/12.DGwRc4u-.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-Cx9D6pwt.js.map
