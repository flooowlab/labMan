import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const kits = readDb(labId, "kits.json").filter((k) => !k.deleted_at);
  const items = readDb(labId, "items.json").filter((i) => !i.deleted_at);
  const rows = kits.map((k) => ({
    id: k.id,
    name: k.name,
    version: k.version,
    lineCount: k.lines.length,
    linePreview: k.lines.slice(0, 3).map((l) => items.find((i) => i.id === l.item_id)?.name ?? "(deleted)").join(", ") + (k.lines.length > 3 ? ` +${k.lines.length - 3} more` : "")
  }));
  return { rows, isManager: ["admin", "manager"].includes(membership.role) };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DVMI_Q_1.js')).default;
const server_id = "src/routes/[lab]/(protected)/kits/+page.server.ts";
const imports = ["_app/immutable/nodes/16.AqTEUrmp.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-u4bou2OD.js.map
