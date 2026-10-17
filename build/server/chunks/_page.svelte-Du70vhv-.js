import { a6 as head, K as attr, ap as stringify, _ as ensure_array_like, a0 as escape_html } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

_page[FILENAME] = "src/routes/[lab]/(protected)/locations/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const canManage = ["admin", "manager"].includes(data.role);
      head("qyfqu5", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Locations — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 27, 0);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 28, 2);
      $$renderer2.push(`Locations</h1>`);
      pop_element();
      $$renderer2.push(` <div class="flex-gap">`);
      push_element($$renderer2, "div", 29, 2);
      $$renderer2.push(`<a${attr("href", `/${stringify(data.labSlug)}/locations/diagram`)} class="btn btn-ghost btn-sm">`);
      push_element($$renderer2, "a", 30, 4);
      $$renderer2.push(`Floor Plan →</a>`);
      pop_element();
      $$renderer2.push(` `);
      if (canManage) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn btn-primary btn-sm">`);
        push_element($$renderer2, "button", 32, 6);
        $$renderer2.push(`+ New Location</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="card">`);
      push_element($$renderer2, "div", 62, 0);
      $$renderer2.push(`<div class="table-wrap">`);
      push_element($$renderer2, "div", 63, 2);
      if (data.locations.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="empty-msg">`);
        push_element($$renderer2, "p", 65, 6);
        $$renderer2.push(`No locations defined.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<table>`);
        push_element($$renderer2, "table", 67, 6);
        $$renderer2.push(`<thead>`);
        push_element($$renderer2, "thead", 68, 8);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 68, 15);
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 68, 19);
        $$renderer2.push(`Name</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 68, 32);
        $$renderer2.push(`Description</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 68, 52);
        $$renderer2.push(`</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 69, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(data.locations);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let loc = each_array[$$index];
          $$renderer2.push(`<tr>`);
          push_element($$renderer2, "tr", 71, 12);
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 72, 14);
          $$renderer2.push(`${escape_html(loc.name)}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm text-muted">`);
          push_element($$renderer2, "td", 73, 14);
          $$renderer2.push(`${escape_html(loc.description ?? "—")}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 74, 14);
          $$renderer2.push(`<a${attr("href", `/${stringify(data.labSlug)}/locations/diagram`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 74, 18);
          $$renderer2.push(`Diagram</a>`);
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
//# sourceMappingURL=_page.svelte-Du70vhv-.js.map
