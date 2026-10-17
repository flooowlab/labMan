import { a as readDb } from "../../../../../chunks/db.js";
const load = async ({ parent }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const locations = readDb(labId, "locations.json").filter((l) => !l.deleted_at);
  return { locations, labId, labSlug: lab.slug, role: membership.role };
};
export {
  load
};
