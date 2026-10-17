import { redirect } from '@sveltejs/kit';
import { v as verifyToken } from './auth-ByWUbuPz.js';
import { a as readDb } from './db-CfhGAyvN.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

async function requirePage(token, labSlug) {
  if (!token) return { redirect: "/login" };
  let user;
  try {
    user = await verifyToken(token);
  } catch {
    return { redirect: "/login" };
  }
  if (user.partial) return { redirect: "/login" };
  if (!labSlug) return { user };
  const membership = user.memberships.find((m) => m.lab_slug === labSlug);
  if (!membership) return { redirect: "/" };
  const labs = readDb("_global", "labs.json");
  const lab = labs.find((l) => l.slug === labSlug);
  if (!lab || !lab.is_active) return { redirect: "/" };
  return { user, membership, lab };
}
const load = async ({ params, cookies }) => {
  const auth = await requirePage(cookies.get("token"), params.lab);
  if ("redirect" in auth) throw redirect(302, auth.redirect);
  return auth;
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-C-c15gVr.js')).default;
const server_id = "src/routes/[lab]/(protected)/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.B3YdDXA5.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/Bj8_z-AJ.js","_app/immutable/chunks/Ci6pT3eB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-BsyZ6sly.js.map
