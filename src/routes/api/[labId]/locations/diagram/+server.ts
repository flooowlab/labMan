import { withAuth, ok } from '$lib/middleware.js';
import { readDb } from '$lib/db.js';
import type { Location, Item, Unit } from '$lib/types.js';

/**
 * GET /api/:labId/locations/diagram
 *
 * Returns inventory distribution across locations — who has what, where.
 * Used by managers and technicians to orient themselves in the room, and by
 * student assistants to know where to return items.
 *
 * Response shape:
 * {
 *   locations: Array<{
 *     location: Location,
 *     items: Array<{ id, name, category, tracking_mode, sku, barcode, available_count, total_count }>,
 *     units: Array<{ id, item_id, item_name, barcode, serial_number, asset_tag, status, condition }>
 *   }>,
 *   unassigned: {
 *     items: Array<{ ... }>,
 *     units: Array<{ ... }>
 *   }
 * }
 */
export const GET = withAuth(async (ctx) => {
  const labId = ctx.params.labId!;

  const locations = readDb<Location>(labId, 'locations.json')
    .filter((l) => !(l as any).deleted_at);
  const items = readDb<Item>(labId, 'items.json')
    .filter((i) => !i.deleted_at);
  const units = readDb<Unit>(labId, 'units.json')
    .filter((u) => !u.deleted_at);

  // Pre-compute available unit counts for serialized items
  const serializedAvailable = new Map<string, number>();
  const serializedTotal = new Map<string, number>();
  for (const u of units) {
    serializedTotal.set(u.item_id, (serializedTotal.get(u.item_id) ?? 0) + 1);
    if (u.status === 'available') {
      serializedAvailable.set(u.item_id, (serializedAvailable.get(u.item_id) ?? 0) + 1);
    }
  }

  function itemSummary(item: Item) {
    const available_count = item.tracking_mode === 'serialized'
      ? (serializedAvailable.get(item.id) ?? 0)
      : (item.quantity_available ?? 0);
    const total_count = item.tracking_mode === 'serialized'
      ? (serializedTotal.get(item.id) ?? 0)
      : (item.quantity_total ?? 0);
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      tracking_mode: item.tracking_mode,
      sku: item.sku,
      barcode: item.barcode,
      available_count,
      total_count,
    };
  }

  // Build a name lookup for units
  const itemNameById = new Map(items.map((i) => [i.id, i.name]));

  function unitSummary(unit: Unit) {
    return {
      id: unit.id,
      item_id: unit.item_id,
      item_name: itemNameById.get(unit.item_id) ?? '(unknown)',
      barcode: unit.barcode,
      serial_number: unit.serial_number,
      asset_tag: unit.asset_tag,
      status: unit.status,
      condition: unit.condition,
    };
  }

  // Group items and units by location
  const locationMap = new Map(locations.map((l) => [l.id, l]));

  const result = locations.map((loc) => ({
    location: loc,
    items: items
      .filter((i) => i.default_location_id === loc.id)
      .map(itemSummary),
    units: units
      .filter((u) => u.location_id === loc.id)
      .map(unitSummary),
  }));

  const unassignedItems = items
    .filter((i) => !i.default_location_id || !locationMap.has(i.default_location_id))
    .map(itemSummary);

  const unassignedUnits = units
    .filter((u) => !u.location_id || !locationMap.has(u.location_id))
    .map(unitSummary);

  return ok({ locations: result, unassigned: { items: unassignedItems, units: unassignedUnits } });
}, { minRole: 'viewer' });
