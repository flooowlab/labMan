import { a6 as head, a0 as escape_html, K as attr, _ as ensure_array_like, ap as stringify, Z as derived } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';
import { F as FILENAME } from './constants-Bty0yJru.js';

BorrowForm[FILENAME] = "src/components/BorrowForm.svelte";
function BorrowForm($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        labId,
        labSlug,
        usersData = [],
        itemsData = [],
        instructors = [],
        initialLines = [],
        kitId
      } = $$props;
      let rfid = "";
      let nameSearch = "";
      let barcode = "";
      let lines = initialLines;
      let browseCategory = "";
      let browseSearch = "";
      const _defaultDue = () => {
        const d = /* @__PURE__ */ new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().slice(0, 10);
      };
      let dueDate = _defaultDue();
      let notes = "";
      let instructorId = "";
      const selectedUser = derived(() => null);
      const isStudent = derived(() => selectedUser()?.user_type === "student");
      const categories = derived(() => [...new Set(itemsData.map((i) => i.category))].sort());
      const browseItems = derived(() => itemsData.filter((i) => {
        return true;
      }));
      $$renderer2.push(`<form>`);
      push_element($$renderer2, "form", 96, 0);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <fieldset style="border:none;margin-bottom:1.5rem;padding:0">`);
      push_element($$renderer2, "fieldset", 100, 2);
      $$renderer2.push(`<legend style="font-weight:600;margin-bottom:.75rem;font-size:.875rem;border-bottom:1px solid var(--c-border);padding-bottom:.5rem;width:100%;display:block">`);
      push_element($$renderer2, "legend", 101, 4);
      $$renderer2.push(`Borrower</legend>`);
      pop_element();
      $$renderer2.push(` <div style="position:relative;margin-bottom:.75rem">`);
      push_element($$renderer2, "div", 102, 4);
      $$renderer2.push(`<label class="form-label text-sm">`);
      push_element($$renderer2, "label", 103, 6);
      $$renderer2.push(`Search by name or email</label>`);
      pop_element();
      $$renderer2.push(` <input class="input-field" style="margin-top:.25rem"${attr("value", nameSearch)} placeholder="Type to search users…"/>`);
      push_element($$renderer2, "input", 104, 6);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div style="text-align:center;color:var(--c-text-2);font-size:.8rem;margin:.5rem 0;border-bottom:1px solid var(--c-border);line-height:0">`);
      push_element($$renderer2, "div", 115, 4);
      $$renderer2.push(`<span style="background:var(--c-surface);padding:0 .5rem">`);
      push_element($$renderer2, "span", 115, 142);
      $$renderer2.push(`or look up by RFID</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div style="display:flex;gap:.5rem;align-items:flex-end;margin-top:.75rem">`);
      push_element($$renderer2, "div", 116, 4);
      $$renderer2.push(`<div style="flex:1">`);
      push_element($$renderer2, "div", 117, 6);
      $$renderer2.push(`<label class="form-label text-sm" for="rfid-input">`);
      push_element($$renderer2, "label", 118, 8);
      $$renderer2.push(`RFID Tag</label>`);
      pop_element();
      $$renderer2.push(` <input id="rfid-input" class="input-field"${attr("value", rfid)} placeholder="Tap card or type tag…"/>`);
      push_element($$renderer2, "input", 119, 8);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <button type="button" class="btn btn-secondary btn-sm">`);
      push_element($$renderer2, "button", 121, 6);
      $$renderer2.push(`Look up</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (isStudent() && instructors.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div style="margin-top:.75rem">`);
        push_element($$renderer2, "div", 129, 6);
        $$renderer2.push(`<label class="form-label text-sm">`);
        push_element($$renderer2, "label", 130, 8);
        $$renderer2.push(`Authorizing Instructor <span style="color:var(--c-danger)">`);
        push_element($$renderer2, "span", 130, 65);
        $$renderer2.push(`*</span>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
        $$renderer2.push(` `);
        $$renderer2.select(
          {
            class: "input-field",
            value: instructorId,
            style: "margin-top:.25rem"
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "" }, ($$renderer4) => {
              push_element($$renderer4, "option", 132, 10);
              $$renderer4.push(`— select instructor —`);
              pop_element();
            });
            $$renderer3.push(`<!--[-->`);
            const each_array_1 = ensure_array_like(instructors);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let ins = each_array_1[$$index_1];
              $$renderer3.option({ value: ins.id }, ($$renderer4) => {
                push_element($$renderer4, "option", 134, 12);
                $$renderer4.push(`${escape_html(ins.name)} (${escape_html(ins.role)})`);
                pop_element();
              });
            }
            $$renderer3.push(`<!--]-->`);
          }
        );
        $$renderer2.push(` <p style="font-size:.75rem;color:var(--c-text-2);margin:.25rem 0 0">`);
        push_element($$renderer2, "p", 137, 8);
        $$renderer2.push(`Student borrows require an instructor's authorisation.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></fieldset>`);
      pop_element();
      $$renderer2.push(` <fieldset style="border:none;margin-bottom:1.5rem;padding:0">`);
      push_element($$renderer2, "fieldset", 143, 2);
      $$renderer2.push(`<legend style="font-weight:600;margin-bottom:.75rem;font-size:.875rem;border-bottom:1px solid var(--c-border);padding-bottom:.5rem;width:100%;display:block">`);
      push_element($$renderer2, "legend", 144, 4);
      $$renderer2.push(`Items</legend>`);
      pop_element();
      $$renderer2.push(` <div style="display:flex;gap:.5rem;margin-bottom:.75rem">`);
      push_element($$renderer2, "div", 145, 4);
      $$renderer2.push(`<input class="input-field" style="flex:1"${attr("value", barcode)} placeholder="Scan or type barcode…"/>`);
      push_element($$renderer2, "input", 146, 6);
      pop_element();
      $$renderer2.push(` <button type="button" class="btn btn-secondary btn-sm">`);
      push_element($$renderer2, "button", 147, 6);
      $$renderer2.push(`Add</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div style="display:flex;gap:.5rem;margin-bottom:.5rem">`);
      push_element($$renderer2, "div", 149, 4);
      $$renderer2.select({ class: "input-field", value: browseCategory, style: "flex:1" }, ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          push_element($$renderer4, "option", 151, 8);
          $$renderer4.push(`All categories`);
          pop_element();
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(categories());
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let cat = each_array_2[$$index_2];
          $$renderer3.option({ value: cat }, ($$renderer4) => {
            push_element($$renderer4, "option", 152, 33);
            $$renderer4.push(`${escape_html(cat)}`);
            pop_element();
          });
        }
        $$renderer3.push(`<!--]-->`);
      });
      $$renderer2.push(` <input class="input-field" style="flex:1"${attr("value", browseSearch)} placeholder="Browse by name…"/>`);
      push_element($$renderer2, "input", 154, 6);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div style="max-height:180px;overflow-y:auto;border:1px solid var(--c-border);margin-bottom:.75rem">`);
      push_element($$renderer2, "div", 156, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array_3 = ensure_array_like(browseItems().slice(0, 30));
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let item = each_array_3[$$index_3];
        $$renderer2.push(`<button type="button" style="display:block;width:100%;text-align:left;padding:.5rem .75rem;background:none;border:none;border-bottom:1px solid var(--c-border);cursor:pointer;font-size:.875rem">`);
        push_element($$renderer2, "button", 158, 8);
        $$renderer2.push(`<strong>`);
        push_element($$renderer2, "strong", 159, 10);
        $$renderer2.push(`${escape_html(item.name)}</strong>`);
        pop_element();
        $$renderer2.push(`<span style="color:var(--c-text-2);margin-left:.5rem;font-size:.8rem">`);
        push_element($$renderer2, "span", 159, 38);
        $$renderer2.push(`${escape_html(item.category)}</span>`);
        pop_element();
        $$renderer2.push(` `);
        if (item.tracking_mode === "bulk") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span style="color:var(--c-text-2);margin-left:.25rem">`);
          push_element($$renderer2, "span", 160, 45);
          $$renderer2.push(`(qty: ${escape_html(item.quantity_available)})</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (lines.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<table style="width:100%;font-size:.875rem">`);
        push_element($$renderer2, "table", 165, 6);
        $$renderer2.push(`<thead>`);
        push_element($$renderer2, "thead", 166, 8);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 166, 15);
        $$renderer2.push(`<th style="text-align:left">`);
        push_element($$renderer2, "th", 166, 19);
        $$renderer2.push(`Item</th>`);
        pop_element();
        $$renderer2.push(`<th style="text-align:right">`);
        push_element($$renderer2, "th", 166, 56);
        $$renderer2.push(`Qty</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 166, 93);
        $$renderer2.push(`</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 167, 8);
        $$renderer2.push(`<!--[-->`);
        const each_array_4 = ensure_array_like(lines);
        for (let idx = 0, $$length = each_array_4.length; idx < $$length; idx++) {
          let l = each_array_4[idx];
          $$renderer2.push(`<tr>`);
          push_element($$renderer2, "tr", 169, 12);
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 170, 14);
          $$renderer2.push(`${escape_html(l.label)}`);
          if (l.unit_id) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="badge badge-gray">`);
            push_element($$renderer2, "span", 170, 43);
            $$renderer2.push(`unit</span>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></td>`);
          pop_element();
          $$renderer2.push(`<td style="text-align:right">`);
          push_element($$renderer2, "td", 171, 14);
          $$renderer2.push(`<input type="number" min="1"${attr("value", l.quantity)} style="width:60px;text-align:right"/>`);
          push_element($$renderer2, "input", 171, 43);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 172, 14);
          $$renderer2.push(`<button type="button" class="btn btn-ghost btn-sm">`);
          push_element($$renderer2, "button", 172, 18);
          $$renderer2.push(`✕</button>`);
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
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></fieldset>`);
      pop_element();
      $$renderer2.push(` <fieldset style="border:none;margin-bottom:1.5rem;padding:0">`);
      push_element($$renderer2, "fieldset", 181, 2);
      $$renderer2.push(`<legend style="font-weight:600;margin-bottom:.75rem;font-size:.875rem;border-bottom:1px solid var(--c-border);padding-bottom:.5rem;width:100%;display:block">`);
      push_element($$renderer2, "legend", 182, 4);
      $$renderer2.push(`Schedule</legend>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 183, 4);
      $$renderer2.push(`<label class="form-label text-sm" for="due_date">`);
      push_element($$renderer2, "label", 184, 6);
      $$renderer2.push(`Due Date *</label>`);
      pop_element();
      $$renderer2.push(` <input id="due_date" type="date" class="input-field"${attr("value", dueDate)} required=""/>`);
      push_element($$renderer2, "input", 185, 6);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="form-group">`);
      push_element($$renderer2, "div", 187, 4);
      $$renderer2.push(`<label class="form-label text-sm" for="notes">`);
      push_element($$renderer2, "label", 188, 6);
      $$renderer2.push(`Notes</label>`);
      pop_element();
      $$renderer2.push(` <textarea id="notes" class="input-field" rows="2">`);
      push_element($$renderer2, "textarea", 189, 6);
      const $$body = escape_html(notes);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</fieldset>`);
      pop_element();
      $$renderer2.push(` <div class="form-actions">`);
      push_element($$renderer2, "div", 193, 2);
      $$renderer2.push(`<a${attr("href", `/${stringify(labSlug)}/borrows`)} class="btn btn-ghost">`);
      push_element($$renderer2, "a", 194, 4);
      $$renderer2.push(`Cancel</a>`);
      pop_element();
      $$renderer2.push(` <button type="submit" class="btn btn-primary"${attr("disabled", true, true)}>`);
      push_element($$renderer2, "button", 195, 4);
      $$renderer2.push(`${escape_html("Create Borrow")}</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</form>`);
      pop_element();
    },
    BorrowForm
  );
}
BorrowForm.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/[lab]/(protected)/borrows/new/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("1adpdzm", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>New Borrow — Lab Manager</title>`);
        });
      });
      $$renderer2.push(`<div class="ph">`);
      push_element($$renderer2, "div", 9, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 10, 2);
      $$renderer2.push(`<h1 class="ph-title">`);
      push_element($$renderer2, "h1", 11, 4);
      $$renderer2.push(`New Borrow${escape_html(data.kitName ? ` — ${data.kitName}` : "")}</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <a href="../borrows" class="btn btn-ghost btn-sm">`);
      push_element($$renderer2, "a", 13, 2);
      $$renderer2.push(`← Back</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="card">`);
      push_element($$renderer2, "div", 15, 0);
      $$renderer2.push(`<div class="card-body">`);
      push_element($$renderer2, "div", 16, 2);
      BorrowForm($$renderer2, {
        labId: data.labId,
        labSlug: data.labSlug,
        usersData: data.usersData,
        itemsData: data.itemsData,
        instructors: data.instructors,
        initialLines: data.initialLines,
        kitId: data.kitId ?? void 0
      });
      $$renderer2.push(`<!----></div>`);
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
//# sourceMappingURL=_page.svelte-lLLpDehb.js.map
