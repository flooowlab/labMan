import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { KitSchema, parseBody } from '$lib/validate.js';
import type { Kit } from '$lib/types.js';

// GET /api/:labId/kits/:id
export const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  const kits = readDb<Kit>(labId, 'kits.json');
  const kit = kits.find((k) => k.id === id && !k.deleted_at);
  if (!kit) return err(404, 'Kit not found');

  return ok(kit);
}, { minRole: 'viewer' });

// PATCH /api/:labId/kits/:id  — partial update; bumps version when lines change
export const PATCH = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  const parsed = await parseBody(ctx.request, KitSchema.partial());
  if ('error' in parsed) return parsed.error;
  const data = parsed.data;

  return withLocks(labId, ['kits.json'], async () => {
    const kits = readDb<Kit>(labId, 'kits.json');
    const kit = kits.find((k) => k.id === id && !k.deleted_at);
    if (!kit) return err(404, 'Kit not found');

    const before = { name: kit.name, version: kit.version };
    const now = new Date().toISOString();

    if (data.name !== undefined) kit.name = data.name;
    if (data.description !== undefined) kit.description = data.description ?? '';
    if (data.availability_rule_id !== undefined)
      kit.availability_rule_id = data.availability_rule_id ?? null;
    if (data.lines !== undefined) {
      kit.lines = data.lines.map((l) => ({
        item_id: l.item_id,
        quantity: l.quantity,
        is_required: l.is_required ?? true,
      }));
      kit.version += 1; // Bump version on any line change
    }
    kit.updated_at = now;

    await commit({
      labId,
      writes: [['kits.json', kits]],
      audit: {
        action: 'kit.update',
        entity_type: 'kit',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        before,
        after: { name: kit.name, version: kit.version },
        ip: ctx.getClientAddress(),
      },
    });

    return ok(kit);
  });
}, { minRole: 'manager' });

// DELETE /api/:labId/kits/:id  — soft-delete
export const DELETE = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId!;
  const id = ctx.params.id!;

  return withLocks(labId, ['kits.json'], async () => {
    const kits = readDb<Kit>(labId, 'kits.json');
    const kit = kits.find((k) => k.id === id && !k.deleted_at);
    if (!kit) return err(404, 'Kit not found');

    const now = new Date().toISOString();
    kit.deleted_at = now;
    kit.updated_at = now;

    await commit({
      labId,
      writes: [['kits.json', kits]],
      audit: {
        action: 'kit.delete',
        entity_type: 'kit',
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? 'admin',
        ip: ctx.getClientAddress(),
      },
    });

    return ok({ deleted: true });
  });
}, { minRole: 'manager' });
