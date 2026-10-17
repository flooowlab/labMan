import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { LocationSchema } from '$lib/validate.js';
import { newId } from '$lib/ids.js';
import type { Location } from '$lib/types.js';

// GET /api/:labId/locations
export const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId!;
  const locations = readDb<Location>(labId, 'locations.json');
  return ok(locations);
}, { minRole: 'viewer' });

// POST /api/:labId/locations
export const POST = withAuth(async (ctx, actor, membership) => {
  const labId = ctx.params.labId!;

  let body: unknown;
  try { body = await ctx.request.json(); } catch { return err(400, 'Invalid JSON'); }

  const parsed = LocationSchema.safeParse(body);
  if (!parsed.success) return err(400, parsed.error.issues[0]?.message ?? 'Validation error');

  return withLocks(labId, ['locations.json'], async () => {
    const locations = readDb<Location>(labId, 'locations.json');
    const now = new Date().toISOString();

    const loc: Location = {
      id: newId(),
      lab_id: labId,
      name: parsed.data.name,
      room: parsed.data.room ?? '',
      shelf: parsed.data.shelf ?? null,
      notes: parsed.data.notes ?? '',
      created_at: now,
    };
    locations.push(loc);

    await commit({
      labId,
      writes: [['locations.json', locations]],
      audit: {
        action: 'location.create',
        entity_type: 'location',
        entity_id: loc.id,
        actor_id: actor.user_id,
        actor_role: membership?.role ?? 'admin',
        ip: ctx.getClientAddress(),
      },
    });

    return ok(loc, 201);
  });
}, { minRole: 'manager' });
