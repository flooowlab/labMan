import { a6 as head, K as attr, ap as stringify, a0 as escape_html } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

_page[FILENAME] = "src/routes/[lab]/(protected)/inventory/[id]/units/new/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      let loading = false;
      head("1uasle2", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Add Unit — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 28, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 29, 2);
      $$renderer2.push(`<a${attr("href", `../../../${stringify(data.itemId)}`)} class="back-link">`);
      push_element($$renderer2, "a", 30, 4);
      $$renderer2.push(`← Item Detail</a>`);
      pop_element();
      $$renderer2.push(` <h1 class="ph-title">`);
      push_element($$renderer2, "h1", 31, 4);
      $$renderer2.push(`Add Unit</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="card" style="max-width:480px">`);
      push_element($$renderer2, "div", 35, 0);
      $$renderer2.push(`<form>`);
      push_element($$renderer2, "form", 36, 2);
      $$renderer2.push(`<div class="form-grid">`);
      push_element($$renderer2, "div", 37, 4);
      $$renderer2.push(`<div class="form-group span-2">`);
      push_element($$renderer2, "div", 38, 6);
      $$renderer2.push(`<label class="form-label" for="serial_number">`);
      push_element($$renderer2, "label", 39, 8);
      $$renderer2.push(`Serial Number</label>`);
      pop_element();
      $$renderer2.push(` <input id="serial_number" name="serial_number" class="input-field"/>`);
      push_element($$renderer2, "input", 40, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group span-2">`);
      push_element($$renderer2, "div", 42, 6);
      $$renderer2.push(`<label class="form-label" for="asset_tag">`);
      push_element($$renderer2, "label", 43, 8);
      $$renderer2.push(`Asset Tag</label>`);
      pop_element();
      $$renderer2.push(` <input id="asset_tag" name="asset_tag" class="input-field"/>`);
      push_element($$renderer2, "input", 44, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group span-2">`);
      push_element($$renderer2, "div", 46, 6);
      $$renderer2.push(`<label class="form-label" for="condition">`);
      push_element($$renderer2, "label", 47, 8);
      $$renderer2.push(`Condition *</label>`);
      pop_element();
      $$renderer2.push(` <select id="condition" name="condition" class="input-field" required="">`);
      push_element($$renderer2, "select", 48, 8);
      $$renderer2.option({ value: "new" }, ($$renderer3) => {
        push_element($$renderer3, "option", 49, 10);
        $$renderer3.push(`New`);
        pop_element();
      });
      $$renderer2.option({ value: "good" }, ($$renderer3) => {
        push_element($$renderer3, "option", 50, 10);
        $$renderer3.push(`Good`);
        pop_element();
      });
      $$renderer2.option({ value: "fair" }, ($$renderer3) => {
        push_element($$renderer3, "option", 51, 10);
        $$renderer3.push(`Fair`);
        pop_element();
      });
      $$renderer2.option({ value: "poor" }, ($$renderer3) => {
        push_element($$renderer3, "option", 52, 10);
        $$renderer3.push(`Poor`);
        pop_element();
      });
      $$renderer2.push(`</select>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group span-2">`);
      push_element($$renderer2, "div", 55, 6);
      $$renderer2.push(`<label class="form-label" for="notes">`);
      push_element($$renderer2, "label", 56, 8);
      $$renderer2.push(`Notes</label>`);
      pop_element();
      $$renderer2.push(` <textarea id="notes" name="notes" class="input-field" rows="2">`);
      push_element($$renderer2, "textarea", 57, 8);
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="form-actions">`);
      push_element($$renderer2, "div", 61, 4);
      $$renderer2.push(`<a${attr("href", `../../../${stringify(data.itemId)}`)} class="btn btn-ghost">`);
      push_element($$renderer2, "a", 62, 6);
      $$renderer2.push(`Cancel</a>`);
      pop_element();
      $$renderer2.push(` <button type="submit" class="btn btn-primary"${attr("disabled", loading, true)}>`);
      push_element($$renderer2, "button", 63, 6);
      $$renderer2.push(`${escape_html("Add Unit")}</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</form>`);
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
//# sourceMappingURL=_page.svelte-Ct3gWHw0.js.map
