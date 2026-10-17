import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { w as withLocks, a as readDb, c as commit } from './db-CfhGAyvN.js';
import { a as generateSecret, e as encryptSecret, g as generateQr } from './totp-DeaTdw_l.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'speakeasy';
import 'qrcode';

const POST = withAuth(async (ctx, user) => {
  return withLocks("_global", ["users.json"], async () => {
    const users = readDb("_global", "users.json");
    const u = users.find((x) => x.id === user.user_id);
    if (!u) return err(404, "User not found");
    if (u.totp_enabled) return err(409, "TOTP is already enabled");
    const secretObj = generateSecret(u.email, "Lab Manager");
    u.totp_secret_enc = encryptSecret(secretObj.base32);
    u.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const qr = await generateQr(secretObj.otpauth_url);
    await commit({
      labId: "_global",
      writes: [["users.json", users]],
      audit: {
        action: "user.totp_enroll_initiated",
        entity_type: "user",
        entity_id: u.id,
        actor_id: user.user_id,
        actor_role: "viewer",
        ip: ctx.getClientAddress()
      }
    });
    return ok({ otpauth_url: secretObj.otpauth_url, qr });
  });
});

export { POST };
//# sourceMappingURL=_server.ts-B1GwvAlt.js.map
