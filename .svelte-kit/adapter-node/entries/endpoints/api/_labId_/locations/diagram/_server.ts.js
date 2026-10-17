import { w as withAuth, o as ok } from "../../../../../../chunks/middleware.js";
import { a as readDb } from "../../../../../../chunks/db.js";
const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId;
  const locations = readDb(labId, "locations.json").filter((l) => !l.deleted_at);
  const items = readDb(labId, "items.json").filter((i) => !i.deleted_at);
  const units = readDb(labId, "units.json").filter((u) => !u.deleted_at);
  const serializedAvailable = /* @__PURE__ */ new Map();
  const serializedTotal = /* @__PURE__ */ new Map();
  for (const u of units) {
    serializedTotal.set(u.item_id, (serializedTotal.get(u.item_id) ?? 0) + 1);
    if (u.status === "available") {
      serializedAvailable.set(u.item_id, (serializedAvailable.get(u.item_id) ?? 0) + 1);
    }
  }
  function itemSummary(item) {
    const available_count = item.tracking_mode === "serialized" ? serializedAvailable.get(item.id) ?? 0 : item.quantity_available ?? 0;
    const total_count = item.tracking_mode === "serialized" ? serializedTotal.get(item.id) ?? 0 : item.quantity_total ?? 0;
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      tracking_mode: item.tracking_mode,
      sku: item.sku,
      barcode: item.barcode,
      available_count,
      total_count
    };
  }
  const itemNameById = new Map(items.map((i) => [i.id, i.name]));
  function unitSummary(unit) {
    return {
      id: unit.id,
      item_id: unit.item_id,
      item_name: itemNameById.get(unit.item_id) ?? "(unknown)",
      barcode: unit.barcode,
      serial_number: unit.serial_number,
      asset_tag: unit.asset_tag,
      status: unit.status,
      condition: unit.condition
    };
  }
  const locationMap = new Map(locations.map((l) => [l.id, l]));
  const result = locations.map((loc) => ({
    location: loc,
    items: items.filter((i) => i.default_location_id === loc.id).map(itemSummary),
    units: units.filter((u) => u.location_id === loc.id).map(unitSummary)
  }));
  const unassignedItems = items.filter((i) => !i.default_location_id || !locationMap.has(i.default_location_id)).map(itemSummary);
  const unassignedUnits = units.filter((u) => !u.location_id || !locationMap.has(u.location_id)).map(unitSummary);
  return ok({ locations: result, unassigned: { items: unassignedItems, units: unassignedUnits } });
}, { minRole: "viewer" });
export {
  GET
};
