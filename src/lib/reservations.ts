import { readDb } from './db.js';
import type { Item, Unit, BorrowRecord, Reservation } from './types.js';

export interface LineInput {
  item_id: string;
  unit_id?: string | null;
  quantity: number;
}

export interface Conflict {
  item_id: string;
  unit_id?: string;
  requested?: number;
  free?: number;
}

/**
 * Finds conflicts for a candidate reservation/borrow window.
 * Must be called INSIDE the composite lock.
 * Input:  labId, candidate window + lines, optional exclude_id (own reservation id on edits)
 * Output: Conflict[] (empty = no conflicts)
 */
export function findConflicts(
  labId: string,
  candidate: {
    lines: LineInput[];
    start_at: string;
    end_at: string;
    exclude_id?: string;
  },
): Conflict[] {
  const items = readDb<Item>(labId, 'items.json');
  const units = readDb<Unit>(labId, 'units.json');
  const reservations = readDb<Reservation>(labId, 'reservations.json')
    .filter((r) => r.id !== candidate.exclude_id)
    .filter((r) => ['pending_manager', 'approved', 'active'].includes(r.status));
  const activeBorrows = readDb<BorrowRecord>(labId, 'borrows.json').filter(
    (b) => b.status === 'active' || b.status === 'partially_returned',
  );

  const start = new Date(candidate.start_at).getTime();
  const end = new Date(candidate.end_at).getTime();
  const overlaps = (a: number, b: number, s: string, e: string) =>
    a < new Date(e).getTime() && new Date(s).getTime() < b;

  const conflicts: Conflict[] = [];

  for (const line of candidate.lines) {
    const item = items.find((i) => i.id === line.item_id && !i.deleted_at);
    if (!item) continue;

    if (item.tracking_mode === 'serialized') {
      const itemUnits = units.filter(
        (u) => u.item_id === item.id && !u.deleted_at && u.status !== 'retired',
      );
      const busyUnitIds = new Set<string>();

      for (const r of reservations.filter((r) => overlaps(start, end, r.start_at, r.end_at))) {
        for (const rl of r.lines.filter((l) => l.item_id === item.id)) {
          if (rl.unit_id) {
            busyUnitIds.add(rl.unit_id);
          } else {
            // Generic hold — mark the first free units as busy
            itemUnits
              .filter((u) => !busyUnitIds.has(u.id))
              .slice(0, rl.quantity)
              .forEach((u) => busyUnitIds.add(u.id));
          }
        }
      }
      for (const b of activeBorrows) {
        for (const bl of b.lines.filter(
          (l) => l.unit_id && l.item_id === item.id && !l.returned_at,
        )) {
          busyUnitIds.add(bl.unit_id!);
        }
      }

      const freeCount = itemUnits.filter((u) => !busyUnitIds.has(u.id)).length;
      if (line.unit_id) {
        if (busyUnitIds.has(line.unit_id)) {
          conflicts.push({ item_id: item.id, unit_id: line.unit_id });
        }
      } else if (freeCount < line.quantity) {
        conflicts.push({ item_id: item.id, requested: line.quantity, free: freeCount });
      }
    } else {
      const reserved = reservations
        .filter((r) => overlaps(start, end, r.start_at, r.end_at))
        .flatMap((r) => r.lines.filter((l) => l.item_id === item.id))
        .reduce((s, l) => s + l.quantity, 0);
      const borrowed = activeBorrows
        .flatMap((b) =>
          b.lines.filter((l) => l.item_id === item.id && !l.unit_id && !l.returned_at),
        )
        .reduce((s, l) => s + (l.quantity - l.returned_quantity), 0);
      const free = item.quantity_total! - reserved - borrowed;
      if (free < line.quantity) {
        conflicts.push({ item_id: item.id, requested: line.quantity, free });
      }
    }
  }

  return conflicts;
}
