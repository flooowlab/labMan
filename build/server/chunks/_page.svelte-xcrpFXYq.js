import { a6 as head, a0 as escape_html, K as attr, ap as stringify, O as attr_class, _ as ensure_array_like, Q as attr_style, Z as derived } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';
import { L as LoginForm } from './LoginForm-C9-ME4EB.js';

CatalogGallery[FILENAME] = "src/components/CatalogGallery.svelte";
function CatalogGallery($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { items, labId, labSlug } = $$props;
      const PALETTE = [
        "#0f62fe",
        "#6929c4",
        "#9f1853",
        "#b45309",
        "#005d5d",
        "#198038",
        "#00539a",
        "#8a3800",
        "#1192e8",
        "#a2191f",
        "#007d79",
        "#4d5358"
      ];
      function categoryColor(cat) {
        let h = 0;
        for (let i = 0; i < cat.length; i++) h = h * 31 + cat.charCodeAt(i) >>> 0;
        return PALETTE[h % PALETTE.length];
      }
      let query = "";
      let activeCategory = null;
      const categories = derived(() => [...new Set(items.map((i) => i.category).filter(Boolean))].sort());
      const results = derived(() => (() => {
        let list = items;
        if (query.trim()) {
          const q = query.trim().toLowerCase();
          list = list.filter((i) => (i.name + " " + (i.brand ?? "") + " " + (i.model ?? "") + " " + (i.category ?? "")).toLowerCase().includes(q));
        }
        return list;
      })());
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 30, 0);
      $$renderer2.push(`<div style="display:flex;gap:0.75rem;align-items:center;margin-bottom:1rem;flex-wrap:wrap">`);
      push_element($$renderer2, "div", 31, 2);
      $$renderer2.push(`<input type="search"${attr("value", query)} placeholder="Search by name, brand, model…" style="flex:1 1 240px;padding:0.625rem 0.875rem;border:2px solid var(--c-border-2);font-size:var(--text-sm);min-width:0" autofocus=""/>`);
      push_element($$renderer2, "input", 32, 4);
      pop_element();
      $$renderer2.push(` <div style="display:flex;flex-shrink:0">`);
      push_element($$renderer2, "div", 33, 4);
      $$renderer2.push(`<button${attr_class(`view-btn ${""}`, "svelte-10z7wdx")} style="border-right:none" title="List view">`);
      push_element($$renderer2, "button", 34, 6);
      $$renderer2.push(`☰ List</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`view-btn ${"active"}`, "svelte-10z7wdx")} title="Gallery view">`);
      push_element($$renderer2, "button", 35, 6);
      $$renderer2.push(`⊞ Gallery</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (categories().length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div style="display:flex;gap:0.375rem;flex-wrap:wrap;margin-bottom:1.5rem">`);
        push_element($$renderer2, "div", 40, 4);
        $$renderer2.push(`<button${attr_class(`chip ${"active"}`, "svelte-10z7wdx")}>`);
        push_element($$renderer2, "button", 41, 6);
        $$renderer2.push(`All <span style="opacity:.6">`);
        push_element($$renderer2, "span", 41, 97);
        $$renderer2.push(`(${escape_html(items.length)})</span>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
        $$renderer2.push(` <!--[-->`);
        const each_array = ensure_array_like(categories());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cat = each_array[$$index];
          $$renderer2.push(`<button${attr_class(`chip ${activeCategory === cat ? "active" : ""}`, "svelte-10z7wdx")}>`);
          push_element($$renderer2, "button", 43, 8);
          $$renderer2.push(`${escape_html(cat)} <span style="opacity:.6">`);
          push_element($$renderer2, "span", 43, 137);
          $$renderer2.push(`(${escape_html(items.filter((i) => i.category === cat).length)})</span>`);
          pop_element();
          $$renderer2.push(`</button>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (results().length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p style="color:var(--c-text-2);text-align:center;padding:3rem 0">`);
        push_element($$renderer2, "p", 49, 4);
        $$renderer2.push(`No items found.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div style="columns:260px;column-gap:1rem">`);
        push_element($$renderer2, "div", 51, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(results());
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let item = each_array_1[$$index_1];
          const bg = categoryColor(item.category || "other");
          const imgSrc = item.image_path ? `/api/${labId}/items/${item.id}/image` : item.photo_url ?? null;
          $$renderer2.push(`<a${attr("href", `/${stringify(labSlug)}/catalog/${stringify(item.id)}`)} class="gallery-card" style="break-inside:avoid;display:block;margin-bottom:1rem;text-decoration:none;color:var(--c-text);border:1px solid var(--c-border);background:var(--c-surface);overflow:hidden">`);
          push_element($$renderer2, "a", 55, 8);
          if (imgSrc) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div${attr_style(`position:relative;height:160px;overflow:hidden;background:${stringify(bg)}`)}>`);
            push_element($$renderer2, "div", 57, 12);
            $$renderer2.push(`<img${attr("src", imgSrc)}${attr("alt", item.name)} style="width:100%;height:160px;object-fit:cover;display:block" onerror="this.__e=event"/>`);
            push_element($$renderer2, "img", 58, 14);
            pop_element();
            $$renderer2.push(` <span${attr_style(`position:absolute;bottom:0.5rem;left:0.75rem;background:${stringify(bg)};color:#fff;font-size:var(--text-xs);font-weight:600;padding:.15rem .5rem;text-transform:uppercase;letter-spacing:.06em`)}>`);
            push_element($$renderer2, "span", 59, 14);
            $$renderer2.push(`${escape_html(item.category || "—")}</span>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<div${attr_style(`background:${stringify(bg)};padding:1.25rem 1rem 0.875rem;color:#fff;display:flex;align-items:flex-end;gap:.75rem;min-height:72px`)}>`);
            push_element($$renderer2, "div", 62, 12);
            $$renderer2.push(`<span style="font-size:2.25rem;font-weight:700;line-height:1;opacity:.25">`);
            push_element($$renderer2, "span", 63, 14);
            $$renderer2.push(`${escape_html((item.name || "?")[0].toUpperCase())}</span>`);
            pop_element();
            $$renderer2.push(` <span style="font-size:var(--text-xs);opacity:.9;text-transform:uppercase;letter-spacing:.08em;font-weight:600">`);
            push_element($$renderer2, "span", 64, 14);
            $$renderer2.push(`${escape_html(item.category || "—")}</span>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--> <div style="padding:.875rem 1rem">`);
          push_element($$renderer2, "div", 67, 10);
          $$renderer2.push(`<div style="font-weight:600;margin-bottom:.25rem;font-size:var(--text-sm);line-height:1.4">`);
          push_element($$renderer2, "div", 68, 12);
          $$renderer2.push(`${escape_html(item.name)}</div>`);
          pop_element();
          $$renderer2.push(` `);
          if (item.brand || item.model) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div style="font-size:var(--text-xs);color:var(--c-text-2)">`);
            push_element($$renderer2, "div", 70, 14);
            $$renderer2.push(`${escape_html([item.brand, item.model].filter(Boolean).join(" · "))}</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
          $$renderer2.push(`</a>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    CatalogGallery
  );
}
CatalogGallery.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/[lab]/catalog/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("1kwq5y0", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>${escape_html(data.lab?.name ?? "Catalog")} — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div style="display:flex;gap:1.5rem;align-items:flex-start;padding:1.5rem">`);
      push_element($$renderer2, "div", 10, 0);
      $$renderer2.push(`<div style="flex:1;min-width:0">`);
      push_element($$renderer2, "div", 11, 2);
      $$renderer2.push(`<div style="margin-bottom:1rem">`);
      push_element($$renderer2, "div", 12, 4);
      $$renderer2.push(`<h1 style="font-size:1.5rem;font-weight:700;margin:0">`);
      push_element($$renderer2, "h1", 13, 6);
      $$renderer2.push(`${escape_html(data.lab?.name ?? "Lab")} — Catalog</h1>`);
      pop_element();
      $$renderer2.push(` <p style="color:var(--c-text-2);font-size:0.9rem;margin:0.25rem 0 0">`);
      push_element($$renderer2, "p", 14, 6);
      $$renderer2.push(`Public equipment catalog</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      CatalogGallery($$renderer2, {
        items: data.items,
        labId: data.lab?.id ?? "",
        labSlug: data.lab?.slug ?? ""
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <aside style="width:260px;flex-shrink:0;position:sticky;top:1rem">`);
      push_element($$renderer2, "aside", 19, 2);
      if (data.token) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="card">`);
        push_element($$renderer2, "div", 21, 6);
        $$renderer2.push(`<div class="card-body">`);
        push_element($$renderer2, "div", 22, 8);
        $$renderer2.push(`<p class="text-sm mb1">`);
        push_element($$renderer2, "p", 23, 10);
        $$renderer2.push(`You are signed in.</p>`);
        pop_element();
        $$renderer2.push(` <a${attr("href", `/${stringify(data.lab?.slug)}`)} class="btn btn-primary" style="width:100%">`);
        push_element($$renderer2, "a", 24, 10);
        $$renderer2.push(`Go to Dashboard</a>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="card">`);
        push_element($$renderer2, "div", 28, 6);
        $$renderer2.push(`<div class="card-head">`);
        push_element($$renderer2, "div", 29, 8);
        $$renderer2.push(`<span class="card-title">`);
        push_element($$renderer2, "span", 29, 31);
        $$renderer2.push(`Staff &amp; Instructor Login</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="card-body">`);
        push_element($$renderer2, "div", 30, 8);
        LoginForm($$renderer2, { next: `/${stringify(data.lab?.slug)}` });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> `);
      if (data.lab) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="card mt2">`);
        push_element($$renderer2, "div", 34, 6);
        $$renderer2.push(`<div class="card-body">`);
        push_element($$renderer2, "div", 35, 8);
        $$renderer2.push(`<p style="font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--c-text-2);margin-bottom:0.25rem">`);
        push_element($$renderer2, "p", 36, 10);
        $$renderer2.push(`Lab</p>`);
        pop_element();
        $$renderer2.push(` <p style="font-weight:600;margin:0 0 0.25rem">`);
        push_element($$renderer2, "p", 37, 10);
        $$renderer2.push(`${escape_html(data.lab.name)}</p>`);
        pop_element();
        $$renderer2.push(` `);
        if (data.lab.room) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p style="font-size:0.85rem;color:var(--c-text-2);margin:0 0 0.15rem">`);
          push_element($$renderer2, "p", 38, 29);
          $$renderer2.push(`📍 ${escape_html(data.lab.room)}</p>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (data.coordinator) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p style="font-size:0.85rem;color:var(--c-text-2);margin:0 0 0.15rem">`);
          push_element($$renderer2, "p", 40, 12);
          $$renderer2.push(`👤 ${escape_html(data.coordinator.name)}</p>`);
          pop_element();
          $$renderer2.push(` <p style="font-size:0.85rem;color:var(--c-text-2);margin:0">`);
          push_element($$renderer2, "p", 41, 12);
          $$renderer2.push(`✉️ ${escape_html(data.coordinator.email)}</p>`);
          pop_element();
        } else if (data.lab.contact_email) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<p style="font-size:0.85rem;color:var(--c-text-2);margin:0">`);
          push_element($$renderer2, "p", 43, 12);
          $$renderer2.push(`✉️ ${escape_html(data.lab.contact_email)}</p>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></aside>`);
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
//# sourceMappingURL=_page.svelte-xcrpFXYq.js.map
