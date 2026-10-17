import { withAuth, ok } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import { signToken, cookieOptions } from '$lib/auth.js';
import type { LabMembership, Lab } from '$lib/types.js';

export const POST = withAuth(async (ctx, user) => {
  // Reload memberships from DB in case roles changed since last login
  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');
  const labs = readDb<Lab>('_global', 'labs.json');
  const userMemberships = memberships.filter((m) => m.user_id === user.user_id && m.is_active);
  const membershipTokens = userMemberships.map((m) => {
    const lab = labs.find((l) => l.id === m.lab_id);
    return {
      lab_id: m.lab_id,
      lab_slug: lab?.slug ?? m.lab_id,
      role: m.role,
      user_type: m.user_type,
    };
  });

  const token = await signToken({
    user_id: user.user_id,
    email: user.email,
    memberships: membershipTokens,
    totp_verified: user.totp_verified,
    partial: false,
  });
  ctx.cookies.set('token', token, cookieOptions(28800));
  return ok({ ok: true, memberships: membershipTokens });
});
