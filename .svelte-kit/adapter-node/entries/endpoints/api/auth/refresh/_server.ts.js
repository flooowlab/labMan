import { w as withAuth, o as ok } from "../../../../../chunks/middleware.js";
import { a as readDb } from "../../../../../chunks/db.js";
import { s as signToken, c as cookieOptions } from "../../../../../chunks/auth.js";
const POST = withAuth(async (ctx, user) => {
  const memberships = readDb("_global", "lab_memberships.json");
  const labs = readDb("_global", "labs.json");
  const userMemberships = memberships.filter((m) => m.user_id === user.user_id && m.is_active);
  const membershipTokens = userMemberships.map((m) => {
    const lab = labs.find((l) => l.id === m.lab_id);
    return {
      lab_id: m.lab_id,
      lab_slug: lab?.slug ?? m.lab_id,
      role: m.role,
      user_type: m.user_type
    };
  });
  const token = await signToken({
    user_id: user.user_id,
    email: user.email,
    memberships: membershipTokens,
    totp_verified: user.totp_verified,
    partial: false
  });
  ctx.cookies.set("token", token, cookieOptions(28800));
  return ok({ ok: true, memberships: membershipTokens });
});
export {
  POST
};
