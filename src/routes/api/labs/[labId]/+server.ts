import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { LabSchema, parseBody } from '$lib/validate.js';
import type { Lab } from '$lib/types.js';

// GET /api/labs/:labId — any lab member (withAuth checks membership when labId param present)
export const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId!;
  const labs = readDb<Lab>('_global', 'labs.json');
  const lab = labs.find((l) => l.id === labId);
  if (!lab) return err(404, 'Lab not found');
  return ok(lab);
});

// PATCH /api/labs/:labId — admin or manager of the lab (or super-admin)
export const PATCH = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const isSuper = user.memberships.some((m) => m.lab_id === '_global' && m.role === 'admin');
  if (!isSuper && membership?.role !== 'admin' && membership?.role !== 'manager') {
    return err(403, 'Forbidden');
  }

  const parsed = await parseBody(ctx.request, LabSchema.partial());
  if ('error' in parsed) return parsed.error;
  const patch = parsed.data;

  return withLocks('_global', ['labs.json'], async () => {
    const labs = readDb<Lab>('_global', 'labs.json');
    const lab = labs.find((l) => l.id === labId);
    if (!lab) return err(404, 'Lab not found');

    if (patch.slug && patch.slug !== lab.slug) {
      if (labs.find((l) => l.slug === patch.slug && l.id !== labId)) {
        return err(409, 'Slug already in use');
      }
    }

    Object.assign(lab, Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)));

    await commit({
      labId: '_global',
      writes: [['labs.json', labs]],
      audit: {
        action: 'lab.update',
        entity_type: 'lab',
        entity_id: labId,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        after: patch,
        ip: ctx.getClientAddress(),
      },
    });
    return ok(lab);
  });
});

// DELETE /api/labs/:labId — super-admin only (sets is_active = false)
export const DELETE = withAuth(async (ctx, user) => {
  const labId = ctx.params.labId!;
  const isSuper = user.memberships.some((m) => m.lab_id === '_global' && m.role === 'admin');
  if (!isSuper) return err(403, 'Only super-admins can deactivate labs');

  return withLocks('_global', ['labs.json'], async () => {
    const labs = readDb<Lab>('_global', 'labs.json');
    const lab = labs.find((l) => l.id === labId);
    if (!lab) return err(404, 'Lab not found');

    lab.is_active = false;

    await commit({
      labId: '_global',
      writes: [['labs.json', labs]],
      audit: {
        action: 'lab.deactivate',
        entity_type: 'lab',
        entity_id: labId,
        actor_id: user.user_id,
        actor_role: 'admin',
        ip: ctx.getClientAddress(),
      },
    });
    return ok({ ok: true });
  });
});
