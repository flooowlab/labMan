const load = async ({ parent }) => {
  const { lab } = await parent();
  return { labId: lab.id };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 20;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DWPwE791.js')).default;
const server_id = "src/routes/[lab]/(protected)/locations/diagram/+page.server.ts";
const imports = ["_app/immutable/nodes/20.CFcb8y44.js","_app/immutable/chunks/BkvbpPaU.js","_app/immutable/chunks/BiTaY2zf.js","_app/immutable/chunks/BcjqAjE2.js","_app/immutable/chunks/B4I2KyUH.js","_app/immutable/chunks/CNzBoeg_.js","_app/immutable/chunks/CalA7r5p.js","_app/immutable/chunks/BcVH-kG-.js","_app/immutable/chunks/DrQgIPaB.js","_app/immutable/chunks/Ci6pT3eB.js","_app/immutable/chunks/BM__fTDz.js","_app/immutable/chunks/i5w7oQmI.js","_app/immutable/chunks/bCdJT07O.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=20-Dpxk50lZ.js.map
