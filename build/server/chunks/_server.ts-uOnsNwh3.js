import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { p as parseBody, h as UnitSchema } from './validate-NtJDb-c4.js';
import { n as newId, b as generateUnitBarcode } from './ids-CipgF91a.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId;
  const id = ctx.params.id;
  const items = readDb(labId, "items.json");
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, "Item not found");
  if (item.tracking_mode !== "serialized")
    return err(422, "Item is not serialized; it has no units");
  const status = new URL(ctx.request.url).searchParams.get("status");
  let units = readDb(labId, "units.json").filter(
    (u) => u.item_id === id && !u.deleted_at
  );
  if (status) units = units.filter((u) => u.status === status);
  return ok(units);
}, { minRole: "viewer" });
const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const id = ctx.params.id;
  const parsed = await parseBody(ctx.request, UnitSchema.omit({ item_id: true }));
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;
  const items = readDb(labId, "items.json");
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, "Item not found");
  if (item.tracking_mode !== "serialized")
    return err(422, "Units can only be added to serialized items");
  const labs = readDb("_global", "labs.json");
  const lab = labs.find((l) => l.id === labId);
  const origin = new URL(ctx.request.url).origin;
  return withLocks(labId, ["units.json"], async () => {
    const units = readDb(labId, "units.json");
    const unitId = newId();
    const barcode = generateUnitBarcode(units);
    const qr_code = `${origin}/${lab?.slug ?? labId}/u/${unitId}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const unit = {
      id: unitId,
      lab_id: labId,
      item_id: id,
      barcode,
      qr_code,
      serial_number: data.serial_number ?? null,
      asset_tag: data.asset_tag ?? null,
      status: "available",
      condition: data.condition ?? "good",
      current_borrow_id: null,
      location_id: data.location_id ?? null,
      purchase_date: data.purchase_date ?? null,
      purchase_price: data.purchase_price ?? null,
      warranty_until: data.warranty_until ?? null,
      notes: data.notes ?? "",
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    await commit({
      labId,
      writes: [["units.json", [...units, unit]]],
      audit: {
        action: "unit.create",
        entity_type: "unit",
        entity_id: unitId,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        after: { item_id: id, barcode: unit.barcode },
        ip: ctx.getClientAddress()
      }
    });
    return ok(unit, 201);
  });
}, { minRole: "technician" });

export { GET, POST };
//# sourceMappingURL=_server.ts-uOnsNwh3.js.map
