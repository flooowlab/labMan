import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { UnitPatchSchema, parseBody } from '$lib/validate.js';
import type { Unit } from '$lib/types.js';

// GET /api/:labId/units/:id
export const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  const units = readDb<Unit>(labId, 'units.json');
  const unit = units.find((u) => u.id === id && !u.deleted_at);
  if (!unit) return err(404, 'Unit not found');

  return ok(unit);
}, { minRole: 'viewer' });

// PATCH /api/:labId/units/:id
export const PATCH = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  const parsed = await parseBody(ctx.request, UnitPatchSchema);
  if ('error' in parsed) return parsed.error;
  const data = parsed.data;

  return withLocks(labId, ['units.json'], async () => {
    const units = readDb<Unit>(labId, 'units.json');
    const unit = units.find((u) => u.id === id && !u.deleted_at);
    if (!unit) return err(404, 'Unit not found');

    const before = { status: unit.status, condition: unit.condition };
    const patch = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
    Object.assign(unit, patch, { updated_at: new Date().toISOString() });

    await commit({
      labId,
      writes: [['units.json', units]],
      audit: {
        action: 'unit.update',
        entity_type: 'unit',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        before,
        after: { status: unit.status, condition: unit.condition },
        ip: ctx.getClientAddress(),
      },
    });

    return ok(unit);
  });
}, { minRole: 'technician' });

// DELETE /api/:labId/units/:id  — soft-delete; refuses if unit is currently borrowed
export const DELETE = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  return withLocks(labId, ['units.json'], async () => {
    const units = readDb<Unit>(labId, 'units.json');
    const unit = units.find((u) => u.id === id && !u.deleted_at);
    if (!unit) return err(404, 'Unit not found');
    if (unit.current_borrow_id || unit.status === 'borrowed')
      return err(409, 'Cannot delete unit: currently borrowed');

    const now = new Date().toISOString();
    unit.deleted_at = now;
    unit.updated_at = now;

    await commit({
      labId,
      writes: [['units.json', units]],
      audit: {
        action: 'unit.delete',
        entity_type: 'unit',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        ip: ctx.getClientAddress(),
      },
    });

    return ok({ deleted: true });
  });
}, { minRole: 'manager' });
