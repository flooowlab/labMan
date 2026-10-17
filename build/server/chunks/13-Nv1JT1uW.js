import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const item = readDb(labId, "items.json").find((i) => i.id === params.id && !i.deleted_at);
  if (!item) throw redirect(302, `/${params.lab}/inventory`);
  const units = readDb(labId, "units.json").filter((u) => u.item_id === item.id && !u.deleted_at);
  const availCount = item.tracking_mode === "bulk" ? item.quantity_available ?? 0 : units.filter((u) => u.status === "available").length;
  const canEdit = ["admin", "manager", "technician"].includes(membership.role);
  return { item, units, availCount, labId, canEdit };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-1oQ__DC7.js')).default;
const server_id = "src/routes/[lab]/(protected)/inventory/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/13.DvnnpJPA.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/B4JtRxJy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-Nv1JT1uW.js.map
