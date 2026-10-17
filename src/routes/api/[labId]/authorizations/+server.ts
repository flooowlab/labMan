import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { AuthorizationSchema, parseBody } from '$lib/validate.js';
import { newId } from '$lib/ids.js';
import type { Authorization, LabMembership } from '$lib/types.js';

// GET /api/:labId/authorizations — list authorizations (instructors see only their own grants)
export const GET = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const auths = readDb<Authorization>(labId, 'authorizations.json');
  const { searchParams } = ctx.url;

  let result = auths;
  const studentId = searchParams.get('student_id');
  const category = searchParams.get('category');
  if (searchParams.get('active') !== 'false') result = result.filter((a) => a.is_active);
  if (studentId) result = result.filter((a) => a.student_id === studentId);
  if (category) result = result.filter((a) => a.item_category === category);
  if (membership?.role === 'instructor') {
    result = result.filter((a) => a.instructor_id === user.user_id);
  }

  return ok(result);
}, { minRole: 'viewer' });

// POST /api/:labId/authorizations — grant authorization (instructor or manager+)
export const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;

  const parsed = await parseBody(ctx.request, AuthorizationSchema);
  if ('error' in parsed) return parsed.error;
  const data = parsed.data;

  // Instructors may only grant under their own user_id
  if (membership?.role === 'instructor' && data.instructor_id !== user.user_id) {
    return err(403, 'Instructors may only grant authorizations under their own ID');
  }

  // Verify student is an active member of this lab
  const memberships = readDb<LabMembership>('_global', 'lab_memberships.json');
  const studentMembership = memberships.find(
    (m) => m.user_id === data.student_id && m.lab_id === labId && m.is_active,
  );
  if (!studentMembership) return err(404, 'Student not found in this lab');

  return withLocks(labId, ['authorizations.json'], async () => {
    const auths = readDb<Authorization>(labId, 'authorizations.json');

    // Supersede any active auth for the same student+category
    auths
      .filter(
        (a) =>
          a.student_id === data.student_id &&
          a.item_category === data.item_category &&
          a.is_active,
      )
      .forEach((a) => {
        a.is_active = false;
      });

    const auth: Authorization = {
      id: newId(),
      lab_id: labId,
      student_id: data.student_id,
      instructor_id: data.instructor_id,
      item_category: data.item_category,
      is_active: true,
      expires_at: data.expires_at,
      created_at: new Date().toISOString(),
    };
    auths.push(auth);

    await commit({
      labId,
      writes: [['authorizations.json', auths]],
      audit: {
        action: 'authorization.grant',
        entity_type: 'authorization',
        entity_id: auth.id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        after: { student_id: data.student_id, item_category: data.item_category },
        ip: ctx.getClientAddress(),
      },
    });

    return ok(auth, 201);
  });
}, { minRole: 'instructor' });
