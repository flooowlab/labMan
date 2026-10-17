import { redirect } from "@sveltejs/kit";
import { a as readDb } from "../../../../../../../chunks/db.js";
const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  if (!["admin", "manager", "technician"].includes(membership.role)) throw redirect(302, `/${params.lab}/inventory/${params.id}`);
  const labId = lab.id;
  const item = readDb(labId, "items.json").find((i) => i.id === params.id && !i.deleted_at);
  if (!item) throw redirect(302, `/${params.lab}/inventory`);
  const locations = readDb(labId, "locations.json");
  return { item, locations, labId, labSlug: params.lab };
};
export {
  load
};
