import { a6 as head, K as attr, ap as stringify, a0 as escape_html, _ as ensure_array_like } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

_page[FILENAME] = "src/routes/[lab]/(protected)/inventory/[id]/edit/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const i = data.item;
      let loading = false;
      head("1csw516", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Edit ${escape_html(data.item.name)} — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 43, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 44, 2);
      $$renderer2.push(`<a${attr("href", `../../${stringify(i.id)}`)} class="back-link">`);
      push_element($$renderer2, "a", 45, 4);
      $$renderer2.push(`← ${escape_html(i.name)}</a>`);
      pop_element();
      $$renderer2.push(` <h1 class="ph-title">`);
      push_element($$renderer2, "h1", 46, 4);
      $$renderer2.push(`Edit Item</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="card" style="max-width:640px">`);
      push_element($$renderer2, "div", 50, 0);
      $$renderer2.push(`<form>`);
      push_element($$renderer2, "form", 51, 2);
      $$renderer2.push(`<div class="form-grid">`);
      push_element($$renderer2, "div", 52, 4);
      $$renderer2.push(`<div class="form-group span-2">`);
      push_element($$renderer2, "div", 53, 6);
      $$renderer2.push(`<label class="form-label" for="name">`);
      push_element($$renderer2, "label", 54, 8);
      $$renderer2.push(`Name *</label>`);
      pop_element();
      $$renderer2.push(` <input id="name" name="name" class="input-field" required=""${attr("value", i.name)}/>`);
      push_element($$renderer2, "input", 55, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 57, 6);
      $$renderer2.push(`<label class="form-label" for="category">`);
      push_element($$renderer2, "label", 58, 8);
      $$renderer2.push(`Category</label>`);
      pop_element();
      $$renderer2.push(` <input id="category" name="category" class="input-field"${attr("value", i.category ?? "")}/>`);
      push_element($$renderer2, "input", 59, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 61, 6);
      $$renderer2.push(`<label class="form-label" for="sku">`);
      push_element($$renderer2, "label", 62, 8);
      $$renderer2.push(`SKU</label>`);
      pop_element();
      $$renderer2.push(` <input id="sku" name="sku" class="input-field"${attr("value", i.sku ?? "")}/>`);
      push_element($$renderer2, "input", 63, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 65, 6);
      $$renderer2.push(`<label class="form-label" for="brand">`);
      push_element($$renderer2, "label", 66, 8);
      $$renderer2.push(`Brand</label>`);
      pop_element();
      $$renderer2.push(` <input id="brand" name="brand" class="input-field"${attr("value", i.brand ?? "")}/>`);
      push_element($$renderer2, "input", 67, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 69, 6);
      $$renderer2.push(`<label class="form-label" for="model">`);
      push_element($$renderer2, "label", 70, 8);
      $$renderer2.push(`Model</label>`);
      pop_element();
      $$renderer2.push(` <input id="model" name="model" class="input-field"${attr("value", i.model ?? "")}/>`);
      push_element($$renderer2, "input", 71, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group span-2">`);
      push_element($$renderer2, "div", 73, 6);
      $$renderer2.push(`<label class="form-label" for="image-upload">`);
      push_element($$renderer2, "label", 74, 8);
      $$renderer2.push(`Item Image</label>`);
      pop_element();
      $$renderer2.push(` `);
      if (i.image_path) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div style="margin-bottom:0.5rem">`);
        push_element($$renderer2, "div", 76, 10);
        $$renderer2.push(`<img${attr("src", `/api/${stringify(data.labId)}/items/${stringify(i.id)}/image`)}${attr("alt", i.name)} style="max-height:140px;border-radius:4px;object-fit:cover"/>`);
        push_element($$renderer2, "img", 77, 12);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <input id="image-upload" type="file" accept="image/jpeg,image/png,image/webp" class="input-field"/>`);
      push_element($$renderer2, "input", 80, 8);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted mt1">`);
      push_element($$renderer2, "p", 81, 8);
      $$renderer2.push(`Upload a JPG, PNG, or WebP image (max 5 MB). This replaces the current image.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group span-2">`);
      push_element($$renderer2, "div", 83, 6);
      $$renderer2.push(`<label class="form-label" for="photo_url">`);
      push_element($$renderer2, "label", 84, 8);
      $$renderer2.push(`Photo URL <span class="text-muted" style="font-weight:400">`);
      push_element($$renderer2, "span", 84, 60);
      $$renderer2.push(`(external link)</span>`);
      pop_element();
      $$renderer2.push(`</label>`);
      pop_element();
      $$renderer2.push(` <input id="photo_url" name="photo_url" type="url" class="input-field"${attr("value", i.photo_url ?? "")} placeholder="https://..."/>`);
      push_element($$renderer2, "input", 85, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 87, 6);
      $$renderer2.push(`<label class="form-label" for="default_location_id">`);
      push_element($$renderer2, "label", 88, 8);
      $$renderer2.push(`Default Location</label>`);
      pop_element();
      $$renderer2.push(` <select id="default_location_id" name="default_location_id" class="input-field">`);
      push_element($$renderer2, "select", 89, 8);
      $$renderer2.option({ value: "" }, ($$renderer3) => {
        push_element($$renderer3, "option", 90, 10);
        $$renderer3.push(`— None —`);
        pop_element();
      });
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.locations);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let loc = each_array[$$index];
        $$renderer2.option({ value: loc.id, selected: loc.id === i.default_location_id }, ($$renderer3) => {
          push_element($$renderer3, "option", 92, 12);
          $$renderer3.push(`${escape_html(loc.name)}`);
          pop_element();
        });
      }
      $$renderer2.push(`<!--]--></select>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 96, 6);
      $$renderer2.push(`<label class="form-label" for="label_size">`);
      push_element($$renderer2, "label", 97, 8);
      $$renderer2.push(`Label Size</label>`);
      pop_element();
      $$renderer2.push(` <select id="label_size" name="label_size" class="input-field">`);
      push_element($$renderer2, "select", 98, 8);
      $$renderer2.option({ value: "standard", selected: i.label_size === "standard" }, ($$renderer3) => {
        push_element($$renderer3, "option", 99, 10);
        $$renderer3.push(`Standard`);
        pop_element();
      });
      $$renderer2.option({ value: "card", selected: i.label_size === "card" }, ($$renderer3) => {
        push_element($$renderer3, "option", 100, 10);
        $$renderer3.push(`Card`);
        pop_element();
      });
      $$renderer2.push(`</select>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group span-2">`);
      push_element($$renderer2, "div", 103, 6);
      $$renderer2.push(`<label class="form-label" for="included_accessories">`);
      push_element($$renderer2, "label", 104, 8);
      $$renderer2.push(`What's included (one per line)</label>`);
      pop_element();
      $$renderer2.push(` <textarea id="included_accessories" name="included_accessories" class="input-field" rows="3">`);
      push_element($$renderer2, "textarea", 105, 8);
      const $$body = escape_html((i.included_accessories ?? []).join("\n"));
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group span-2">`);
      push_element($$renderer2, "div", 107, 6);
      $$renderer2.push(`<label class="form-label" for="notes">`);
      push_element($$renderer2, "label", 108, 8);
      $$renderer2.push(`Notes</label>`);
      pop_element();
      $$renderer2.push(` <textarea id="notes" name="notes" class="input-field" rows="3">`);
      push_element($$renderer2, "textarea", 109, 8);
      const $$body_1 = escape_html(i.notes ?? "");
      if ($$body_1) {
        $$renderer2.push(`${$$body_1}`);
      }
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
      push_element($$renderer2, "div", 113, 4);
      $$renderer2.push(`<a${attr("href", `../../${stringify(i.id)}`)} class="btn btn-ghost">`);
      push_element($$renderer2, "a", 114, 6);
      $$renderer2.push(`Cancel</a>`);
      pop_element();
      $$renderer2.push(` <button type="submit" class="btn btn-primary"${attr("disabled", loading, true)}>`);
      push_element($$renderer2, "button", 115, 6);
      $$renderer2.push(`${escape_html("Save Changes")}</button>`);
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
//# sourceMappingURL=_page.svelte-DZzWgWwE.js.map
