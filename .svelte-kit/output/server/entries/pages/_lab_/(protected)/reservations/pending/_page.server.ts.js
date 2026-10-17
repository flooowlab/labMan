import { a as readDb } from "../../../../../../chunks/db.js";
const load = async ({ parent }) => {
  const { lab, membership } = await parent();
  const labId = lab.id;
  const canApprove = ["admin", "manager", "instructor"].includes(membership.role);
  const pending = readDb(labId, "reservations.json").filter((r) => ["pending_instructor", "pending_manager"].includes(r.status));
  const users = readDb("_global", "users.json");
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name ?? u.id.slice(0, 8)]));
  return { pending, userMap, canApprove, labId };
};
export {
  load
};
