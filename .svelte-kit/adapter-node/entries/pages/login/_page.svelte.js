import { F as head } from "../../../chunks/renderer.js";
import { L as LoginForm } from "../../../chunks/LoginForm.js";
import { F as FILENAME } from "../../../chunks/constants.js";
_page[FILENAME] = "src/routes/login/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      head("1x05zx6", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Sign In — Lab Manager</title>`);
        });
      });
      LoginForm($$renderer2, { next: data.next });
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
