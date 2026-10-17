import { a as readDb } from "../../../../../chunks/db.js";
const load = async ({ parent, url }) => {
  const { lab, user: authUser, membership } = await parent();
  const labId = lab.id;
  const role = membership.role;
  const allBorrows = readDb(labId, "borrows.json");
  const users = readDb("_global", "users.json");
  const statusFilter = url.searchParams.get("status") ?? "";
  const visible = ["student", "viewer"].includes(role) ? allBorrows.filter((b) => b.user_id === authUser.user_id) : allBorrows;
  const filtered = statusFilter ? visible.filter((b) => b.status === statusFilter) : visible;
  const sorted = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name ?? u.id.slice(0, 8)]));
  return { borrows: sorted, userMap, statusFilter, canCreate: ["admin", "manager", "technician"].includes(role) };
};
export {
  load
};
