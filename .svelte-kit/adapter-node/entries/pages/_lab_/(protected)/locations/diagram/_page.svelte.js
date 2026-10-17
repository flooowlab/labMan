import { F as head } from "../../../../../../chunks/renderer.js";
import { F as FILENAME } from "../../../../../../chunks/constants.js";
import "clsx";
import { a as push_element, p as pop_element } from "../../../../../../chunks/dev2.js";
LocationDiagram[FILENAME] = "src/components/LocationDiagram.svelte";
function LocationDiagram($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { labId } = $$props;
      {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<p style="color:var(--c-text-2);padding:2rem;text-align:center">`);
        push_element($$renderer2, "p", 31, 2);
        $$renderer2.push(`Loading diagram…</p>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    LocationDiagram
  );
}
LocationDiagram.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/[lab]/(protected)/locations/diagram/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("jxygjj", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Floor Plan — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 10, 2);
      $$renderer2.push(`Floor Plan</h1>`);
      pop_element();
      $$renderer2.push(` <a href="../locations" class="btn btn-ghost btn-sm">`);
      push_element($$renderer2, "a", 11, 2);
      $$renderer2.push(`← Locations</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      LocationDiagram($$renderer2, { labId: data.labId });
      $$renderer2.push(`<!---->`);
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
