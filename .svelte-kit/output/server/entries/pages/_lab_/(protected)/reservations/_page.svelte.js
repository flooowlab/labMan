import { F as head, u as attr_class, y as ensure_array_like, t as attr, z as escape_html, w as clsx, K as stringify } from "../../../../../chunks/renderer.js";
import { f as fmtDate, s as statusClass } from "../../../../../chunks/utils2.js";
import { a as push_element, p as pop_element } from "../../../../../chunks/dev2.js";
import { F as FILENAME } from "../../../../../chunks/constants.js";
_page[FILENAME] = "src/routes/[lab]/(protected)/reservations/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const STATUSES = [
        "pending_instructor",
        "pending_manager",
        "approved",
        "active",
        "completed",
        "cancelled"
      ];
      head("6hjway", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Reservations — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 10, 0);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 11, 2);
      $$renderer2.push(`Reservations</h1>`);
      pop_element();
      $$renderer2.push(` <a href="reservations/new" class="btn btn-primary">`);
      push_element($$renderer2, "a", 12, 2);
      $$renderer2.push(`New Reservation</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex-gap mb2">`);
      push_element($$renderer2, "div", 15, 0);
      $$renderer2.push(`<a href="?"${attr_class(`btn btn-sm ${!data.statusFilter ? "btn-primary" : "btn-ghost"}`)}>`);
      push_element($$renderer2, "a", 16, 2);
      $$renderer2.push(`All</a>`);
      pop_element();
      $$renderer2.push(` <!--[-->`);
      const each_array = ensure_array_like(STATUSES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let s = each_array[$$index];
        $$renderer2.push(`<a${attr("href", `?status=${stringify(s)}`)}${attr_class(`btn btn-sm ${data.statusFilter === s ? "btn-primary" : "btn-ghost"}`)}>`);
        push_element($$renderer2, "a", 18, 4);
        $$renderer2.push(`${escape_html(s.replace(/_/g, " "))}</a>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="card">`);
      push_element($$renderer2, "div", 22, 0);
      $$renderer2.push(`<div class="table-wrap">`);
      push_element($$renderer2, "div", 23, 2);
      if (data.reservations.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="empty-msg">`);
        push_element($$renderer2, "p", 25, 6);
        $$renderer2.push(`No reservations found.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<table>`);
        push_element($$renderer2, "table", 27, 6);
        $$renderer2.push(`<thead>`);
        push_element($$renderer2, "thead", 28, 8);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 28, 15);
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 19);
        $$renderer2.push(`Requester</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 37);
        $$renderer2.push(`Start</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 51);
        $$renderer2.push(`End</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 63);
        $$renderer2.push(`Purpose</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 79);
        $$renderer2.push(`Status</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 28, 94);
        $$renderer2.push(`</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 29, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(data.reservations);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let r = each_array_1[$$index_1];
          $$renderer2.push(`<tr>`);
          push_element($$renderer2, "tr", 31, 12);
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 32, 14);
          $$renderer2.push(`${escape_html(data.userMap[r.user_id] ?? r.user_id.slice(0, 8))}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm">`);
          push_element($$renderer2, "td", 33, 14);
          $$renderer2.push(`${escape_html(fmtDate(r.start_at))}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm">`);
          push_element($$renderer2, "td", 34, 14);
          $$renderer2.push(`${escape_html(fmtDate(r.end_at))}</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-sm text-muted">`);
          push_element($$renderer2, "td", 35, 14);
          $$renderer2.push(`${escape_html(r.purpose?.slice(0, 50) ?? "—")}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 36, 14);
          $$renderer2.push(`<span${attr_class(clsx(statusClass(r.status)))}>`);
          push_element($$renderer2, "span", 36, 18);
          $$renderer2.push(`${escape_html(r.status.replace(/_/g, " "))}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 37, 14);
          $$renderer2.push(`<a${attr("href", `reservations/${stringify(r.id)}`)} class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "a", 37, 18);
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
