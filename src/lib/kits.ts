import { readDb } from './db.js';
import { ApiError } from './types.js';
import type { Kit } from './types.js';

export interface KitLineInput {
  item_id: string;
  unit_id: string | null;
  quantity: number;
  is_required: boolean;
  is_accessory: boolean;
}

/**
 * Expands a kit into borrow line inputs.
 * Input: labId + kitId.
 * Output: KitLineInput[] — one entry per kit line, ready for borrow creation.
 */
export function expandKit(labId: string, kitId: string): KitLineInput[] {
  const kits = readDb<Kit>(labId, 'kits.json');
  const kit = kits.find((k) => k.id === kitId && !k.deleted_at);
  if (!kit) throw new ApiError(404, `Kit ${kitId} not found`);
  return kit.lines.map((line) => ({
    item_id: line.item_id,
    unit_id: null,
    quantity: line.quantity,
    is_required: line.is_required,
    is_accessory: false,
  }));
}
