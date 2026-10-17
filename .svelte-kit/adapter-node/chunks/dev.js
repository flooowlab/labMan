function experimental_async_required(name) {
  {
    const error = new Error(`experimental_async_required
Cannot use \`${name}(...)\` unless the \`experimental.async\` compiler option is \`true\`
https://svelte.dev/e/experimental_async_required`);
    error.name = "Svelte error";
    throw error;
  }
}
function invariant_violation(message) {
  {
    const error = new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app — please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${message}"
https://svelte.dev/e/invariant_violation`);
    error.name = "Svelte error";
    throw error;
  }
}
function lifecycle_outside_component(name) {
  {
    const error = new Error(`lifecycle_outside_component
\`${name}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);
    error.name = "Svelte error";
    throw error;
  }
}
function snippet_without_render_tag() {
  {
    const error = new Error(`snippet_without_render_tag
Attempted to render a snippet without a \`{@render}\` block. This would cause the snippet code to be stringified instead of its content being rendered to the DOM. To fix this, change \`{snippet}\` to \`{@render snippet()}\`.
https://svelte.dev/e/snippet_without_render_tag`);
    error.name = "Svelte error";
    throw error;
  }
}
function await_invalid() {
  const error = new Error(`await_invalid
Encountered asynchronous work while rendering synchronously.
https://svelte.dev/e/await_invalid`);
  error.name = "Svelte error";
  throw error;
}
function hydratable_clobbering(key, stack) {
  const error = new Error(`hydratable_clobbering
Attempted to set \`hydratable\` with key \`${key}\` twice with different values.

${stack}
https://svelte.dev/e/hydratable_clobbering`);
  error.name = "Svelte error";
  throw error;
}
function hydratable_serialization_failed(key, stack) {
  const error = new Error(`hydratable_serialization_failed
Failed to serialize \`hydratable\` data for key \`${key}\`.

\`hydratable\` can serialize anything [\`uneval\` from \`devalue\`](https://npmjs.com/package/uneval) can, plus Promises.

Cause:
${stack}
https://svelte.dev/e/hydratable_serialization_failed`);
  error.name = "Svelte error";
  throw error;
}
function invalid_csp() {
  const error = new Error(`invalid_csp
\`csp.nonce\` was set while \`csp.hash\` was \`true\`. These options cannot be used simultaneously.
https://svelte.dev/e/invalid_csp`);
  error.name = "Svelte error";
  throw error;
}
function invalid_id_prefix() {
  const error = new Error(`invalid_id_prefix
The \`idPrefix\` option cannot include \`--\`.
https://svelte.dev/e/invalid_id_prefix`);
  error.name = "Svelte error";
  throw error;
}
function server_context_required() {
  const error = new Error(`server_context_required
Could not resolve \`render\` context.
https://svelte.dev/e/server_context_required`);
  error.name = "Svelte error";
  throw error;
}
var ssr_context = null;
function set_ssr_context(v) {
  ssr_context = v;
}
function getContext(key) {
  const context_map = get_or_init_context_map("getContext");
  const result = (
    /** @type {T} */
    context_map.get(key)
  );
  return result;
}
function setContext(key, context) {
  get_or_init_context_map("setContext").set(key, context);
  return context;
}
function get_or_init_context_map(name) {
  if (ssr_context === null) {
    lifecycle_outside_component(name);
  }
  return ssr_context.c ??= new Map(get_parent_context(ssr_context) || void 0);
}
function push(fn) {
  ssr_context = { p: ssr_context, c: null, r: null };
  {
    ssr_context.function = fn;
    ssr_context.element = ssr_context.p?.element;
  }
}
function pop() {
  ssr_context = /** @type {SSRContext} */
  ssr_context.p;
}
function get_parent_context(ssr_context2) {
  let parent = ssr_context2.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var array_from = Array.from;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
var has_own_property = Object.prototype.hasOwnProperty;
const noop = () => {
};
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function get_render_context() {
  const store = als?.getStore();
  {
    server_context_required();
  }
  return store;
}
let als = null;
function get_error(label) {
  const error = new Error();
  const stack = get_stack();
  if (stack.length === 0) {
    return null;
  }
  stack.unshift("\n");
  define_property(error, "stack", {
    value: stack.join("\n")
  });
  define_property(error, "name", {
    value: label
  });
  return (
    /** @type {Error & { stack: string }} */
    error
  );
}
function get_stack() {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const stack = new Error().stack;
  Error.stackTraceLimit = limit;
  if (!stack) return [];
  const lines = stack.split("\n");
  const new_lines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const posixified = line.replaceAll("\\", "/");
    if (line.trim() === "Error") {
      continue;
    }
    if (line.includes("validate_each_keys")) {
      return [];
    }
    if (posixified.includes("svelte/src/internal") || posixified.includes("node_modules/.vite")) {
      continue;
    }
    new_lines.push(line);
  }
  return new_lines;
}
function invariant(condition, message) {
  if (!condition) invariant_violation(message);
}
export {
  run_all as A,
  setContext as B,
  set_ssr_context as C,
  snippet_without_render_tag as D,
  ssr_context as E,
  array_from as a,
  array_prototype as b,
  await_invalid as c,
  deferred as d,
  define_property as e,
  experimental_async_required as f,
  getContext as g,
  get_descriptor as h,
  get_error as i,
  get_prototype_of as j,
  get_render_context as k,
  get_stack as l,
  has_own_property as m,
  hydratable_clobbering as n,
  hydratable_serialization_failed as o,
  includes as p,
  index_of as q,
  invalid_csp as r,
  invalid_id_prefix as s,
  invariant as t,
  is_array as u,
  is_extensible as v,
  noop as w,
  object_prototype as x,
  pop as y,
  push as z
};
