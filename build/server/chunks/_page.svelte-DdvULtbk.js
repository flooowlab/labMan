import { a6 as head, a0 as escape_html, _ as ensure_array_like, K as attr, ap as stringify } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

_page[FILENAME] = "src/routes/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("1uha8ag", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div style="display:flex;min-height:100vh;align-items:center;justify-content:center;background:var(--c-bg)">`);
      push_element($$renderer2, "div", 8, 0);
      $$renderer2.push(`<div style="width:100%;max-width:520px;padding:2rem">`);
      push_element($$renderer2, "div", 9, 2);
      $$renderer2.push(`<h1 style="font-size:1.5rem;font-weight:300;margin-bottom:0.25rem">`);
      push_element($$renderer2, "h1", 10, 4);
      $$renderer2.push(`Lab Manager</h1>`);
      pop_element();
      $$renderer2.push(` <p style="color:var(--c-text-2);font-size:var(--text-sm);margin-bottom:2rem">`);
      push_element($$renderer2, "p", 11, 4);
      $$renderer2.push(`${escape_html(data.loggedInUser ? "Select a lab to manage." : "Browse equipment catalogs or sign in to manage equipment.")}</p>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.labs.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p style="color:var(--c-text-2)">`);
        push_element($$renderer2, "p", 16, 6);
        $$renderer2.push(`No active labs configured. Contact your system administrator.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <ul style="list-style:none;display:flex;flex-direction:column;gap:1px;background:var(--c-border);border:1px solid var(--c-border);padding:0;margin:0">`);
      push_element($$renderer2, "ul", 19, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.labs);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let lab = each_array[$$index];
        const memberRole = data.loggedInUser?.memberships.find((x) => x.lab_id === lab.id)?.role;
        $$renderer2.push(`<li>`);
        push_element($$renderer2, "li", 22, 8);
        $$renderer2.push(`<div style="display:flex;background:var(--c-surface);padding:1rem 1.25rem;align-items:center;gap:1rem">`);
        push_element($$renderer2, "div", 23, 10);
        $$renderer2.push(`<div style="flex:1;min-width:0">`);
        push_element($$renderer2, "div", 24, 12);
        $$renderer2.push(`<div style="font-weight:600">`);
        push_element($$renderer2, "div", 25, 14);
        $$renderer2.push(`${escape_html(lab.name)}</div>`);
        pop_element();
        $$renderer2.push(` `);
        if (lab.room) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div style="font-size:var(--text-xs);color:var(--c-text-2)">`);
          push_element($$renderer2, "div", 26, 28);
          $$renderer2.push(`Room ${escape_html(lab.room)}</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` `);
        if (memberRole) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge badge-gray">`);
          push_element($$renderer2, "span", 28, 28);
          $$renderer2.push(`${escape_html(memberRole)}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div style="display:flex;gap:0.5rem;flex-shrink:0">`);
        push_element($$renderer2, "div", 29, 12);
        $$renderer2.push(`<a${attr("href", `/${stringify(lab.slug)}/catalog`)} style="font-size:var(--text-xs);color:var(--c-brand)">`);
        push_element($$renderer2, "a", 30, 14);
        $$renderer2.push(`Catalog →</a>`);
        pop_element();
        $$renderer2.push(` `);
        if (memberRole) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `/${stringify(lab.slug)}/`)} style="font-size:var(--text-xs);color:var(--c-brand)">`);
          push_element($$renderer2, "a", 32, 16);
          $$renderer2.push(`Dashboard →</a>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</li>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></ul>`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-DdvULtbk.js.map
