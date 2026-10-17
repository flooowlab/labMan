import { redirect } from "@sveltejs/kit";
import { a as readDb } from "../../../../../../chunks/db.js";
const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  if (!["admin", "manager"].includes(membership.role)) throw redirect(302, `/${params.lab}/inventory`);
  const locations = readDb(lab.id, "locations.json");
  return { labId: lab.id, labSlug: params.lab, locations };
};
export {
  load
};
