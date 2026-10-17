import { a as readDb } from "../../../../../../chunks/db.js";
const load = async ({ parent, params }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab.id;
  const allItems = readDb(labId, "items.json").filter((i) => !i.deleted_at);
  const allMemberships = readDb("_global", "lab_memberships.json");
  const allUsers = readDb("_global", "users.json");
  const instructors = allMemberships.filter((m) => m.lab_id === labId && m.role === "instructor" && m.is_active).map((m) => allUsers.find((u) => u.id === m.user_id && !u.redacted_at)).filter(Boolean).map((u) => ({ id: u.id, name: u.name ?? "" }));
  return {
    labId,
    labSlug: params.lab,
    userId: authUser.user_id,
    isStudent: membership.role === "student",
    items: allItems.map((i) => ({ id: i.id, name: i.name, category: i.category ?? null })),
    instructors
  };
};
export {
  load
};
