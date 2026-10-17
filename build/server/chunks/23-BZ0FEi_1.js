import { a as readDb } from './db-CfhGAyvN.js';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const load = async ({ parent, params }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab.id;
  const allItems = readDb(labId, "items.json").filter((i) => !i.deleted_at);
  const allMemberships = readDb("_global", "lab_memberships.json");
  const allUsers = readDb("_global", "users.json");
  const instructors = allMemberships.filter((m) => m.lab_id === labId && m.role === "instructor" && m.is_active).map((m) => allUsers.find((u) => u.id === m.user_id && !u.redacted_at)).filter(Boolean).map((u) => ({ id: u.id, name: u.name ?? "" }));
  return {
    labId,
    labSlug: params.lab,
    userId: authUser.user_id,
    isStudent: membership.role === "student",
    items: allItems.map((i) => ({ id: i.id, name: i.name, category: i.category ?? null })),
    instructors
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 23;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BRd0nfJ7.js')).default;
const server_id = "src/routes/[lab]/(protected)/reservations/new/+page.server.ts";
const imports = ["_app/immutable/nodes/23.BJR3Wf43.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/Bdkh7MDL.js","_app/immutable/chunks/B4I2KyUH.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=23-BZ0FEi_1.js.map
