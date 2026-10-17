import { a6 as head, O as attr_class, _ as ensure_array_like, K as attr, ap as stringify, a0 as escape_html, V as clsx } from './renderer-BXQYGBEo.js';
import { f as fmtDate, s as statusClass } from './utils2-B7owEH8n.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

_page[FILENAME] = "src/routes/[lab]/(protected)/borrows/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const STATUSES = [
        "active",
        "overdue",
        "partially_returned",
        "returned",
        "cancelled"
      ];
      head("1luwfq7", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Borrows — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 10, 0);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 11, 2);
      $$renderer2.push(`Borrows</h1>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.canCreate) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="borrows/new" class="btn btn-primary">`);
        push_element($$renderer2, "a", 12, 22);
        $$renderer2.push(`New Borrow</a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="flex-gap mb2">`);
      push_element($$renderer2, "div", 15, 0);
      $$renderer2.push(`<a href="?"${attr_class(`btn btn-sm ${!data.statusFilter ? "btn-primary" : "btn-ghost"}`)}>`);
      push_element($$renderer2, "a", 16, 2);
      $$renderer2.push(`All</a>`);
      pop_element();
      $$renderer2.push(` <!--[-->`);
      const each_array = ensure_array_like(STATUSES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let s = each_array[$$index];
        $$renderer2.push(`<a${attr("href", `?status=${stringify(s)}`)}${attr_class(`btn btn-sm ${data.statusFilter === s ? "btn-primary" : "btn-ghost"}`)}>`);
        push_element($$renderer2, "a", 18, 4);
        $$renderer2.push(`${escape_html(s)}</a>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="card">`);
      push_element($$renderer2, "div", 22, 0);
      $$renderer2.push(`<div class="table-wrap">`);
      push_element($$renderer2, "div", 23, 2);
      if (data.borrows.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="empty-msg">`);
        push_element($$renderer2, "p", 25, 6);
        $$renderer2.push(`No borrows found.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<table>`);
        push_element($$renderer2, "table", 27, 6);
        $$renderer2.push(`<thead>`);
        push_element($$renderer2, "thead", 28, 8);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 28, 15);
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 19);
        $$renderer2.push(`Borrower</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 36);
        $$renderer2.push(`Items</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 50);
        $$renderer2.push(`Borrowed</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 67);
        $$renderer2.push(`Due</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 79);
        $$renderer2.push(`Status</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 94);
        $$renderer2.push(`</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 29, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(data.borrows);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let b = each_array_1[$$index_1];
          $$renderer2.push(`<tr>`);
          push_element($$renderer2, "tr", 31, 12);
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 32, 14);
          $$renderer2.push(`${escape_html(data.userMap[b.user_id] ?? b.user_id.slice(0, 8))}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm">`);
          push_element($$renderer2, "td", 33, 14);
          $$renderer2.push(`${escape_html(b.lines.length)} line${escape_html(b.lines.length !== 1 ? "s" : "")}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm">`);
          push_element($$renderer2, "td", 34, 14);
          $$renderer2.push(`${escape_html(fmtDate(b.borrowed_at))}</td>`);
          pop_element();
          $$renderer2.push(`<td${attr_class(`text-sm ${b.status === "overdue" ? "badge-red" : ""}`)}>`);
          push_element($$renderer2, "td", 35, 14);
          $$renderer2.push(`${escape_html(fmtDate(b.due_date))}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 36, 14);
          $$renderer2.push(`<span${attr_class(clsx(statusClass(b.status)))}>`);
          push_element($$renderer2, "span", 36, 18);
          $$renderer2.push(`${escape_html(b.status)}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 37, 14);
          $$renderer2.push(`<a${attr("href", `borrows/${stringify(b.id)}`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 37, 18);
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
//# sourceMappingURL=_page.svelte-FYgTpbg8.js.map
