import { a6 as head } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

_page[FILENAME] = "src/routes/[lab]/(protected)/reservations/new/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("17xlmml", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>New Reservation — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 17, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 18, 2);
      $$renderer2.push(`<a href="../reservations" class="back-link">`);
      push_element($$renderer2, "a", 19, 4);
      $$renderer2.push(`← Reservations</a>`);
      pop_element();
      $$renderer2.push(` <h1 class="ph-title">`);
      push_element($$renderer2, "h1", 20, 4);
      $$renderer2.push(`New Reservation</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div style="padding:2rem;text-align:center;color:var(--c-text-2)">`);
        push_element($$renderer2, "div", 34, 2);
        $$renderer2.push(`Loading calendar…</div>`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-BRd0nfJ7.js.map
