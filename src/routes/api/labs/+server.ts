import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { LabSchema, parseBody } from '$lib/validate.js';
import { newId } from '$lib/ids.js';
import { runMigrations } from '../../../../migrations/runner.js';
import type { Lab } from '$lib/types.js';

// GET /api/labs — returns all labs for super-admins, member labs only for everyone else
export const GET = withAuth(async (_ctx, user) => {
  const labs = readDb<Lab>('_global', 'labs.json');
  const isSuper = user.memberships.some((m) => m.lab_id === '_global' && m.role === 'admin');
  if (isSuper) return ok(labs);
  const memberLabIds = new Set(user.memberships.map((m) => m.lab_id));
  return ok(labs.filter((l) => memberLabIds.has(l.id) && l.is_active));
});

// POST /api/labs — super-admin only
export const POST = withAuth(async (ctx, user) => {
  const isSuper = user.memberships.some((m) => m.lab_id === '_global' && m.role === 'admin');
  if (!isSuper) return err(403, 'Only super-admins can create labs');

  const parsed = await parseBody(ctx.request, LabSchema);
  if ('error' in parsed) return parsed.error;
  const data = parsed.data;

  return withLocks('_global', ['labs.json'], async () => {
    const labs = readDb<Lab>('_global', 'labs.json');
    if (labs.find((l) => l.slug === data.slug)) return err(409, 'Slug already in use');

    const id = newId();
    const lab: Lab = {
      id,
      slug: data.slug,
      name: data.name,
      room: data.room ?? '',
      contact_email: data.contact_email ?? '',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    await commit({
      labId: '_global',
      writes: [['labs.json', [...labs, lab]]],
      audit: {
        action: 'lab.create',
        entity_type: 'lab',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: 'admin',
        after: { slug: lab.slug, name: lab.name },
        ip: ctx.getClientAddress(),
      },
    });

    // Bootstrap per-lab data files
    await runMigrations(id);
    return ok(lab, 201);
  });
});
