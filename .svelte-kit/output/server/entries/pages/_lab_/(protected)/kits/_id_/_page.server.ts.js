import { redirect } from "@sveltejs/kit";
import { a as readDb } from "../../../../../../chunks/db.js";
const load = async ({ parent, params }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const kit = readDb(labId, "kits.json").find((k) => k.id === params.id && !k.deleted_at);
  if (!kit) throw redirect(302, `/${params.lab}/kits`);
  const items = readDb(labId, "items.json");
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.name]));
  const canEdit = ["admin", "manager"].includes(membership.role);
  return { kit, itemMap, labId, labSlug: params.lab, canEdit };
};
export {
  load
};
