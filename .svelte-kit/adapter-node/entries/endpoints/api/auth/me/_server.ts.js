import { w as withAuth, e as err, o as ok } from "../../../../../chunks/middleware.js";
import { a as readDb } from "../../../../../chunks/db.js";
const GET = withAuth(async (_ctx, user) => {
  const users = readDb("_global", "users.json");
  const u = users.find((x) => x.id === user.user_id);
  if (!u) return err(404, "User not found");
  return ok({
    id: u.id,
    name: u.name,
    email: u.email,
    rfid_tag: u.rfid_tag,
    totp_enabled: u.totp_enabled,
    must_change_password: u.must_change_password,
    is_active: u.is_active,
    memberships: user.memberships
  });
});
export {
  GET
};
