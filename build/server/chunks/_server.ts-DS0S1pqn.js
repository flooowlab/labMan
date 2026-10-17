import bcrypt from 'bcryptjs';
import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { i as UserPatchSchema, M as MembershipPatchSchema, P as PasswordChangeSchema, s as sanitizeCode } from './validate-NtJDb-c4.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const GET = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  const users = readDb("_global", "users.json");
  const memberships = readDb("_global", "lab_memberships.json");
  const u = users.find((x) => x.id === id);
  if (!u) return err(404, "User not found");
  const m = memberships.find((x) => x.user_id === id && x.lab_id === labId);
  if (!m) return err(404, "User is not a member of this lab");
  if (membership?.role === "student" && id !== user.user_id) return err(403, "Forbidden");
  return ok({
    id: u.id,
    name: u.redacted_at ? "[REDACTED]" : u.name,
    email: u.redacted_at ? "[REDACTED]" : u.email,
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
      is_active: m.is_active
    }
  });
}, { minRole: "viewer" });
const PATCH = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  const isSelf = id === user.user_id;
  const isManagerPlus = membership && ["admin", "manager"].includes(membership.role);
  if (!isSelf && !isManagerPlus) return err(403, "Forbidden");
  let body;
  try {
    body = await ctx.request.json();
  } catch {
    return err(400, "Invalid JSON");
  }
  const userPatch = UserPatchSchema.safeParse(body);
  const membershipPatch = MembershipPatchSchema.safeParse(body);
  const passwordChange = PasswordChangeSchema.safeParse(body);
  return withLocks("_global", ["lab_memberships.json", "users.json"], async () => {
    const users = readDb("_global", "users.json");
    const memberships = readDb("_global", "lab_memberships.json");
    const u = users.find((x) => x.id === id);
    if (!u) return err(404, "User not found");
    const m = memberships.find((x) => x.user_id === id && x.lab_id === labId);
    if (!m) return err(404, "User is not a member of this lab");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (userPatch.success) {
      const clean = Object.fromEntries(
        Object.entries(userPatch.data).filter(([, v]) => v !== void 0)
      );
      if (clean.rfid_tag != null) clean.rfid_tag = sanitizeCode(clean.rfid_tag).toUpperCase();
      Object.assign(u, clean);
      u.updated_at = now;
    }
    if (passwordChange.success) {
      const pc = passwordChange.data;
      if (isSelf) {
        const valid = await bcrypt.compare(pc.old_password, u.password_hash);
        if (!valid) return err(401, "Old password is incorrect");
      } else if (!isManagerPlus) {
        return err(403, "Forbidden");
      }
      u.password_hash = await bcrypt.hash(pc.new_password, 12);
      u.must_change_password = false;
      u.updated_at = now;
    }
    if (membershipPatch.success && isManagerPlus) {
      const mclean = Object.fromEntries(
        Object.entries(membershipPatch.data).filter(([, v]) => v !== void 0)
      );
      Object.assign(m, mclean);
    }
    await commit({
      labId: "_global",
      writes: [["lab_memberships.json", memberships], ["users.json", users]],
      audit: {
        action: "user.update",
        entity_type: "user",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        ip: ctx.getClientAddress()
      }
    });
    return ok({ id: u.id, name: u.name, email: u.email, membership: m });
  });
}, { minRole: "viewer" });
const DELETE = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params;
  return withLocks("_global", ["lab_memberships.json"], async () => {
    const memberships = readDb("_global", "lab_memberships.json");
    const m = memberships.find((x) => x.user_id === id && x.lab_id === labId);
    if (!m) return err(404, "Membership not found");
    m.is_active = false;
    await commit({
      labId: "_global",
      writes: [["lab_memberships.json", memberships]],
      audit: {
        action: "user.remove_from_lab",
        entity_type: "user",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        after: { lab_id: labId },
        ip: ctx.getClientAddress()
      }
    });
    return ok({ ok: true });
  });
}, { minRole: "manager" });

export { DELETE, GET, PATCH };
//# sourceMappingURL=_server.ts-DS0S1pqn.js.map
