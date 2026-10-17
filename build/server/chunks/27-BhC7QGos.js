import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, params }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab.id;
  const { id } = params;
  const isSelf = id === authUser.user_id;
  const isManagerPlus = ["admin", "manager"].includes(membership.role);
  if (!isSelf && !isManagerPlus) throw redirect(302, `/${params.lab}/`);
  const users = readDb("_global", "users.json");
  const memberships = readDb("_global", "lab_memberships.json");
  const u = users.find((x) => x.id === id);
  if (!u) throw redirect(302, `/${params.lab}/users`);
  const m = memberships.find((x) => x.user_id === id && x.lab_id === labId);
  if (!m) throw redirect(302, `/${params.lab}/users`);
  const borrows = readDb(labId, "borrows.json").filter((b) => b.user_id === id).sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50);
  const items = readDb(labId, "items.json");
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.name]));
  return {
    labId,
    targetUser: { id: u.id, name: u.redacted_at ? "[REDACTED]" : u.name ?? "", email: u.redacted_at ? "[REDACTED]" : u.email, rfid_tag: u.rfid_tag, is_active: u.is_active, totp_enabled: u.totp_enabled, redacted_at: u.redacted_at ?? null },
    membership: { role: m.role, user_type: m.user_type, no_show_count: m.no_show_count ?? 0, borrow_restricted_until: m.borrow_restricted_until ?? null },
    borrows,
    itemMap,
    isManagerPlus,
    isAdmin: membership.role === "admin",
    isSelf
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 27;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CDUYF9l8.js')).default;
const server_id = "src/routes/[lab]/(protected)/users/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/27.eUt2SGU7.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/B4JtRxJy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=27-BhC7QGos.js.map
