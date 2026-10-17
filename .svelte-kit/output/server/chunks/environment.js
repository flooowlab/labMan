let base = "";
let assets = base;
const app_dir = "_app";
const relative = true;
const initial = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
function reset() {
  base = initial.base;
  assets = initial.assets;
}
function set_assets(path) {
  assets = initial.assets = path;
}
let public_env = {};
let fix_stack_trace = (error) => error?.stack;
function set_private_env(environment) {
}
function set_public_env(environment) {
  public_env = environment;
}
let prerendering = false;
function set_building() {
}
function set_prerendering() {
  prerendering = true;
}
export {
  app_dir as a,
  assets as b,
  base as c,
  public_env as d,
  reset as e,
  fix_stack_trace as f,
  set_building as g,
  set_prerendering as h,
  set_private_env as i,
  set_public_env as j,
  override as o,
  prerendering as p,
  relative as r,
  set_assets as s
};
