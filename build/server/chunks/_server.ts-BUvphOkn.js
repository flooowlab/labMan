import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb } from './db-CfhGAyvN.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId;
  const id = ctx.params.id;
  const items = readDb(labId, "items.json");
  const item = items.find((i) => i.id === id && !i.deleted_at);
  if (!item) return err(404, "Item not found");
  if (item.tracking_mode === "serialized") {
    const units = readDb(labId, "units.json").filter(
      (u) => u.item_id === id && !u.deleted_at
    );
    const byStatus = {};
    for (const u of units) {
      byStatus[u.status] = (byStatus[u.status] ?? 0) + 1;
    }
    return ok({
      item_id: id,
      tracking_mode: "serialized",
      total: units.length,
      available: byStatus["available"] ?? 0,
      borrowed: byStatus["borrowed"] ?? 0,
      reserved: byStatus["reserved"] ?? 0,
      maintenance: byStatus["maintenance"] ?? 0,
      retired: byStatus["retired"] ?? 0,
      lost: byStatus["lost"] ?? 0
    });
  } else {
    const activeBorrows = readDb(labId, "borrows.json").filter(
      (b) => b.status === "active" || b.status === "partially_returned"
    );
    const borrowed = activeBorrows.flatMap((b) => b.lines.filter((l) => l.item_id === id && !l.unit_id && !l.returned_at)).reduce((s, l) => s + (l.quantity - l.returned_quantity), 0);
    return ok({
      item_id: id,
      tracking_mode: "bulk",
      total: item.quantity_total ?? 0,
      available: item.quantity_available ?? 0,
      borrowed
    });
  }
}, { minRole: "viewer" });

export { GET };
//# sourceMappingURL=_server.ts-BUvphOkn.js.map
