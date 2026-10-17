import bcrypt from 'bcryptjs';
import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { UserPatchSchema, MembershipPatchSchema, PasswordChangeSchema, sanitizeCode } from '$lib/validate.js';
import type { User, LabMembership } from '$lib/types.js';

// GET /api/:labId/users/:id
export const GET = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };
  const users = readDb<User>('_global', 'users.json');
  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');

  const u = users.find((x) => x.id === id);
  if (!u) return err(404, 'User not found');
  const m = memberships.find((x) => x.user_id === id && x.lab_id === labId);
  if (!m) return err(404, 'User is not a member of this lab');

  // Students may only view their own profile
  if (membership?.role === 'student' && id !== user.user_id) return err(403, 'Forbidden');

  return ok({
    id: u.id,
    name: u.redacted_at ? '[REDACTED]' : u.name,
    email: u.redacted_at ? '[REDACTED]' : u.email,
    rfid_tag: u.rfid_tag,
    totp_enabled: u.totp_enabled,
    must_change_password: u.must_change_password,
    is_active: u.is_active,
    created_at: u.created_at,
    updated_at: u.updated_at,
    redacted_at: u.redacted_at,
    membership: {
      id: m.id,
      role: m.role,
      user_type: m.user_type,
      student_level: m.student_level,
      instructor_ids: m.instructor_ids,
      no_show_count: m.no_show_count,
      borrow_restricted_until: m.borrow_restricted_until,
      is_active: m.is_active,
    },
  });
}, { minRole: 'viewer' });

// PATCH /api/:labId/users/:id — self or manager+
export const PATCH = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };
  const isSelf = id === user.user_id;
  const isManagerPlus = membership && ['admin', 'manager'].includes(membership.role);
  if (!isSelf && !isManagerPlus) return err(403, 'Forbidden');

  let body: unknown;
  try {
    body = await ctx.request.json();
  } catch {
    return err(400, 'Invalid JSON');
  }

  const userPatch = UserPatchSchema.safeParse(body);
  const membershipPatch = MembershipPatchSchema.safeParse(body);
  const passwordChange = PasswordChangeSchema.safeParse(body);

  return withLocks('_global', ['lab_memberships.json', 'users.json'], async () => {
    const users = readDb<User>('_global', 'users.json');
    const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');

    const u = users.find((x) => x.id === id);
    if (!u) return err(404, 'User not found');
    const m = memberships.find((x) => x.user_id === id && x.lab_id === labId);
    if (!m) return err(404, 'User is not a member of this lab');

    const now = new Date().toISOString();

    if (userPatch.success) {
      const clean = Object.fromEntries(
        Object.entries(userPatch.data).filter(([, v]) => v !== undefined),
      );
      // Normalise RFID tag to uppercase for consistent lookup
      if (clean.rfid_tag != null) clean.rfid_tag = sanitizeCode(clean.rfid_tag).toUpperCase();
      Object.assign(u, clean);
      u.updated_at = now;
    }

    if (passwordChange.success) {
      const pc = passwordChange.data;
      if (isSelf) {
        const valid = await bcrypt.compare(pc.old_password, u.password_hash);
        if (!valid) return err(401, 'Old password is incorrect');
      } else if (!isManagerPlus) {
        return err(403, 'Forbidden');
      }
      u.password_hash = await bcrypt.hash(pc.new_password, 12);
      u.must_change_password = false;
      u.updated_at = now;
    }

    // Membership fields only changed by manager+
    if (membershipPatch.success && isManagerPlus) {
      const mclean = Object.fromEntries(
        Object.entries(membershipPatch.data).filter(([, v]) => v !== undefined),
      );
      Object.assign(m, mclean);
    }

    await commit({
      labId: '_global',
      writes: [['lab_memberships.json', memberships], ['users.json', users]],
      audit: {
        action: 'user.update',
        entity_type: 'user',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        ip: ctx.getClientAddress(),
      },
    });

    return ok({ id: u.id, name: u.name, email: u.email, membership: m });
  });
}, { minRole: 'viewer' });

// DELETE /api/:labId/users/:id — deactivates lab membership (not global user)
export const DELETE = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  return withLocks('_global', ['lab_memberships.json'], async () => {
    const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');
    const m = memberships.find((x) => x.user_id === id && x.lab_id === labId);
    if (!m) return err(404, 'Membership not found');

    m.is_active = false;

    await commit({
      labId: '_global',
      writes: [['lab_memberships.json', memberships]],
      audit: {
        action: 'user.remove_from_lab',
        entity_type: 'user',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        after: { lab_id: labId },
        ip: ctx.getClientAddress(),
      },
    });
    return ok({ ok: true });
  });
}, { minRole: 'manager' });
