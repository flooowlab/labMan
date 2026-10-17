import { F as head, z as escape_html, t as attr, y as ensure_array_like, K as stringify } from "../../../../../chunks/renderer.js";
import { f as fmtDate } from "../../../../../chunks/utils2.js";
import { a as push_element, p as pop_element } from "../../../../../chunks/dev2.js";
import { F as FILENAME } from "../../../../../chunks/constants.js";
_page[FILENAME] = "src/routes/[lab]/(protected)/audit/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("1rxfcq6", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Audit Log — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 10, 2);
      $$renderer2.push(`Audit Log</h1>`);
      pop_element();
      $$renderer2.push(` <span class="text-sm text-muted">`);
      push_element($$renderer2, "span", 11, 2);
      $$renderer2.push(`${escape_html(data.total)} entries</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <form method="GET" class="flex-gap mb2">`);
      push_element($$renderer2, "form", 14, 0);
      $$renderer2.push(`<input name="action"${attr("value", data.actionFilter)} placeholder="Filter by action…" style="padding:0.5rem 0.75rem;border:1px solid var(--c-border-2);min-width:220px"/>`);
      push_element($$renderer2, "input", 15, 2);
      pop_element();
      $$renderer2.push(` <button type="submit" class="btn btn-secondary btn-sm">`);
      push_element($$renderer2, "button", 16, 2);
      $$renderer2.push(`Filter</button>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.actionFilter) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="?" class="btn btn-ghost btn-sm">`);
        push_element($$renderer2, "a", 17, 25);
        $$renderer2.push(`Clear</a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></form>`);
      pop_element();
      $$renderer2.push(` <div class="card">`);
      push_element($$renderer2, "div", 20, 0);
      $$renderer2.push(`<div class="table-wrap">`);
      push_element($$renderer2, "div", 21, 2);
      $$renderer2.push(`<table>`);
      push_element($$renderer2, "table", 22, 4);
      $$renderer2.push(`<thead>`);
      push_element($$renderer2, "thead", 23, 6);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 23, 13);
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 23, 17);
      $$renderer2.push(`Time</th>`);
      pop_element();
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 23, 30);
      $$renderer2.push(`Action</th>`);
      pop_element();
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 23, 45);
      $$renderer2.push(`Entity</th>`);
      pop_element();
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 23, 60);
      $$renderer2.push(`Actor</th>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</thead>`);
      pop_element();
      $$renderer2.push(`<tbody>`);
      push_element($$renderer2, "tbody", 24, 6);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.entries);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let e = each_array[$$index];
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 26, 10);
        $$renderer2.push(`<td class="text-sm td-mono">`);
        push_element($$renderer2, "td", 27, 12);
        $$renderer2.push(`${escape_html(fmtDate(e.ts ?? e.created_at))}</td>`);
        pop_element();
        $$renderer2.push(`<td class="text-sm td-mono">`);
        push_element($$renderer2, "td", 28, 12);
        $$renderer2.push(`${escape_html(e.action)}</td>`);
        pop_element();
        $$renderer2.push(`<td class="text-sm text-muted">`);
        push_element($$renderer2, "td", 29, 12);
        $$renderer2.push(`${escape_html(e.entity_type)}/${escape_html(e.entity_id?.slice(0, 8))}</td>`);
        pop_element();
        $$renderer2.push(`<td class="text-sm text-muted">`);
        push_element($$renderer2, "td", 30, 12);
        $$renderer2.push(`${escape_html(e.actor_id?.slice(0, 8))}</td>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></tbody>`);
      pop_element();
      $$renderer2.push(`</table>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.total > data.perPage) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex-gap mt2">`);
        push_element($$renderer2, "div", 39, 2);
        if (data.page > 1) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `?page=${stringify(data.page - 1)}${data.actionFilter ? "&action=" + data.actionFilter : ""}`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 41, 6);
          $$renderer2.push(`← Prev</a>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <span class="text-sm">`);
        push_element($$renderer2, "span", 43, 4);
        $$renderer2.push(`Page ${escape_html(data.page)} of ${escape_html(Math.ceil(data.total / data.perPage))}</span>`);
        pop_element();
        $$renderer2.push(` `);
        if (data.page < Math.ceil(data.total / data.perPage)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `?page=${stringify(data.page + 1)}${data.actionFilter ? "&action=" + data.actionFilter : ""}`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 45, 6);
          $$renderer2.push(`Next →</a>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
