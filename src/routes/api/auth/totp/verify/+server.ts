import { ok, err } from '$lib/middleware.js';
import { verifyToken, signToken, cookieOptions } from '$lib/auth.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { verifyTotp, decryptSecret } from '$lib/totp.js';
import { TotpVerifySchema, parseBody } from '$lib/validate.js';
import type { User, LabMembership, Lab } from '$lib/types.js';

// Handles two scenarios:
//   1. partial=true JWT → login TOTP step 2 → issues full JWT
//   2. full JWT → enrollment confirmation → activates TOTP on account
export const POST = async (ctx) => {
  const rawToken = ctx.cookies.get('token');
  if (!rawToken) return err(401, 'Unauthorized');

  let payload;
  try {
    payload = await verifyToken(rawToken);
  } catch {
    return err(401, 'Unauthorized');
  }

  const parsed = await parseBody(ctx.request, TotpVerifySchema);
  if ('error' in parsed) return parsed.error;
  const { token: totpCode } = parsed.data;

  const users = readDb<User>('_global', 'users.json');
  const u = users.find((x) => x.id === payload.user_id);
  if (!u || !u.totp_secret_enc) {
    return err(400, 'No TOTP secret found. Call /api/auth/totp/enroll first.');
  }

  const secret = decryptSecret(u.totp_secret_enc);
  if (!verifyTotp(secret, totpCode)) return err(401, 'Invalid TOTP code');

  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');
  const labs = readDb<Lab>('_global', 'labs.json');
  const membershipTokens = memberships
    .filter((m) => m.user_id === u.id && m.is_active)
    .map((m) => {
      const lab = labs.find((l) => l.id === m.lab_id);
      return {
        lab_id: m.lab_id,
        lab_slug: lab?.slug ?? m.lab_id,
        role: m.role,
        user_type: m.user_type,
      };
    });

  if (payload.partial) {
    // Login step 2: exchange partial JWT for full JWT
    const fullToken = await signToken({
      user_id: u.id,
      email: u.email,
      memberships: membershipTokens,
      totp_verified: true,
      partial: false,
    });
    ctx.cookies.set('token', fullToken, cookieOptions(28800));
    return ok({ ok: true, memberships: membershipTokens });
  }

  // Enrollment confirmation: activate TOTP on the account
  await withLocks('_global', ['users.json'], async () => {
    const fresh = readDb<User>('_global', 'users.json');
    const fu = fresh.find((x) => x.id === u.id)!;
    fu.totp_enabled = true;
    fu.updated_at = new Date().toISOString();
    await commit({
      labId: '_global',
      writes: [['users.json', fresh]],
      audit: {
        action: 'user.totp_enabled',
        entity_type: 'user',
        entity_id: u.id,
        actor_id: u.id,
        actor_role: 'viewer',
        ip: ctx.getClientAddress(),
      },
    });
  });

  const updToken = await signToken({
    user_id: u.id,
    email: u.email,
    memberships: membershipTokens,
    totp_verified: true,
    partial: false,
  });
  ctx.cookies.set('token', updToken, cookieOptions(28800));
  return ok({ totp_enabled: true });
};
