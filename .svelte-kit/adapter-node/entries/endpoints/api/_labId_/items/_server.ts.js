import { w as withAuth, o as ok } from "../../../../../chunks/middleware.js";
import { a as readDb, w as withLocks, c as commit } from "../../../../../chunks/db.js";
import { p as parseBody, c as ItemSchema } from "../../../../../chunks/validate.js";
import { n as newId, g as generateItemBarcode } from "../../../../../chunks/ids.js";
const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId;
  const url = new URL(ctx.request.url);
  const category = url.searchParams.get("category");
  const trackingMode = url.searchParams.get("tracking_mode");
  const q = url.searchParams.get("q")?.toLowerCase();
  const items = readDb(labId, "items.json").filter((i) => !i.deleted_at);
  const availableUnits = readDb(labId, "units.json").filter(
    (u) => !u.deleted_at && u.status === "available"
  );
  const unitCountMap = /* @__PURE__ */ new Map();
  for (const u of availableUnits) {
    unitCountMap.set(u.item_id, (unitCountMap.get(u.item_id) ?? 0) + 1);
  }
  let result = items.map((i) => ({
    ...i,
    available_count: i.tracking_mode === "serialized" ? unitCountMap.get(i.id) ?? 0 : i.quantity_available ?? 0
  }));
  if (category) result = result.filter((i) => i.category === category);
  if (trackingMode) result = result.filter((i) => i.tracking_mode === trackingMode);
  if (q)
    result = result.filter(
      (i) => i.name.toLowerCase().includes(q) || (i.sku?.toLowerCase() ?? "").includes(q) || i.category.toLowerCase().includes(q)
    );
  return ok(result);
}, { minRole: "viewer" });
const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const parsed = await parseBody(ctx.request, ItemSchema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;
  const labs = readDb("_global", "labs.json");
  const lab = labs.find((l) => l.id === labId);
  const origin = new URL(ctx.request.url).origin;
  return withLocks(labId, ["items.json"], async () => {
    const items = readDb(labId, "items.json");
    const id = newId();
    const barcode = generateItemBarcode(items);
    const qr_code = `${origin}/${lab?.slug ?? labId}/i/${id}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const item = {
      id,
      lab_id: labId,
      sku: data.sku ?? null,
      barcode,
      qr_code,
      name: data.name,
      category: data.category,
      brand: data.brand,
      model: data.model,
      tracking_mode: data.tracking_mode,
      quantity_total: data.quantity_total ?? null,
      quantity_available: data.quantity_available ?? null,
      min_stock_alert: data.min_stock_alert ?? null,
      owner_id: data.owner_id ?? null,
      default_location_id: data.default_location_id ?? null,
      availability_rule_id: data.availability_rule_id ?? null,
      datasheet_url: null,
      tutorial_links: [],
      included_accessories: data.included_accessories ?? [],
      manual_file_ids: [],
      label_size: data.label_size ?? "standard",
      notes: data.notes ?? "",
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    await commit({
      labId,
      writes: [["items.json", [...items, item]]],
      audit: {
        action: "item.create",
        entity_type: "item",
        entity_id: id,
        actor_id: user.user_id,
        actor_role: membership?.role ?? "admin",
        after: { name: item.name, tracking_mode: item.tracking_mode },
        ip: ctx.getClientAddress()
      }
    });
    return ok(item, 201);
  });
}, { minRole: "technician" });
export {
  GET,
  POST
};
