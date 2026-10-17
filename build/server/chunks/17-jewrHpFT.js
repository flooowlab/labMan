import { redirect } from '@sveltejs/kit';

const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  if (!["admin", "manager"].includes(membership.role)) throw redirect(302, `/${params.lab}/kits`);
  return { labId: lab.id, labSlug: params.lab };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 17;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CzKK1YVe.js')).default;
const server_id = "src/routes/[lab]/(protected)/kits/new/+page.server.ts";
const imports = ["_app/immutable/nodes/17.CV8-NHYP.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/bCdJT07O.js","_app/immutable/chunks/wy-rGcs9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-jewrHpFT.js.map
