import { redirect } from "@sveltejs/kit";
import { a as readDb } from "../../../../../../chunks/db.js";
const load = async ({ parent, params }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab.id;
  const res = readDb(labId, "reservations.json").find((r) => r.id === params.id);
  if (!res) throw redirect(302, `/${params.lab}/reservations`);
  const isSelf = res.user_id === authUser.user_id;
  const isPrivileged = ["admin", "manager", "instructor"].includes(membership.role);
  if (!isSelf && !isPrivileged && ["student", "viewer"].includes(membership.role)) {
    throw redirect(302, `/${params.lab}/reservations`);
  }
  const users = readDb("_global", "users.json");
  const items = readDb(labId, "items.json");
  const requester = users.find((u) => u.id === res.user_id);
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.name]));
  const canApproveInstructor = membership.role === "instructor" && res.status === "pending_instructor";
  const canApproveManager = ["admin", "manager"].includes(membership.role) && res.status === "pending_manager";
  const canConvert = ["admin", "manager", "technician"].includes(membership.role) && res.status === "approved";
  return { res, requester: requester ? { name: requester.name, email: requester.email } : null, itemMap, canApproveInstructor, canApproveManager, canConvert, labId };
};
export {
  load
};
