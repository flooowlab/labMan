import { F as head, y as ensure_array_like, t as attr, z as escape_html } from "../../../../../../chunks/renderer.js";
import { a as push_element, p as pop_element } from "../../../../../../chunks/dev2.js";
import { F as FILENAME } from "../../../../../../chunks/constants.js";
_page[FILENAME] = "src/routes/[lab]/(protected)/kits/new/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      let loading = false;
      let lines = [{ item_id: "", quantity: 1 }];
      head("1l63pv7", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>New Kit — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 32, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 33, 2);
      $$renderer2.push(`<a href="../kits" class="back-link">`);
      push_element($$renderer2, "a", 34, 4);
      $$renderer2.push(`← Kits</a>`);
      pop_element();
      $$renderer2.push(` <h1 class="ph-title">`);
      push_element($$renderer2, "h1", 35, 4);
      $$renderer2.push(`New Kit</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="card" style="max-width:640px">`);
      push_element($$renderer2, "div", 39, 0);
      $$renderer2.push(`<form>`);
      push_element($$renderer2, "form", 40, 2);
      $$renderer2.push(`<div class="form-grid">`);
      push_element($$renderer2, "div", 41, 4);
      $$renderer2.push(`<div class="form-group span-2">`);
      push_element($$renderer2, "div", 42, 6);
      $$renderer2.push(`<label class="form-label" for="name">`);
      push_element($$renderer2, "label", 43, 8);
      $$renderer2.push(`Kit Name *</label>`);
      pop_element();
      $$renderer2.push(` <input id="name" name="name" class="input-field" required=""/>`);
      push_element($$renderer2, "input", 44, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 46, 6);
      $$renderer2.push(`<label class="form-label" for="version">`);
      push_element($$renderer2, "label", 47, 8);
      $$renderer2.push(`Version</label>`);
      pop_element();
      $$renderer2.push(` <input id="version" name="version" class="input-field" placeholder="e.g. v1.0"/>`);
      push_element($$renderer2, "input", 48, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group span-2">`);
      push_element($$renderer2, "div", 50, 6);
      $$renderer2.push(`<label class="form-label" for="description">`);
      push_element($$renderer2, "label", 51, 8);
      $$renderer2.push(`Description</label>`);
      pop_element();
      $$renderer2.push(` <textarea id="description" name="description" class="input-field" rows="2">`);
      push_element($$renderer2, "textarea", 52, 8);
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt2 mb1 text-sm" style="font-weight:600">`);
      push_element($$renderer2, "div", 56, 4);
      $$renderer2.push(`Kit Lines</div>`);
      pop_element();
      $$renderer2.push(` <!--[-->`);
      const each_array = ensure_array_like(lines);
      for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
        let line = each_array[idx];
        $$renderer2.push(`<div class="flex-gap mb1">`);
        push_element($$renderer2, "div", 58, 6);
        $$renderer2.push(`<input class="input-field" placeholder="Item ID"${attr("value", line.item_id)} style="flex:1"/>`);
        push_element($$renderer2, "input", 59, 8);
        pop_element();
        $$renderer2.push(` <input class="input-field" type="number" min="1"${attr("value", line.quantity)} style="width:80px"/>`);
        push_element($$renderer2, "input", 60, 8);
        pop_element();
        $$renderer2.push(` `);
        if (lines.length > 1) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button type="button" class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "button", 62, 10);
          $$renderer2.push(`✕</button>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <button type="button" class="btn btn-ghost btn-sm mb2">`);
      push_element($$renderer2, "button", 66, 4);
      $$renderer2.push(`+ Add Line</button>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="form-actions">`);
      push_element($$renderer2, "div", 69, 4);
      $$renderer2.push(`<a href="../kits" class="btn btn-ghost">`);
      push_element($$renderer2, "a", 70, 6);
      $$renderer2.push(`Cancel</a>`);
      pop_element();
      $$renderer2.push(` <button type="submit" class="btn btn-primary"${attr("disabled", loading, true)}>`);
      push_element($$renderer2, "button", 71, 6);
      $$renderer2.push(`${escape_html("Create Kit")}</button>`);
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
export {
  _page as default
};
