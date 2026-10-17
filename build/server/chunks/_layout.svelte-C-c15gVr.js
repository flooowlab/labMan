import { K as attr, a0 as escape_html, Z as derived } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

_layout[FILENAME] = "src/routes/[lab]/(protected)/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data, children } = $$props;
      let user = derived(() => data.user);
      let membership = derived(() => data.membership);
      let lab = derived(() => data.lab);
      let base = derived(() => `/${lab()?.slug ?? ""}`);
      let role = derived(() => membership()?.role ?? "viewer");
      let canManageUsers = derived(() => ["admin", "manager"].includes(role()));
      let canApprovePending = derived(() => ["admin", "manager", "instructor"].includes(role()));
      let isAdmin = derived(() => role() === "admin");
      $$renderer2.push(`<div class="shell">`);
      push_element($$renderer2, "div", 18, 0);
      $$renderer2.push(`<header class="shell-header">`);
      push_element($$renderer2, "header", 19, 2);
      $$renderer2.push(`<a${attr("href", `${base()}/`)} class="shell-logo">`);
      push_element($$renderer2, "a", 20, 4);
      $$renderer2.push(`${escape_html(lab()?.name ?? "Lab Manager")}</a>`);
      pop_element();
      $$renderer2.push(` <span class="shell-spacer">`);
      push_element($$renderer2, "span", 21, 4);
      $$renderer2.push(`</span>`);
      pop_element();
      $$renderer2.push(` <span class="shell-user">`);
      push_element($$renderer2, "span", 22, 4);
      $$renderer2.push(`${escape_html(user()?.email)} · ${escape_html(role())}</span>`);
      pop_element();
      $$renderer2.push(` <form method="POST" action="/api/auth/logout" style="display:inline">`);
      push_element($$renderer2, "form", 23, 4);
      $$renderer2.push(`<button class="shell-logout" type="submit">`);
      push_element($$renderer2, "button", 24, 6);
      $$renderer2.push(`Sign out</button>`);
      pop_element();
      $$renderer2.push(`</form>`);
      pop_element();
      $$renderer2.push(`</header>`);
      pop_element();
      $$renderer2.push(` <div class="shell-body">`);
      push_element($$renderer2, "div", 28, 2);
      $$renderer2.push(`<nav class="sidebar">`);
      push_element($$renderer2, "nav", 29, 4);
      $$renderer2.push(`<ul class="nav-list">`);
      push_element($$renderer2, "ul", 30, 6);
      $$renderer2.push(`<li class="nav-item">`);
      push_element($$renderer2, "li", 31, 8);
      $$renderer2.push(`<a${attr("href", `${base()}/`)}>`);
      push_element($$renderer2, "a", 31, 29);
      $$renderer2.push(`Dashboard</a>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      $$renderer2.push(` <li class="nav-item">`);
      push_element($$renderer2, "li", 32, 8);
      $$renderer2.push(`<a${attr("href", `${base()}/inventory`)}>`);
      push_element($$renderer2, "a", 32, 29);
      $$renderer2.push(`Inventory</a>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      $$renderer2.push(` <li class="nav-item">`);
      push_element($$renderer2, "li", 33, 8);
      $$renderer2.push(`<a${attr("href", `${base()}/borrows`)}>`);
      push_element($$renderer2, "a", 33, 29);
      $$renderer2.push(`Borrows</a>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      $$renderer2.push(` <li class="nav-item">`);
      push_element($$renderer2, "li", 34, 8);
      $$renderer2.push(`<a${attr("href", `${base()}/reservations`)}>`);
      push_element($$renderer2, "a", 34, 29);
      $$renderer2.push(`Reservations</a>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      $$renderer2.push(` `);
      if (canApprovePending()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<li class="nav-item">`);
        push_element($$renderer2, "li", 36, 10);
        $$renderer2.push(`<a${attr("href", `${base()}/reservations/pending`)}>`);
        push_element($$renderer2, "a", 36, 31);
        $$renderer2.push(`Pending Approvals</a>`);
        pop_element();
        $$renderer2.push(`</li>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (canManageUsers()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<li class="nav-item">`);
        push_element($$renderer2, "li", 39, 10);
        $$renderer2.push(`<a${attr("href", `${base()}/users`)}>`);
        push_element($$renderer2, "a", 39, 31);
        $$renderer2.push(`Users</a>`);
        pop_element();
        $$renderer2.push(`</li>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <li class="nav-item">`);
      push_element($$renderer2, "li", 41, 8);
      $$renderer2.push(`<a${attr("href", `${base()}/kits`)}>`);
      push_element($$renderer2, "a", 41, 29);
      $$renderer2.push(`Kits</a>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      $$renderer2.push(` <li class="nav-item">`);
      push_element($$renderer2, "li", 42, 8);
      $$renderer2.push(`<a${attr("href", `${base()}/locations`)}>`);
      push_element($$renderer2, "a", 42, 29);
      $$renderer2.push(`Locations</a>`);
      pop_element();
      $$renderer2.push(`</li>`);
      pop_element();
      $$renderer2.push(` `);
      if (isAdmin()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<li class="nav-item">`);
        push_element($$renderer2, "li", 44, 10);
        $$renderer2.push(`<a${attr("href", `${base()}/audit`)}>`);
        push_element($$renderer2, "a", 44, 31);
        $$renderer2.push(`Audit Log</a>`);
        pop_element();
        $$renderer2.push(`</li>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></ul>`);
      pop_element();
      $$renderer2.push(`</nav>`);
      pop_element();
      $$renderer2.push(` <main class="content">`);
      push_element($$renderer2, "main", 49, 4);
      children($$renderer2);
      $$renderer2.push(`<!----></main>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout as default };
//# sourceMappingURL=_layout.svelte-C-c15gVr.js.map
