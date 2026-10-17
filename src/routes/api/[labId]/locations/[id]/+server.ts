import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { LocationSchema } from '$lib/validate.js';
import type { Location, Item, Unit } from '$lib/types.js';

// PATCH /api/:labId/locations/:id
export const PATCH = withAuth(async (ctx, actor, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  let body: unknown;
  try { body = await ctx.request.json(); } catch { return err(400, 'Invalid JSON'); }

  const parsed = LocationSchema.partial().safeParse(body);
  if (!parsed.success) return err(400, parsed.error.issues[0]?.message ?? 'Validation error');

  return withLocks(labId, ['locations.json'], async () => {
    const locations = readDb<Location>(labId, 'locations.json');
    const loc = locations.find((l) => l.id === id);
    if (!loc) return err(404, 'Location not found');

    Object.assign(loc, Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined),
    ));

    await commit({
      labId,
      writes: [['locations.json', locations]],
      audit: {
        action: 'location.update',
        entity_type: 'location',
        entity_id: id,
        actor_id: actor.user_id,
        actor_role: membership?.role ?? 'admin',
        ip: ctx.getClientAddress(),
      },
    });

    return ok(loc);
  });
}, { minRole: 'manager' });

// DELETE /api/:labId/locations/:id
export const DELETE = withAuth(async (ctx, actor, membership) => {
  const { labId, id } = ctx.params as { labId: string; id: string };

  return withLocks(labId, ['items.json', 'locations.json', 'units.json'], async () => {
    const locations = readDb<Location>(labId, 'locations.json');
    const loc = locations.find((l) => l.id === id);
    if (!loc) return err(404, 'Location not found');

    // Refuse if any items or units still reference this location
    const items = readDb<Item>(labId, 'items.json');
    const units = readDb<Unit>(labId, 'units.json');
    const inUse = items.some((i) => !i.deleted_at && i.default_location_id === id) ||
                  units.some((u) => !u.deleted_at && u.location_id === id);
    if (inUse) return err(409, 'Location is still referenced by items or units. Reassign them first.');

    // Soft-delete: add deleted_at field
    (loc as any).deleted_at = new Date().toISOString();

    await commit({
      labId,
      writes: [['locations.json', locations]],
      audit: {
        action: 'location.delete',
        entity_type: 'location',
        entity_id: id,
        actor_id: actor.user_id,
        actor_role: membership?.role ?? 'admin',
        ip: ctx.getClientAddress(),
      },
    });

    return ok({ ok: true });
  });
}, { minRole: 'manager' });
