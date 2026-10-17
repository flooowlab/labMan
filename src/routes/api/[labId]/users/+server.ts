import bcrypt from 'bcryptjs';
import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { CreateUserSchema, MembershipSchema, parseBody } from '$lib/validate.js';
import { newId } from '$lib/ids.js';
import type { User, LabMembership } from '$lib/types.js';

// GET /api/:labId/users — list all members of the lab
export const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId!;
  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');
  const users = readDb<User>('_global', 'users.json');
  const result = memberships
    .filter((m) => m.lab_id === labId && m.is_active)
    .map((m) => {
      const u = users.find((x) => x.id === m.user_id);
      if (!u) return null;
      return {
        id: u.id,
        name: u.redacted_at ? '[REDACTED]' : u.name,
        email: u.redacted_at ? '[REDACTED]' : u.email,
        rfid_tag: u.rfid_tag,
        is_active: u.is_active,
        created_at: u.created_at,
        membership: {
          id: m.id,
          role: m.role,
          user_type: m.user_type,
          student_level: m.student_level,
          no_show_count: m.no_show_count,
          borrow_restricted_until: m.borrow_restricted_until,
          is_active: m.is_active,
        },
      };
    })
    .filter(Boolean);
  return ok(result);
}, { minRole: 'viewer' });

// POST /api/:labId/users — create user + add to lab (or add existing user to lab)
export const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;

  let body: unknown;
  try {
    body = await ctx.request.json();
  } catch {
    return err(400, 'Invalid JSON');
  }

  const userParsed = CreateUserSchema.safeParse(body);
  if (!userParsed.success) {
    return err(422, JSON.stringify(userParsed.error.issues));
  }
  const membershipParsed = MembershipSchema.omit({ user_id: true }).safeParse(body);
  if (!membershipParsed.success) {
    return err(422, JSON.stringify(membershipParsed.error.issues));
  }

  const userData = userParsed.data;
  const membershipData = membershipParsed.data;

  return withLocks('_global', ['lab_memberships.json', 'users.json'], async () => {
    const users = readDb<User>('_global', 'users.json');
    const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');

    let targetUser = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());

    if (targetUser) {
      const exists = memberships.find(
        (m) => m.user_id === targetUser!.id && m.lab_id === labId && m.is_active,
      );
      if (exists) return err(409, 'User is already a member of this lab');
    } else {
      const now = new Date().toISOString();
      targetUser = {
        id: newId(),
        rfid_tag: userData.rfid_tag ?? null,
        name: userData.name,
        email: userData.email,
        password_hash: await bcrypt.hash(userData.password, 12),
        must_change_password: false,
        totp_secret_enc: null,
        totp_enabled: false,
        is_active: true,
        created_at: now,
        updated_at: now,
        redacted_at: null,
      };
      users.push(targetUser);
    }

    const now = new Date().toISOString();
    const newMembership: LabMembership = {
      id: newId(),
      user_id: targetUser.id,
      lab_id: labId,
      role: membershipData.role,
      user_type: membershipData.user_type,
      student_level: membershipData.student_level,
      instructor_ids: membershipData.instructor_ids,
      no_show_count: 0,
      borrow_restricted_until: null,
      is_active: true,
      created_at: now,
    };
    memberships.push(newMembership);

    await commit({
      labId: '_global',
      writes: [['lab_memberships.json', memberships], ['users.json', users]],
      audit: {
        action: 'user.add_to_lab',
        entity_type: 'user',
        entity_id: targetUser.id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        after: { lab_id: labId, role: membershipData.role },
        ip: ctx.getClientAddress(),
      },
    });

    return ok(
      {
        user: { id: targetUser.id, name: targetUser.name, email: targetUser.email },
        membership: newMembership,
      },
      201,
    );
  });
}, { minRole: 'manager' });
