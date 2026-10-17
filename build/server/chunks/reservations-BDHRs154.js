import { a as readDb } from './db-CfhGAyvN.js';

function findConflicts(labId, candidate) {
  const items = readDb(labId, "items.json");
  const units = readDb(labId, "units.json");
  const reservations = readDb(labId, "reservations.json").filter((r) => r.id !== candidate.exclude_id).filter((r) => ["pending_manager", "approved", "active"].includes(r.status));
  const activeBorrows = readDb(labId, "borrows.json").filter(
    (b) => b.status === "active" || b.status === "partially_returned"
  );
  const start = new Date(candidate.start_at).getTime();
  const end = new Date(candidate.end_at).getTime();
  const overlaps = (a, b, s, e) => a < new Date(e).getTime() && new Date(s).getTime() < b;
  const conflicts = [];
  for (const line of candidate.lines) {
    const item = items.find((i) => i.id === line.item_id && !i.deleted_at);
    if (!item) continue;
    if (item.tracking_mode === "serialized") {
      const itemUnits = units.filter(
        (u) => u.item_id === item.id && !u.deleted_at && u.status !== "retired"
      );
      const busyUnitIds = /* @__PURE__ */ new Set();
      for (const r of reservations.filter((r2) => overlaps(start, end, r2.start_at, r2.end_at))) {
        for (const rl of r.lines.filter((l) => l.item_id === item.id)) {
          if (rl.unit_id) {
            busyUnitIds.add(rl.unit_id);
          } else {
            itemUnits.filter((u) => !busyUnitIds.has(u.id)).slice(0, rl.quantity).forEach((u) => busyUnitIds.add(u.id));
          }
        }
      }
      for (const b of activeBorrows) {
        for (const bl of b.lines.filter(
          (l) => l.unit_id && l.item_id === item.id && !l.returned_at
        )) {
          busyUnitIds.add(bl.unit_id);
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
      const reserved = reservations.filter((r) => overlaps(start, end, r.start_at, r.end_at)).flatMap((r) => r.lines.filter((l) => l.item_id === item.id)).reduce((s, l) => s + l.quantity, 0);
      const borrowed = activeBorrows.flatMap(
        (b) => b.lines.filter((l) => l.item_id === item.id && !l.unit_id && !l.returned_at)
      ).reduce((s, l) => s + (l.quantity - l.returned_quantity), 0);
      const free = item.quantity_total - reserved - borrowed;
      if (free < line.quantity) {
        conflicts.push({ item_id: item.id, requested: line.quantity, free });
      }
    }
  }
  return conflicts;
}

export { findConflicts as f };
//# sourceMappingURL=reservations-BDHRs154.js.map
