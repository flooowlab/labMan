import { a6 as head } from './renderer-BXQYGBEo.js';
import { F as FILENAME } from './constants-Bty0yJru.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';

ReturnForm[FILENAME] = "src/components/ReturnForm.svelte";
function ReturnForm($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { labId, labSlug, borrowId } = $$props;
      {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p style="color:var(--c-text-2)">`);
        push_element($$renderer2, "p", 51, 2);
        $$renderer2.push(`Loading borrow…</p>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    ReturnForm
  );
}
ReturnForm.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/[lab]/(protected)/borrows/[id]/return/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("1cvqkum", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Return Items — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 10, 2);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 10, 7);
      $$renderer2.push(`Return Items</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <a href=".." class="btn btn-ghost btn-sm">`);
      push_element($$renderer2, "a", 11, 2);
      $$renderer2.push(`← Borrow Detail</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="card">`);
      push_element($$renderer2, "div", 13, 0);
      $$renderer2.push(`<div class="card-body">`);
      push_element($$renderer2, "div", 14, 2);
      ReturnForm($$renderer2, {
        labId: data.labId,
        labSlug: data.labSlug,
        borrowId: data.borrowId
      });
      $$renderer2.push(`<!----></div>`);
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
//# sourceMappingURL=_page.svelte-SS5-DANn.js.map
