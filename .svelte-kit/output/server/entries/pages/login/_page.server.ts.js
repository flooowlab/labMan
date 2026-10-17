import { redirect } from "@sveltejs/kit";
import { v as verifyToken } from "../../../chunks/auth.js";
const load = async ({ cookies, url }) => {
  const tok = cookies.get("token");
  if (tok) {
    try {
      const p = await verifyToken(tok);
      if (!p.partial) throw redirect(302, "/");
    } catch (e) {
      if (e?.status === 302) throw e;
    }
  }
  return { next: url.searchParams.get("next") ?? "/" };
};
export {
  load
};
