import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { AuthorizationSchema } from '$lib/validate.js';
import type { Authorization } from '$lib/types.js';

// GET /api/:labId/authorizations/:id
export const GET = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };
  const auths = readDb<Authorization>(labId, 'authorizations.json');
  const auth = auths.find((a) => a.id === id);
  if (!auth) return err(404, 'Authorization not found');

  // Instructors may only see their own grants
  if (membership?.role === 'instructor' && auth.instructor_id !== user.user_id) {
    return err(403, 'Forbidden');
  }

  return ok(auth);
}, { minRole: 'viewer' });

// PATCH /api/:labId/authorizations/:id — update or revoke (instructor or manager+)
export const PATCH = withAuth(async (ctx, user, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  return withLocks(labId, ['authorizations.json'], async () => {
    const auths = readDb<Authorization>(labId, 'authorizations.json');
    const auth = auths.find((a) => a.id === id);
    if (!auth) return err(404, 'Authorization not found');

    if (membership?.role === 'instructor' && auth.instructor_id !== user.user_id) {
      return err(403, 'Forbidden');
    }

    let body: unknown;
    try {
      body = await ctx.request.json();
    } catch {
      return err(400, 'Invalid JSON');
    }

    // Allow patching expires_at and is_active (revoke)
    const patch = AuthorizationSchema.pick({ expires_at: true, is_active: true })
      .partial()
      .safeParse(body);
    if (!patch.success) return err(422, JSON.stringify(patch.error.issues));

    const clean = Object.fromEntries(
      Object.entries(patch.data).filter(([, v]) => v !== undefined),
    );
    Object.assign(auth, clean);

    await commit({
      labId,
      writes: [['authorizations.json', auths]],
      audit: {
        action: patch.data.is_active === false ? 'authorization.revoke' : 'authorization.update',
        entity_type: 'authorization',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        after: clean,
        ip: ctx.getClientAddress(),
      },
    });

    return ok(auth);
  });
}, { minRole: 'instructor' });
