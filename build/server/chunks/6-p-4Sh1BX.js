import { redirect } from '@sveltejs/kit';
import { r as readAuditLog } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, url }) => {
  const { lab, membership } = await parent();
  if (membership.role !== "admin") throw redirect(302, `/${(await parent()).lab?.slug}/`);
  const labId = lab.id;
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const actionFilter = url.searchParams.get("action") ?? "";
  const perPage = 50;
  const allEntries = readAuditLog(labId);
  const filtered = actionFilter ? allEntries.filter((e) => e.action?.includes(actionFilter)) : allEntries;
  const total = filtered.length;
  const entries = filtered.slice((page - 1) * perPage, page * perPage).reverse();
  return { entries, total, page, perPage, actionFilter };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CNjlDFWQ.js')).default;
const server_id = "src/routes/[lab]/(protected)/audit/+page.server.ts";
const imports = ["_app/immutable/nodes/6.BAQY-zPy.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/B4JtRxJy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-p-4Sh1BX.js.map
