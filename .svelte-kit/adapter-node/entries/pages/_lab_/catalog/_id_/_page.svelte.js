import { F as head, t as attr, K as stringify, z as escape_html, y as ensure_array_like } from "../../../../../chunks/renderer.js";
import { a as push_element, p as pop_element } from "../../../../../chunks/dev2.js";
import { F as FILENAME } from "../../../../../chunks/constants.js";
_page[FILENAME] = "src/routes/[lab]/catalog/[id]/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const item = data.item;
      const canBorrow = ["admin", "manager", "technician", "instructor"].includes(data.userMembership?.role ?? "");
      const canReserve = !!data.token;
      const loginNext = `/login?next=${encodeURIComponent(`/${data.lab.slug}/borrows/new?item_id=${item.id}`)}`;
      const reserveNext = `/login?next=${encodeURIComponent(`/${data.lab.slug}/reservations/new?item_id=${item.id}`)}`;
      head("ohzbcw", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>${escape_html(item.name)} — ${escape_html(data.lab.name)}</title>`);
        });
      });
      $$renderer2.push(`<div style="max-width:800px;margin:0 auto;padding:1.5rem">`);
      push_element($$renderer2, "div", 14, 0);
      $$renderer2.push(`<a href="../catalog" class="back-link" style="font-size:0.85rem;color:var(--c-text-2);text-decoration:none">`);
      push_element($$renderer2, "a", 15, 2);
      $$renderer2.push(`← Catalog</a>`);
      pop_element();
      $$renderer2.push(` <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1rem" class="item-detail-grid svelte-ohzbcw">`);
      push_element($$renderer2, "div", 17, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 18, 4);
      if (item.image_path) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<img${attr("src", `/api/${stringify(data.lab.id)}/items/${stringify(item.id)}/image`)}${attr("alt", item.name)} style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3"/>`);
        push_element($$renderer2, "img", 20, 8);
        pop_element();
      } else if (item.photo_url) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<img${attr("src", item.photo_url)}${attr("alt", item.name)} style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3" onerror="this.__e=event"/>`);
        push_element($$renderer2, "img", 22, 8);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div style="width:100%;aspect-ratio:4/3;background:var(--c-bg-2);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--c-text-3);font-size:3rem">`);
        push_element($$renderer2, "div", 24, 8);
        $$renderer2.push(`📦</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 28, 4);
      $$renderer2.push(`<h1 style="font-size:1.5rem;font-weight:700;margin:0 0 0.25rem">`);
      push_element($$renderer2, "h1", 29, 6);
      $$renderer2.push(`${escape_html(item.name)}</h1>`);
      pop_element();
      $$renderer2.push(` `);
      if (item.brand || item.model) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p style="color:var(--c-text-2);margin:0 0 1rem">`);
        push_element($$renderer2, "p", 30, 36);
        $$renderer2.push(`${escape_html(item.brand ?? "")} ${escape_html(item.model ?? "")}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem">`);
      push_element($$renderer2, "div", 32, 6);
      if (item.category) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="badge badge-blue">`);
        push_element($$renderer2, "span", 33, 27);
        $$renderer2.push(`${escape_html(item.category)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span class="badge badge-gray">`);
      push_element($$renderer2, "span", 34, 8);
      $$renderer2.push(`${escape_html(item.tracking_mode)}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (item.notes) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p style="font-size:0.9rem;color:var(--c-text-2)">`);
        push_element($$renderer2, "p", 37, 22);
        $$renderer2.push(`${escape_html(item.notes)}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if ((item.included_accessories ?? []).length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div style="margin-top:1rem">`);
        push_element($$renderer2, "div", 40, 8);
        $$renderer2.push(`<p style="font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--c-text-2);margin:0 0 0.5rem">`);
        push_element($$renderer2, "p", 41, 10);
        $$renderer2.push(`What's included</p>`);
        pop_element();
        $$renderer2.push(` <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.25rem">`);
        push_element($$renderer2, "ul", 42, 10);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(item.included_accessories ?? []);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let acc = each_array[$$index];
          $$renderer2.push(`<li style="font-size:0.9rem;display:flex;gap:0.5rem">`);
          push_element($$renderer2, "li", 44, 14);
          $$renderer2.push(`<span style="color:#198038">`);
          push_element($$renderer2, "span", 44, 67);
          $$renderer2.push(`✓</span>`);
          pop_element();
          $$renderer2.push(`${escape_html(acc)}</li>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.5rem">`);
      push_element($$renderer2, "div", 50, 6);
      if (canBorrow) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", `/${stringify(data.lab.slug)}/borrows/new?item_id=${stringify(item.id)}`)} class="btn btn-primary">`);
        push_element($$renderer2, "a", 52, 10);
        $$renderer2.push(`Borrow this Item</a>`);
        pop_element();
      } else if (canReserve) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<a${attr("href", `/${stringify(data.lab.slug)}/reservations/new?item_id=${stringify(item.id)}`)} class="btn btn-primary">`);
        push_element($$renderer2, "a", 54, 10);
        $$renderer2.push(`Reserve this Item</a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<a${attr("href", loginNext)} class="btn btn-primary">`);
        push_element($$renderer2, "a", 56, 10);
        $$renderer2.push(`Sign in to Borrow</a>`);
        pop_element();
        $$renderer2.push(` <a${attr("href", reserveNext)} class="btn btn-secondary btn-sm">`);
        push_element($$renderer2, "a", 57, 10);
        $$renderer2.push(`Sign in to Reserve</a>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> `);
      if (item.datasheet_url) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", item.datasheet_url)} target="_blank" rel="noopener" class="btn btn-ghost btn-sm">`);
        push_element($$renderer2, "a", 60, 10);
        $$renderer2.push(`Datasheet ↗</a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (item.official_page_url) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", item.official_page_url)} target="_blank" rel="noopener" class="btn btn-ghost btn-sm">`);
        push_element($$renderer2, "a", 63, 10);
        $$renderer2.push(`Manufacturer Page ↗</a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if ((item.tutorial_links ?? []).length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div style="margin-top:0.5rem">`);
        push_element($$renderer2, "div", 66, 10);
        $$renderer2.push(`<p style="font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--c-text-2);margin:0 0 0.25rem">`);
        push_element($$renderer2, "p", 67, 12);
        $$renderer2.push(`Tutorials</p>`);
        pop_element();
        $$renderer2.push(` <!--[-->`);
        const each_array_1 = ensure_array_like(item.tutorial_links);
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let url = each_array_1[i];
          $$renderer2.push(`<a${attr("href", url)} target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="margin-top:0.25rem">`);
          push_element($$renderer2, "a", 69, 14);
          $$renderer2.push(`Tutorial ${escape_html(i + 1)} ↗</a>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
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
export {
  _page as default
};
