import { a6 as head, K as attr, _ as ensure_array_like, a0 as escape_html, O as attr_class, ap as stringify } from './renderer-BXQYGBEo.js';
import { f as fmtDate } from './utils2-B7owEH8n.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

_page[FILENAME] = "src/routes/[lab]/(protected)/users/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const isAdmin = data.role === "admin";
      head("198t0k1", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Users — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 34, 0);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 35, 2);
      $$renderer2.push(`Users</h1>`);
      pop_element();
      $$renderer2.push(` `);
      if (isAdmin) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn btn-primary btn-sm">`);
        push_element($$renderer2, "button", 37, 4);
        $$renderer2.push(`+ Register User</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form method="GET" class="flex-gap mb2">`);
      push_element($$renderer2, "form", 87, 0);
      $$renderer2.push(`<input name="q"${attr("value", data.q)} placeholder="Search name or email…" style="padding:0.5rem 0.75rem;border:1px solid var(--c-border-2);min-width:240px"/>`);
      push_element($$renderer2, "input", 88, 2);
      pop_element();
      $$renderer2.push(` <button type="submit" class="btn btn-secondary btn-sm">`);
      push_element($$renderer2, "button", 89, 2);
      $$renderer2.push(`Search</button>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.q) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="?" class="btn btn-ghost btn-sm">`);
        push_element($$renderer2, "a", 90, 14);
        $$renderer2.push(`Clear</a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></form>`);
      pop_element();
      $$renderer2.push(` <div class="card">`);
      push_element($$renderer2, "div", 93, 0);
      $$renderer2.push(`<div class="table-wrap">`);
      push_element($$renderer2, "div", 94, 2);
      if (data.rows.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="empty-msg">`);
        push_element($$renderer2, "p", 96, 6);
        $$renderer2.push(`No users found.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<table>`);
        push_element($$renderer2, "table", 98, 6);
        $$renderer2.push(`<thead>`);
        push_element($$renderer2, "thead", 99, 8);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 99, 15);
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 99, 19);
        $$renderer2.push(`Name</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 99, 32);
        $$renderer2.push(`Email</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 99, 46);
        $$renderer2.push(`Role</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 99, 59);
        $$renderer2.push(`Type</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 99, 72);
        $$renderer2.push(`Active Borrows</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 99, 95);
        $$renderer2.push(`No-Shows</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 99, 112);
        $$renderer2.push(`Restricted Until</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 99, 137);
        $$renderer2.push(`</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 100, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(data.rows);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let r = each_array[$$index];
          $$renderer2.push(`<tr>`);
          push_element($$renderer2, "tr", 102, 12);
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 103, 14);
          $$renderer2.push(`${escape_html(r.name)}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm">`);
          push_element($$renderer2, "td", 104, 14);
          $$renderer2.push(`${escape_html(r.email)}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 105, 14);
          $$renderer2.push(`<span class="badge badge-blue">`);
          push_element($$renderer2, "span", 105, 18);
          $$renderer2.push(`${escape_html(r.role)}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm text-muted">`);
          push_element($$renderer2, "td", 106, 14);
          $$renderer2.push(`${escape_html(r.userType ?? "—")}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 107, 14);
          $$renderer2.push(`<span${attr_class(`badge ${r.activeBorrows > 0 ? "badge-yellow" : "badge-gray"}`)}>`);
          push_element($$renderer2, "span", 107, 18);
          $$renderer2.push(`${escape_html(r.activeBorrows)}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm">`);
          push_element($$renderer2, "td", 108, 14);
          $$renderer2.push(`${escape_html(r.noShows)}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm">`);
          push_element($$renderer2, "td", 109, 14);
          $$renderer2.push(`${escape_html(r.restrictedUntil ? fmtDate(r.restrictedUntil) : "—")}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 110, 14);
          $$renderer2.push(`<a${attr("href", `users/${stringify(r.userId)}`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 110, 18);
          $$renderer2.push(`View</a>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`</tr>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></tbody>`);
        pop_element();
        $$renderer2.push(`</table>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CNdcYbi7.js.map
