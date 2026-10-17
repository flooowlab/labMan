import { redirect } from "@sveltejs/kit";
import { a as readDb } from "../../../../../chunks/db.js";
import { v as verifyToken } from "../../../../../chunks/auth.js";
const load = async ({ params, cookies }) => {
  const labs = readDb("_global", "labs.json");
  const lab = labs.find((l) => l.slug === params.lab);
  if (!lab) throw redirect(302, "/");
  const item = readDb(lab.id, "items.json").find((i) => i.id === params.id && !i.deleted_at);
  if (!item) throw redirect(302, `/${params.lab}/catalog`);
  const token = cookies.get("token") ?? null;
  let userMembership = null;
  if (token) {
    try {
      const payload = await verifyToken(token);
      userMembership = payload.memberships.find((m) => m.lab_slug === params.lab) ?? null;
    } catch {
    }
  }
  return { item, lab, token, userMembership };
};
export {
  load
};
