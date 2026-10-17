import { redirect } from "@sveltejs/kit";
import { a as readDb } from "../../chunks/db.js";
import { v as verifyToken } from "../../chunks/auth.js";
const load = async ({ cookies }) => {
  const allLabs = readDb("_global", "labs.json").filter((l) => l.is_active);
  let loggedInUser = null;
  const tok = cookies.get("token");
  if (tok) {
    try {
      const p = await verifyToken(tok);
      if (!p.partial) loggedInUser = p;
    } catch {
    }
  }
  if (loggedInUser) {
    const myLabs = allLabs.filter(
      (l) => loggedInUser.memberships.some((m) => m.lab_id === l.id)
    );
    if (myLabs.length === 1) throw redirect(302, `/${myLabs[0].slug}/`);
  } else {
    if (allLabs.length === 1) throw redirect(302, `/${allLabs[0].slug}/catalog`);
  }
  return { labs: allLabs, loggedInUser };
};
export {
  load
};
