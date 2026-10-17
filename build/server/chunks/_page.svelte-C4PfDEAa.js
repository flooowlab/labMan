import { a6 as head } from './renderer-BXQYGBEo.js';
import { F as FILENAME } from './constants-Bty0yJru.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';

CalendarView[FILENAME] = "src/components/CalendarView.svelte";
function CalendarView($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { labId, labSlug } = $$props;
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 80, 2);
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    CalendarView
  );
}
CalendarView.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/[lab]/(protected)/reservations/calendar/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("1fyg9o7", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Calendar — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 9, 16);
      $$renderer2.push(`Reservations Calendar</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="card" style="padding:0">`);
      push_element($$renderer2, "div", 10, 0);
      CalendarView($$renderer2, { labId: data.labId, labSlug: data.labSlug });
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-C4PfDEAa.js.map
