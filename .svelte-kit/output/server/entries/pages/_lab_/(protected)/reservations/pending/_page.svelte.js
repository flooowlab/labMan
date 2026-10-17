import { F as head, y as ensure_array_like, z as escape_html, u as attr_class, w as clsx, t as attr, K as stringify } from "../../../../../../chunks/renderer.js";
import { f as fmtDate, s as statusClass } from "../../../../../../chunks/utils2.js";
import { a as push_element, p as pop_element } from "../../../../../../chunks/dev2.js";
import { F as FILENAME } from "../../../../../../chunks/constants.js";
_page[FILENAME] = "src/routes/[lab]/(protected)/reservations/pending/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("1cl2lxq", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Pending Approvals — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 9, 16);
      $$renderer2.push(`Pending Approvals</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (data.pending.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="card">`);
        push_element($$renderer2, "div", 12, 2);
        $$renderer2.push(`<p class="empty-msg">`);
        push_element($$renderer2, "p", 12, 20);
        $$renderer2.push(`No pending reservations.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="card">`);
        push_element($$renderer2, "div", 14, 2);
        $$renderer2.push(`<div class="table-wrap">`);
        push_element($$renderer2, "div", 15, 4);
        $$renderer2.push(`<table>`);
        push_element($$renderer2, "table", 16, 6);
        $$renderer2.push(`<thead>`);
        push_element($$renderer2, "thead", 17, 8);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 17, 15);
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 17, 19);
        $$renderer2.push(`Requester</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 17, 37);
        $$renderer2.push(`Start</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 17, 51);
        $$renderer2.push(`Purpose</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 17, 67);
        $$renderer2.push(`Status</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 17, 82);
        $$renderer2.push(`</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 18, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(data.pending);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let r = each_array[$$index];
          $$renderer2.push(`<tr>`);
          push_element($$renderer2, "tr", 20, 12);
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 21, 14);
          $$renderer2.push(`${escape_html(data.userMap[r.user_id] ?? r.user_id.slice(0, 8))}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm">`);
          push_element($$renderer2, "td", 22, 14);
          $$renderer2.push(`${escape_html(fmtDate(r.start_at))}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm text-muted">`);
          push_element($$renderer2, "td", 23, 14);
          $$renderer2.push(`${escape_html(r.purpose?.slice(0, 60))}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 24, 14);
          $$renderer2.push(`<span${attr_class(clsx(statusClass(r.status)))}>`);
          push_element($$renderer2, "span", 24, 18);
          $$renderer2.push(`${escape_html(r.status.replace(/_/g, " "))}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 25, 14);
          $$renderer2.push(`<a${attr("href", `../reservations/${stringify(r.id)}`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 25, 18);
          $$renderer2.push(`Review</a>`);
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
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
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
