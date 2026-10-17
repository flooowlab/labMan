import { a as readDb } from "../../../../chunks/db.js";
import { v as verifyToken } from "../../../../chunks/auth.js";
const load = async ({ params, cookies }) => {
  const labs = readDb("_global", "labs.json");
  const lab = labs.find((l) => l.slug === params.lab);
  if (!lab) return { items: [], lab: null, token: null, userRole: null, coordinator: null };
  const items = readDb(lab.id, "items.json").filter((i) => !i.deleted_at);
  const token = cookies.get("token") ?? null;
  let userRole = null;
  if (token) {
    try {
      const payload = await verifyToken(token);
      userRole = payload.memberships.find((m) => m.lab_slug === params.lab)?.role ?? null;
    } catch {
    }
  }
  const memberships = readDb("_global", "lab_memberships.json").filter((m) => m.lab_id === lab.id && m.is_active && ["admin", "manager"].includes(m.role));
  const users = readDb("_global", "users.json");
  const coordMember = memberships.sort((a, b) => a.role === "admin" ? -1 : 1)[0];
  const coordUser = coordMember ? users.find((u) => u.id === coordMember.user_id && !u.redacted_at) : null;
  const coordinator = coordUser ? { name: coordUser.name, email: coordUser.email } : null;
  return { items, lab, token, userRole, coordinator };
};
export {
  load
};
