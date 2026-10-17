import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  if (!["admin", "manager", "technician"].includes(membership.role)) throw redirect(302, `/${params.lab}/inventory/${params.id}`);
  const labId = lab.id;
  const item = readDb(labId, "items.json").find((i) => i.id === params.id && !i.deleted_at);
  if (!item) throw redirect(302, `/${params.lab}/inventory`);
  const locations = readDb(labId, "locations.json");
  return { item, locations, labId, labSlug: params.lab };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DZzWgWwE.js')).default;
const server_id = "src/routes/[lab]/(protected)/inventory/[id]/edit/+page.server.ts";
const imports = ["_app/immutable/nodes/14.nMXUHUbi.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-BLMdY1cv.js.map
