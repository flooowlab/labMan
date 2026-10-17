import bcrypt from "bcryptjs";
import { a as readDb } from "../../../../../chunks/db.js";
import { p as parseBody, e as LoginSchema } from "../../../../../chunks/validate.js";
import { s as signToken, c as cookieOptions } from "../../../../../chunks/auth.js";
import { e as err, o as ok } from "../../../../../chunks/middleware.js";
import { d as decryptSecret, v as verifyTotp } from "../../../../../chunks/totp.js";
const buckets = /* @__PURE__ */ new Map();
function rateLimit(key, maxPerMinute) {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: maxPerMinute, last: now };
  b.tokens = Math.min(
    maxPerMinute,
    b.tokens + (now - b.last) / 6e4 * maxPerMinute
  );
  b.last = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}
const POST = async (ctx) => {
  if (!rateLimit(`login:${ctx.getClientAddress()}`, 5)) {
    return err(429, "Too many login attempts. Try again later.");
  }
  const parsed = await parseBody(ctx.request, LoginSchema);
  if ("error" in parsed) return parsed.error;
  const { email, password, totp_token } = parsed.data;
  const users = readDb("_global", "users.json");
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && !u.redacted_at
  );
  if (!user || !user.is_active) return err(401, "Invalid credentials");
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return err(401, "Invalid credentials");
  const memberships = readDb("_global", "lab_memberships.json");
  const labs = readDb("_global", "labs.json");
  const userMemberships = memberships.filter((m) => m.user_id === user.id && m.is_active);
  const membershipTokens = userMemberships.map((m) => {
    const lab = labs.find((l) => l.id === m.lab_id);
    return {
      lab_id: m.lab_id,
      lab_slug: lab?.slug ?? m.lab_id,
      role: m.role,
      user_type: m.user_type
    };
  });
  const isAdmin = userMemberships.some((m) => m.role === "admin");
  if (process.env.LAB_REQUIRE_2FA_ADMIN === "true" && isAdmin && !user.totp_enabled) {
    return err(403, "Admin accounts must enroll in TOTP 2FA before logging in");
  }
  if (user.totp_enabled) {
    if (!totp_token) {
      const partial = await signToken({
        user_id: user.id,
        email: user.email,
        memberships: membershipTokens,
        totp_verified: false,
        partial: true
      });
      ctx.cookies.set("token", partial, cookieOptions(300));
      return ok({ totp_required: true });
    }
    const secret = decryptSecret(user.totp_secret_enc);
    if (!verifyTotp(secret, totp_token)) return err(401, "Invalid TOTP code");
  }
  const token = await signToken({
    user_id: user.id,
    email: user.email,
    memberships: membershipTokens,
    totp_verified: user.totp_enabled,
    partial: false
  });
  ctx.cookies.set("token", token, cookieOptions(28800));
  return ok({
    user: { id: user.id, name: user.name, email: user.email, totp_enabled: user.totp_enabled },
    memberships: membershipTokens
  });
};
export {
  POST
};
