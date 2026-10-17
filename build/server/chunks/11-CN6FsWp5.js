import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, url }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const items = readDb(labId, "items.json").filter((i) => !i.deleted_at);
  const units = readDb(labId, "units.json").filter((u) => !u.deleted_at);
  const q = url.searchParams.get("q")?.toLowerCase() ?? "";
  const catFilter = url.searchParams.get("category") ?? "";
  const modeFilter = url.searchParams.get("mode") ?? "";
  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))].sort();
  const filtered = items.filter((i) => {
    if (catFilter && i.category !== catFilter) return false;
    if (modeFilter && i.tracking_mode !== modeFilter) return false;
    if (q && !i.name.toLowerCase().includes(q) && !(i.sku ?? "").toLowerCase().includes(q)) return false;
    return true;
  });
  const rows = filtered.map((item) => {
    const avail = item.tracking_mode === "bulk" ? item.quantity_available ?? 0 : units.filter((u) => u.item_id === item.id && u.status === "available").length;
    const total = item.tracking_mode === "bulk" ? item.quantity_total ?? 0 : units.filter((u) => u.item_id === item.id).length;
    return { id: item.id, name: item.name, sku: item.sku ?? null, category: item.category ?? null, tracking_mode: item.tracking_mode, avail, total };
  });
  return { rows, categories, q, catFilter, modeFilter, labId, labSlug: lab.slug, role: membership.role };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DIQeBRK2.js')).default;
const server_id = "src/routes/[lab]/(protected)/inventory/+page.server.ts";
const imports = ["_app/immutable/nodes/11.B6zhhynK.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/i5w7oQmI.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-CN6FsWp5.js.map
