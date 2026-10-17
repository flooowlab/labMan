import { F as head, z as escape_html, u as attr_class, w as clsx, y as ensure_array_like, x as derived } from "../../../../../../chunks/renderer.js";
import { s as statusClass, f as fmtDate } from "../../../../../../chunks/utils2.js";
import { a as push_element, p as pop_element } from "../../../../../../chunks/dev2.js";
import { F as FILENAME } from "../../../../../../chunks/constants.js";
_page[FILENAME] = "src/routes/[lab]/(protected)/reservations/[id]/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const r = derived(() => data.res);
      head("inmfrm", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Reservation — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 10, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 11, 2);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 12, 4);
      $$renderer2.push(`Reservation</h1>`);
      pop_element();
      $$renderer2.push(` <p class="ph-sub">`);
      push_element($$renderer2, "p", 13, 4);
      $$renderer2.push(`${escape_html(data.requester?.name ?? r().user_id)}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex-gap">`);
      push_element($$renderer2, "div", 15, 2);
      if (data.canApproveInstructor) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn btn-primary btn-sm">`);
        push_element($$renderer2, "button", 17, 6);
        $$renderer2.push(`Approve (Instructor)</button>`);
        pop_element();
        $$renderer2.push(` <button class="btn btn-ghost btn-sm">`);
        push_element($$renderer2, "button", 18, 6);
        $$renderer2.push(`Reject</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.canApproveManager) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn btn-primary btn-sm">`);
        push_element($$renderer2, "button", 21, 6);
        $$renderer2.push(`Approve (Manager)</button>`);
        pop_element();
        $$renderer2.push(` <button class="btn btn-ghost btn-sm">`);
        push_element($$renderer2, "button", 22, 6);
        $$renderer2.push(`Reject</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.canConvert) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn btn-secondary btn-sm">`);
        push_element($$renderer2, "button", 25, 6);
        $$renderer2.push(`Convert to Borrow</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <a href="../reservations" class="btn btn-ghost btn-sm">`);
      push_element($$renderer2, "a", 27, 4);
      $$renderer2.push(`← Back</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="tiles mb2">`);
      push_element($$renderer2, "div", 31, 0);
      $$renderer2.push(`<div class="tile">`);
      push_element($$renderer2, "div", 32, 2);
      $$renderer2.push(`<div class="tile-label">`);
      push_element($$renderer2, "div", 32, 20);
      $$renderer2.push(`Status</div>`);
      pop_element();
      $$renderer2.push(`<div class="tile-val">`);
      push_element($$renderer2, "div", 32, 56);
      $$renderer2.push(`<span${attr_class(clsx(statusClass(r().status)))}>`);
      push_element($$renderer2, "span", 32, 78);
      $$renderer2.push(`${escape_html(r().status.replace(/_/g, " "))}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="tile">`);
      push_element($$renderer2, "div", 33, 2);
      $$renderer2.push(`<div class="tile-label">`);
      push_element($$renderer2, "div", 33, 20);
      $$renderer2.push(`Start</div>`);
      pop_element();
      $$renderer2.push(`<div class="tile-val" style="font-size:1rem">`);
      push_element($$renderer2, "div", 33, 55);
      $$renderer2.push(`${escape_html(fmtDate(r().start_at))}</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="tile">`);
      push_element($$renderer2, "div", 34, 2);
      $$renderer2.push(`<div class="tile-label">`);
      push_element($$renderer2, "div", 34, 20);
      $$renderer2.push(`End</div>`);
      pop_element();
      $$renderer2.push(`<div class="tile-val" style="font-size:1rem">`);
      push_element($$renderer2, "div", 34, 53);
      $$renderer2.push(`${escape_html(fmtDate(r().end_at))}</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="card mb2">`);
      push_element($$renderer2, "div", 37, 0);
      $$renderer2.push(`<div class="card-head">`);
      push_element($$renderer2, "div", 38, 2);
      $$renderer2.push(`<span class="card-title">`);
      push_element($$renderer2, "span", 38, 25);
      $$renderer2.push(`Items Requested</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="table-wrap">`);
      push_element($$renderer2, "div", 39, 2);
      $$renderer2.push(`<table>`);
      push_element($$renderer2, "table", 40, 4);
      $$renderer2.push(`<thead>`);
      push_element($$renderer2, "thead", 41, 6);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 41, 13);
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 41, 17);
      $$renderer2.push(`Item</th>`);
      pop_element();
      $$renderer2.push(`<th>`);
      push_element($$renderer2, "th", 41, 30);
      $$renderer2.push(`Quantity</th>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</thead>`);
      pop_element();
      $$renderer2.push(`<tbody>`);
      push_element($$renderer2, "tbody", 42, 6);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(r().lines);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let l = each_array[$$index];
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 44, 10);
        $$renderer2.push(`<td>`);
        push_element($$renderer2, "td", 45, 12);
        $$renderer2.push(`${escape_html(data.itemMap[l.item_id] ?? l.item_id)}</td>`);
        pop_element();
        $$renderer2.push(`<td>`);
        push_element($$renderer2, "td", 46, 12);
        $$renderer2.push(`${escape_html(l.quantity)}</td>`);
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
      $$renderer2.push(` `);
      if (r().purpose) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="card">`);
        push_element($$renderer2, "div", 55, 2);
        $$renderer2.push(`<div class="card-head">`);
        push_element($$renderer2, "div", 55, 20);
        $$renderer2.push(`<span class="card-title">`);
        push_element($$renderer2, "span", 55, 43);
        $$renderer2.push(`Purpose</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`<div class="card-body text-sm">`);
        push_element($$renderer2, "div", 55, 88);
        $$renderer2.push(`${escape_html(r().purpose)}</div>`);
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
