import { F as head, z as escape_html, y as ensure_array_like, t as attr, K as stringify } from "../../../../../chunks/renderer.js";
import { a as push_element, p as pop_element } from "../../../../../chunks/dev2.js";
import { F as FILENAME } from "../../../../../chunks/constants.js";
_page[FILENAME] = "src/routes/[lab]/(protected)/kits/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("y869s8", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Kits — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 8, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 9, 2);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 10, 4);
      $$renderer2.push(`Kits</h1>`);
      pop_element();
      $$renderer2.push(` <p class="ph-sub">`);
      push_element($$renderer2, "p", 11, 4);
      $$renderer2.push(`Named bundles of items for common borrow workflows.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.isManager) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="kits/new" class="btn btn-primary btn-sm">`);
        push_element($$renderer2, "a", 14, 4);
        $$renderer2.push(`+ New Kit</a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.rows.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="card" style="padding:2rem;text-align:center">`);
        push_element($$renderer2, "div", 19, 2);
        $$renderer2.push(`<p>`);
        push_element($$renderer2, "p", 20, 4);
        $$renderer2.push(`No kits defined yet.${escape_html(data.isManager ? " Create one to bundle frequently borrowed items." : "")}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="card">`);
        push_element($$renderer2, "div", 23, 2);
        $$renderer2.push(`<div class="table-wrap">`);
        push_element($$renderer2, "div", 24, 4);
        $$renderer2.push(`<table>`);
        push_element($$renderer2, "table", 25, 6);
        $$renderer2.push(`<thead>`);
        push_element($$renderer2, "thead", 26, 8);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 26, 15);
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 26, 19);
        $$renderer2.push(`Name</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 26, 32);
        $$renderer2.push(`Ver.</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 26, 45);
        $$renderer2.push(`Items</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 26, 59);
        $$renderer2.push(`Description</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 26, 79);
        $$renderer2.push(`</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 27, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(data.rows);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let k = each_array[$$index];
          $$renderer2.push(`<tr>`);
          push_element($$renderer2, "tr", 29, 12);
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 30, 14);
          $$renderer2.push(`<a${attr("href", `kits/${stringify(k.id)}`)}>`);
          push_element($$renderer2, "a", 30, 18);
          $$renderer2.push(`${escape_html(k.name)}</a>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="td-mono">`);
          push_element($$renderer2, "td", 31, 14);
          $$renderer2.push(`v${escape_html(k.version)}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 32, 14);
          $$renderer2.push(`${escape_html(k.lineCount)} item${escape_html(k.lineCount !== 1 ? "s" : "")}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm text-muted">`);
          push_element($$renderer2, "td", 33, 14);
          $$renderer2.push(`${escape_html(k.linePreview)}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 34, 14);
          $$renderer2.push(`<a${attr("href", `kits/${stringify(k.id)}`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 34, 18);
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
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
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
