import { a6 as head, a0 as escape_html, K as attr, ap as stringify, _ as ensure_array_like } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

_page[FILENAME] = "src/routes/[lab]/(protected)/kits/[id]/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const k = data.kit;
      head("tsrgxs", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>${escape_html(k.name)} — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 10, 2);
      $$renderer2.push(`<a href="../kits" class="back-link">`);
      push_element($$renderer2, "a", 11, 4);
      $$renderer2.push(`← Kits</a>`);
      pop_element();
      $$renderer2.push(` <h1 class="ph-title">`);
      push_element($$renderer2, "h1", 12, 4);
      $$renderer2.push(`${escape_html(k.name)}</h1>`);
      pop_element();
      $$renderer2.push(` `);
      if (k.version) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="ph-sub">`);
        push_element($$renderer2, "p", 13, 19);
        $$renderer2.push(`${escape_html(k.version)}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <a${attr("href", `/${stringify(data.labSlug)}/borrows/new?kit_id=${stringify(k.id)}`)} class="btn btn-primary">`);
      push_element($$renderer2, "a", 15, 2);
      $$renderer2.push(`Borrow this Kit</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (k.description) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="card mb2">`);
        push_element($$renderer2, "div", 19, 2);
        $$renderer2.push(`<div class="card-body text-sm">`);
        push_element($$renderer2, "div", 19, 24);
        $$renderer2.push(`${escape_html(k.description)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="card">`);
      push_element($$renderer2, "div", 22, 0);
      $$renderer2.push(`<div class="card-head">`);
      push_element($$renderer2, "div", 23, 2);
      $$renderer2.push(`<span class="card-title">`);
      push_element($$renderer2, "span", 23, 25);
      $$renderer2.push(`Contents</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="table-wrap">`);
      push_element($$renderer2, "div", 24, 2);
      $$renderer2.push(`<table>`);
      push_element($$renderer2, "table", 25, 4);
      $$renderer2.push(`<thead>`);
      push_element($$renderer2, "thead", 26, 6);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 26, 13);
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 26, 17);
      $$renderer2.push(`Item</th>`);
      pop_element();
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 26, 30);
      $$renderer2.push(`Quantity</th>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</thead>`);
      pop_element();
      $$renderer2.push(`<tbody>`);
      push_element($$renderer2, "tbody", 27, 6);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(k.lines);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let l = each_array[$$index];
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 29, 10);
        $$renderer2.push(`<td>`);
        push_element($$renderer2, "td", 30, 12);
        $$renderer2.push(`${escape_html(data.itemMap[l.item_id] ?? l.item_id)}</td>`);
        pop_element();
        $$renderer2.push(`<td>`);
        push_element($$renderer2, "td", 31, 12);
        $$renderer2.push(`${escape_html(l.quantity)}</td>`);
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
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-mmpuxLHP.js.map
