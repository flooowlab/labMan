const load = async ({ parent, params }) => {
  const { lab } = await parent();
  return { labId: lab.id, labSlug: params.lab };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 22;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C4PfDEAa.js')).default;
const server_id = "src/routes/[lab]/(protected)/reservations/calendar/+page.server.ts";
const imports = ["_app/immutable/nodes/22.D-PHeC_2.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/CTKbGokI.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=22-C0youoXZ.js.map
