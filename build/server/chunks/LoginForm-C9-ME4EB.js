import { F as FILENAME } from './constants-Bty0yJru.js';
import { K as attr, a0 as escape_html } from './renderer-BXQYGBEo.js';
import { a as push_element, p as pop_element } from './dev2-C3xAPzzi.js';

LoginForm[FILENAME] = "src/components/LoginForm.svelte";
function LoginForm($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { next = "/" } = $$props;
      let email = "";
      let password = "";
      let loading = false;
      $$renderer2.push(`<div style="text-align:center;margin-bottom:1.25rem">`);
      push_element($$renderer2, "div", 27, 0);
      $$renderer2.push(`<h2 style="font-size:1.25rem;font-weight:700;margin:0 0 0.25rem">`);
      push_element($$renderer2, "h2", 28, 2);
      $$renderer2.push(`Staff &amp; Instructor Login</h2>`);
      pop_element();
      $$renderer2.push(` <p style="font-size:0.85rem;color:var(--c-text-2);margin:0">`);
      push_element($$renderer2, "p", 29, 2);
      $$renderer2.push(`This area is for lab staff and instructors only.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form>`);
      push_element($$renderer2, "form", 34, 0);
      $$renderer2.push(`<div class="field">`);
      push_element($$renderer2, "div", 35, 2);
      $$renderer2.push(`<label for="email">`);
      push_element($$renderer2, "label", 36, 4);
      $$renderer2.push(`Email</label>`);
      pop_element();
      $$renderer2.push(` <input id="email" type="email"${attr("value", email)} required="" autocomplete="email"/>`);
      push_element($$renderer2, "input", 37, 4);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="field">`);
      push_element($$renderer2, "div", 39, 2);
      $$renderer2.push(`<label for="password">`);
      push_element($$renderer2, "label", 40, 4);
      $$renderer2.push(`Password</label>`);
      pop_element();
      $$renderer2.push(` <input id="password" type="password"${attr("value", password)} required="" autocomplete="current-password"/>`);
      push_element($$renderer2, "input", 41, 4);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button class="btn btn-primary" type="submit"${attr("disabled", loading, true)} style="width:100%;justify-content:center">`);
      push_element($$renderer2, "button", 49, 2);
      $$renderer2.push(`${escape_html("Sign in")}</button>`);
      pop_element();
      $$renderer2.push(`</form>`);
      pop_element();
    },
    LoginForm
  );
}
LoginForm.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { LoginForm as L };
//# sourceMappingURL=LoginForm-C9-ME4EB.js.map
