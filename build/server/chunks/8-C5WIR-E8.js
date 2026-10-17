import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, url }) => {
  const { lab, membership } = await parent();
  if (!["admin", "manager", "technician"].includes(membership.role)) {
    throw redirect(302, "../borrows");
  }
  const labId = lab.id;
  const items = readDb(labId, "items.json").filter((i) => !i.deleted_at);
  const allMemberships = readDb("_global", "lab_memberships.json").filter((m) => m.lab_id === labId && m.is_active);
  const allUsers = readDb("_global", "users.json");
  const usersData = allMemberships.map((m) => {
    const u = allUsers.find((u2) => u2.id === m.user_id && u2.is_active && !u2.redacted_at);
    if (!u) return null;
    return { id: u.id, name: u.name, email: u.email, rfid_tag: u.rfid_tag, user_type: m.user_type };
  }).filter(Boolean);
  const itemsData = items.map((i) => ({ id: i.id, name: i.name, category: i.category, tracking_mode: i.tracking_mode, barcode: i.barcode, quantity_available: i.quantity_available }));
  const instructorMembers = allMemberships.filter((m) => ["instructor", "admin", "manager"].includes(m.role));
  const instructors = instructorMembers.map((m) => {
    const u = allUsers.find((u2) => u2.id === m.user_id && u2.is_active && !u2.redacted_at);
    if (!u) return null;
    return { id: u.id, name: u.name, role: m.role };
  }).filter(Boolean);
  const kitId = url.searchParams.get("kit_id");
  let initialLines = [];
  let kitName = null;
  if (kitId) {
    const kits = readDb(labId, "kits.json");
    const kit = kits.find((k) => k.id === kitId && !k.deleted_at);
    if (kit) {
      kitName = kit.name;
      initialLines = kit.lines.map((l) => {
        const item = items.find((i) => i.id === l.item_id);
        return { item_id: l.item_id, quantity: l.quantity, label: item?.name ?? "(unknown)" };
      });
    }
  }
  return { labId, labSlug: lab.slug, usersData, itemsData, instructors, initialLines, kitId: kitId ?? null, kitName };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-lLLpDehb.js')).default;
const server_id = "src/routes/[lab]/(protected)/borrows/new/+page.server.ts";
const imports = ["_app/immutable/nodes/8.DlimF1ey.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/bCdJT07O.js","_app/immutable/chunks/D-uYPo3Q.js","_app/immutable/chunks/DZ7lF1Hu.js","_app/immutable/chunks/wy-rGcs9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-C5WIR-E8.js.map
