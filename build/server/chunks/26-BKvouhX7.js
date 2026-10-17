import { redirect } from '@sveltejs/kit';
import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, url }) => {
  const { lab, membership } = await parent();
  if (!["admin", "manager"].includes(membership.role)) throw redirect(302, `/${(await parent()).lab?.slug}/`);
  const labId = lab.id;
  const members = readDb("_global", "lab_memberships.json").filter((m) => m.lab_id === labId && m.is_active);
  const users = readDb("_global", "users.json");
  const borrows = readDb(labId, "borrows.json");
  const q = url.searchParams.get("q")?.toLowerCase() ?? "";
  const rows = members.map((m) => {
    const u = users.find((x) => x.id === m.user_id);
    if (!u) return null;
    const activeBorrows = borrows.filter((b) => b.user_id === m.user_id && ["active", "overdue", "partially_returned"].includes(b.status)).length;
    return { userId: u.id, name: u.redacted_at ? "[REDACTED]" : u.name ?? "", email: u.redacted_at ? "[REDACTED]" : u.email, role: m.role, userType: m.user_type ?? null, activeBorrows, noShows: m.no_show_count ?? 0, restrictedUntil: m.borrow_restricted_until ?? null };
  }).filter(Boolean);
  const filtered = q ? rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)) : rows;
  return { rows: filtered, q, labId, labSlug: lab.slug, role: membership.role };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 26;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CNdcYbi7.js')).default;
const server_id = "src/routes/[lab]/(protected)/users/+page.server.ts";
const imports = ["_app/immutable/nodes/26.C_9c3ktS.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/DL77dcqL.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/B4JtRxJy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=26-BKvouhX7.js.map
