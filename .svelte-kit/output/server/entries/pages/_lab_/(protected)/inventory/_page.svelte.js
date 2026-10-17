import { F as head, t as attr, K as stringify, y as ensure_array_like, z as escape_html, u as attr_class } from "../../../../../chunks/renderer.js";
import { a as push_element, p as pop_element } from "../../../../../chunks/dev2.js";
import { F as FILENAME } from "../../../../../chunks/constants.js";
_page[FILENAME] = "src/routes/[lab]/(protected)/inventory/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const canManage = ["admin", "manager"].includes(data.role);
      head("1dj552l", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Inventory — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 26, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 27, 2);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 27, 7);
      $$renderer2.push(`Inventory</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div style="display:flex;gap:.5rem">`);
      push_element($$renderer2, "div", 28, 2);
      if (canManage) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn btn-secondary btn-sm">`);
        push_element($$renderer2, "button", 30, 6);
        $$renderer2.push(`Import CSV</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <a${attr("href", `/${stringify(data.labSlug)}/inventory/new`)} class="btn btn-primary">`);
      push_element($$renderer2, "a", 32, 4);
      $$renderer2.push(`+ Add Item</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form method="GET" class="flex-gap mb2">`);
      push_element($$renderer2, "form", 55, 0);
      $$renderer2.push(`<input name="q"${attr("value", data.q)} placeholder="Search name or SKU…" style="padding:0.5rem 0.75rem;border:1px solid var(--c-border-2);min-width:220px"/>`);
      push_element($$renderer2, "input", 56, 2);
      pop_element();
      $$renderer2.push(` <select name="category" style="padding:0.5rem;border:1px solid var(--c-border-2)">`);
      push_element($$renderer2, "select", 57, 2);
      $$renderer2.option({ value: "" }, ($$renderer3) => {
        push_element($$renderer3, "option", 58, 4);
        $$renderer3.push(`All categories`);
        pop_element();
      });
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.categories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let c = each_array[$$index];
        $$renderer2.option({ value: c, selected: c === data.catFilter }, ($$renderer3) => {
          push_element($$renderer3, "option", 60, 6);
          $$renderer3.push(`${escape_html(c)}`);
          pop_element();
        });
      }
      $$renderer2.push(`<!--]--></select>`);
      pop_element();
      $$renderer2.push(` <select name="mode" style="padding:0.5rem;border:1px solid var(--c-border-2)">`);
      push_element($$renderer2, "select", 63, 2);
      $$renderer2.option({ value: "" }, ($$renderer3) => {
        push_element($$renderer3, "option", 64, 4);
        $$renderer3.push(`All modes`);
        pop_element();
      });
      $$renderer2.option(
        {
          value: "serialized",
          selected: data.modeFilter === "serialized"
        },
        ($$renderer3) => {
          push_element($$renderer3, "option", 65, 4);
          $$renderer3.push(`Serialized`);
          pop_element();
        }
      );
      $$renderer2.option({ value: "bulk", selected: data.modeFilter === "bulk" }, ($$renderer3) => {
        push_element($$renderer3, "option", 66, 4);
        $$renderer3.push(`Bulk`);
        pop_element();
      });
      $$renderer2.push(`</select>`);
      pop_element();
      $$renderer2.push(` <button type="submit" class="btn btn-secondary btn-sm">`);
      push_element($$renderer2, "button", 68, 2);
      $$renderer2.push(`Filter</button>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.q || data.catFilter || data.modeFilter) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="?" class="btn btn-ghost btn-sm">`);
        push_element($$renderer2, "a", 70, 4);
        $$renderer2.push(`Clear</a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></form>`);
      pop_element();
      $$renderer2.push(` <div class="card">`);
      push_element($$renderer2, "div", 74, 0);
      $$renderer2.push(`<div class="table-wrap">`);
      push_element($$renderer2, "div", 75, 2);
      if (data.rows.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="empty-msg">`);
        push_element($$renderer2, "p", 77, 6);
        $$renderer2.push(`No items match your filters.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<table>`);
        push_element($$renderer2, "table", 79, 6);
        $$renderer2.push(`<thead>`);
        push_element($$renderer2, "thead", 80, 8);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 81, 10);
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 81, 14);
        $$renderer2.push(`Name</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 81, 27);
        $$renderer2.push(`SKU</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 81, 39);
        $$renderer2.push(`Category</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 81, 56);
        $$renderer2.push(`Mode</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 81, 69);
        $$renderer2.push(`Available</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 81, 87);
        $$renderer2.push(`</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 83, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(data.rows);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let item = each_array_1[$$index_1];
          $$renderer2.push(`<tr>`);
          push_element($$renderer2, "tr", 85, 12);
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 86, 14);
          $$renderer2.push(`<a${attr("href", `inventory/${stringify(item.id)}`)}>`);
          push_element($$renderer2, "a", 86, 18);
          $$renderer2.push(`${escape_html(item.name)}</a>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="td-mono">`);
          push_element($$renderer2, "td", 87, 14);
          $$renderer2.push(`${escape_html(item.sku ?? "—")}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 88, 14);
          $$renderer2.push(`${escape_html(item.category ?? "—")}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 89, 14);
          $$renderer2.push(`<span class="badge badge-gray">`);
          push_element($$renderer2, "span", 89, 18);
          $$renderer2.push(`${escape_html(item.tracking_mode)}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 90, 14);
          $$renderer2.push(`<span${attr_class(`badge ${item.avail === 0 ? "badge-red" : item.avail < item.total ? "badge-yellow" : "badge-green"}`)}>`);
          push_element($$renderer2, "span", 91, 16);
          $$renderer2.push(`${escape_html(item.avail)} / ${escape_html(item.total)}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 95, 14);
          $$renderer2.push(`<a${attr("href", `inventory/${stringify(item.id)}`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 95, 18);
          $$renderer2.push(`View</a>`);
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
export {
  _page as default
};
