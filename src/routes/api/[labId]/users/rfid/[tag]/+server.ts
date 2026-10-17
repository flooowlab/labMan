import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import { sanitizeCode } from '$lib/validate.js';
import type { User, LabMembership } from '$lib/types.js';

// GET /api/:labId/users/rfid/:tag — look up a user by their RFID tag
export const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId!;
  // Decode URL-encoded path segment before sanitising (%3A → : etc.)
  const raw = decodeURIComponent(ctx.params.tag ?? '');
  const clean = sanitizeCode(raw).toUpperCase();

  const users = readDb<User>('_global', 'users.json');
  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');

  const u = users.find(
    (x) => x.rfid_tag != null &&
           sanitizeCode(x.rfid_tag).toUpperCase() === clean &&
           x.is_active && !x.redacted_at,
  );
  if (!u) return err(404, 'No user found with that RFID tag');

  const m = memberships.find((x) => x.user_id === u.id && x.lab_id === labId && x.is_active);
  if (!m) return err(404, 'User is not a member of this lab');

  return ok({
    id: u.id,
    name: u.name,
    email: u.email,
    rfid_tag: u.rfid_tag,
    membership: {
      id: m.id,
      role: m.role,
      user_type: m.user_type,
      student_level: m.student_level,
      no_show_count: m.no_show_count,
      borrow_restricted_until: m.borrow_restricted_until,
    },
  });
}, { minRole: 'technician' });
