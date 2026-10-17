import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const kit = readDb(labId, "kits.json").find((k) => k.id === params.id && !k.deleted_at);
  if (!kit) throw redirect(302, `/${params.lab}/kits`);
  const items = readDb(labId, "items.json");
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.name]));
  const canEdit = ["admin", "manager"].includes(membership.role);
  return { kit, itemMap, labId, labSlug: params.lab, canEdit };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 18;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-mmpuxLHP.js')).default;
const server_id = "src/routes/[lab]/(protected)/kits/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/18.4mr813LE.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-BNIrnE-k.js.map
