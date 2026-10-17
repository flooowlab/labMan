import { F as head, z as escape_html, t as attr, K as stringify, y as ensure_array_like, u as attr_class, w as clsx, x as derived } from "../../../../../../chunks/renderer.js";
import { s as statusClass } from "../../../../../../chunks/utils2.js";
import { a as push_element, p as pop_element } from "../../../../../../chunks/dev2.js";
import { F as FILENAME } from "../../../../../../chunks/constants.js";
_page[FILENAME] = "src/routes/[lab]/(protected)/inventory/[id]/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const i = derived(() => data.item);
      head("1no74jp", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>${escape_html(data.item.name)} — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 10, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 11, 2);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 12, 4);
      $$renderer2.push(`${escape_html(i().name)}</h1>`);
      pop_element();
      $$renderer2.push(` <p class="ph-sub">`);
      push_element($$renderer2, "p", 13, 4);
      $$renderer2.push(`${escape_html(i().sku ?? "")} · ${escape_html(i().brand ?? "")} ${escape_html(i().model ?? "")}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex-gap">`);
      push_element($$renderer2, "div", 15, 2);
      $$renderer2.push(`<a${attr("href", `/api/${stringify(data.labId)}/items/${stringify(i().id)}/label`)} class="btn btn-ghost btn-sm" target="_blank">`);
      push_element($$renderer2, "a", 16, 4);
      $$renderer2.push(`Print Label</a>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.canEdit) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", `${stringify(i().id)}/edit`)} class="btn btn-secondary btn-sm">`);
        push_element($$renderer2, "a", 18, 6);
        $$renderer2.push(`Edit</a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (i().image_path) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="card mb2" style="overflow:hidden">`);
        push_element($$renderer2, "div", 24, 2);
        $$renderer2.push(`<img${attr("src", `/api/${stringify(data.labId)}/items/${stringify(i().id)}/image`)}${attr("alt", i().name)} style="width:100%;max-height:320px;object-fit:cover"/>`);
        push_element($$renderer2, "img", 25, 4);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="card mb2">`);
      push_element($$renderer2, "div", 29, 0);
      $$renderer2.push(`<div class="card-head">`);
      push_element($$renderer2, "div", 30, 2);
      $$renderer2.push(`<span class="card-title">`);
      push_element($$renderer2, "span", 30, 25);
      $$renderer2.push(`Details</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="card-body">`);
      push_element($$renderer2, "div", 31, 2);
      $$renderer2.push(`<div class="field-row">`);
      push_element($$renderer2, "div", 32, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 33, 6);
      $$renderer2.push(`<p class="text-xs text-muted mb1">`);
      push_element($$renderer2, "p", 33, 11);
      $$renderer2.push(`Category</p>`);
      pop_element();
      $$renderer2.push(`<p>`);
      push_element($$renderer2, "p", 33, 57);
      $$renderer2.push(`${escape_html(i().category ?? "—")}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 34, 6);
      $$renderer2.push(`<p class="text-xs text-muted mb1">`);
      push_element($$renderer2, "p", 34, 11);
      $$renderer2.push(`Tracking</p>`);
      pop_element();
      $$renderer2.push(`<p>`);
      push_element($$renderer2, "p", 34, 57);
      $$renderer2.push(`<span class="badge badge-gray">`);
      push_element($$renderer2, "span", 34, 60);
      $$renderer2.push(`${escape_html(i().tracking_mode)}</span>`);
      pop_element();
      $$renderer2.push(`</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 35, 6);
      $$renderer2.push(`<p class="text-xs text-muted mb1">`);
      push_element($$renderer2, "p", 36, 8);
      $$renderer2.push(`Available</p>`);
      pop_element();
      $$renderer2.push(` <p>`);
      push_element($$renderer2, "p", 37, 8);
      $$renderer2.push(`${escape_html(data.availCount)}${escape_html(i().tracking_mode === "bulk" ? ` / ${i().quantity_total}` : ` unit${data.units.length !== 1 ? "s" : ""}`)}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 39, 6);
      $$renderer2.push(`<p class="text-xs text-muted mb1">`);
      push_element($$renderer2, "p", 39, 11);
      $$renderer2.push(`Barcode</p>`);
      pop_element();
      $$renderer2.push(`<p class="mono">`);
      push_element($$renderer2, "p", 39, 56);
      $$renderer2.push(`${escape_html(i().barcode ?? "—")}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (i().notes) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="mt1 text-sm text-muted">`);
        push_element($$renderer2, "p", 41, 17);
        $$renderer2.push(`${escape_html(i().notes)}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (i().tracking_mode === "serialized") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="card">`);
        push_element($$renderer2, "div", 46, 2);
        $$renderer2.push(`<div class="card-head">`);
        push_element($$renderer2, "div", 47, 4);
        $$renderer2.push(`<span class="card-title">`);
        push_element($$renderer2, "span", 48, 6);
        $$renderer2.push(`Units (${escape_html(data.units.length)})</span>`);
        pop_element();
        $$renderer2.push(` `);
        if (data.canEdit) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `${stringify(i().id)}/units/new`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 50, 8);
          $$renderer2.push(`Add Unit</a>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="table-wrap">`);
        push_element($$renderer2, "div", 53, 4);
        if (data.units.length === 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="empty-msg">`);
          push_element($$renderer2, "p", 55, 8);
          $$renderer2.push(`No units yet.</p>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<table>`);
          push_element($$renderer2, "table", 57, 8);
          $$renderer2.push(`<thead>`);
          push_element($$renderer2, "thead", 58, 10);
          $$renderer2.push(`<tr>`);
          push_element($$renderer2, "tr", 58, 17);
          $$renderer2.push(`<th>`);
          push_element($$renderer2, "th", 58, 21);
          $$renderer2.push(`Barcode</th>`);
          pop_element();
          $$renderer2.push(`<th>`);
          push_element($$renderer2, "th", 58, 37);
          $$renderer2.push(`Serial</th>`);
          pop_element();
          $$renderer2.push(`<th>`);
          push_element($$renderer2, "th", 58, 52);
          $$renderer2.push(`Asset Tag</th>`);
          pop_element();
          $$renderer2.push(`<th>`);
          push_element($$renderer2, "th", 58, 70);
          $$renderer2.push(`Status</th>`);
          pop_element();
          $$renderer2.push(`<th>`);
          push_element($$renderer2, "th", 58, 85);
          $$renderer2.push(`Condition</th>`);
          pop_element();
          $$renderer2.push(`<th>`);
          push_element($$renderer2, "th", 58, 103);
          $$renderer2.push(`</th>`);
          pop_element();
          $$renderer2.push(`</tr>`);
          pop_element();
          $$renderer2.push(`</thead>`);
          pop_element();
          $$renderer2.push(`<tbody>`);
          push_element($$renderer2, "tbody", 59, 10);
          $$renderer2.push(`<!--[-->`);
          const each_array = ensure_array_like(data.units);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let u = each_array[$$index];
            $$renderer2.push(`<tr>`);
            push_element($$renderer2, "tr", 61, 14);
            $$renderer2.push(`<td class="td-mono">`);
            push_element($$renderer2, "td", 62, 16);
            $$renderer2.push(`${escape_html(u.barcode)}</td>`);
            pop_element();
            $$renderer2.push(`<td class="td-mono">`);
            push_element($$renderer2, "td", 63, 16);
            $$renderer2.push(`${escape_html(u.serial_number ?? "—")}</td>`);
            pop_element();
            $$renderer2.push(`<td class="td-mono">`);
            push_element($$renderer2, "td", 64, 16);
            $$renderer2.push(`${escape_html(u.asset_tag ?? "—")}</td>`);
            pop_element();
            $$renderer2.push(`<td>`);
            push_element($$renderer2, "td", 65, 16);
            $$renderer2.push(`<span${attr_class(clsx(statusClass(u.status)))}>`);
            push_element($$renderer2, "span", 65, 20);
            $$renderer2.push(`${escape_html(u.status)}</span>`);
            pop_element();
            $$renderer2.push(`</td>`);
            pop_element();
            $$renderer2.push(`<td>`);
            push_element($$renderer2, "td", 66, 16);
            $$renderer2.push(`<span${attr_class(clsx(statusClass(u.condition)))}>`);
            push_element($$renderer2, "span", 66, 20);
            $$renderer2.push(`${escape_html(u.condition)}</span>`);
            pop_element();
            $$renderer2.push(`</td>`);
            pop_element();
            $$renderer2.push(`<td>`);
            push_element($$renderer2, "td", 67, 16);
            $$renderer2.push(`<a${attr("href", `/api/${stringify(data.labId)}/units/${stringify(u.id)}/label`)} class="btn btn-ghost btn-sm" target="_blank">`);
            push_element($$renderer2, "a", 67, 20);
            $$renderer2.push(`Label</a>`);
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
      } else {
        $$renderer2.push("<!--[-1-->");
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
