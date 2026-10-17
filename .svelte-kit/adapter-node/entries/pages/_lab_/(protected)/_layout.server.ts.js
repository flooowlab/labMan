import { redirect } from "@sveltejs/kit";
import { v as verifyToken } from "../../../../chunks/auth.js";
import { a as readDb } from "../../../../chunks/db.js";
async function requirePage(token, labSlug) {
  if (!token) return { redirect: "/login" };
  let user;
  try {
    user = await verifyToken(token);
  } catch {
    return { redirect: "/login" };
  }
  if (user.partial) return { redirect: "/login" };
  if (!labSlug) return { user };
  const membership = user.memberships.find((m) => m.lab_slug === labSlug);
  if (!membership) return { redirect: "/" };
  const labs = readDb("_global", "labs.json");
  const lab = labs.find((l) => l.slug === labSlug);
  if (!lab || !lab.is_active) return { redirect: "/" };
  return { user, membership, lab };
}
const load = async ({ params, cookies }) => {
  const auth = await requirePage(cookies.get("token"), params.lab);
  if ("redirect" in auth) throw redirect(302, auth.redirect);
  return auth;
};
export {
  load
};
