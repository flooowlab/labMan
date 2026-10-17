import { a as readDb } from "./db.js";
import { A as ApiError } from "./types.js";
function expandKit(labId, kitId) {
  const kits = readDb(labId, "kits.json");
  const kit = kits.find((k) => k.id === kitId && !k.deleted_at);
  if (!kit) throw new ApiError(404, `Kit ${kitId} not found`);
  return kit.lines.map((line) => ({
    item_id: line.item_id,
    unit_id: null,
    quantity: line.quantity,
    is_required: line.is_required,
    is_accessory: false
  }));
}
export {
  expandKit as e
};
