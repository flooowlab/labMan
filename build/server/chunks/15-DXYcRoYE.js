import { redirect } from '@sveltejs/kit';

const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  if (!["admin", "manager", "technician"].includes(membership.role)) throw redirect(302, `/${params.lab}/inventory/${params.id}`);
  return { labId: lab.id, labSlug: params.lab, itemId: params.id };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Ct3gWHw0.js')).default;
const server_id = "src/routes/[lab]/(protected)/inventory/[id]/units/new/+page.server.ts";
const imports = ["_app/immutable/nodes/15.DhcAEack.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-DXYcRoYE.js.map
