import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { a as readDb } from './db-CfhGAyvN.js';
import { s as sanitizeCode } from './validate-NtJDb-c4.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const GET = withAuth(async (ctx, _user, _membership) => {
  const labId = ctx.params.labId;
  const code = sanitizeCode(ctx.params.code ?? "");
  if (!code) return err(400, "Invalid barcode");
  const discriminator = code.split("-")[2];
  if (discriminator === "I") {
    const items = readDb(labId, "items.json");
    const item = items.find((i) => i.barcode === code && !i.deleted_at);
    if (!item) return err(404, "Item not found");
    return ok({ type: "item", data: item });
  }
  if (discriminator === "U") {
    const units = readDb(labId, "units.json");
    const unit = units.find((u) => u.barcode === code && !u.deleted_at);
    if (!unit) return err(404, "Unit not found");
    return ok({ type: "unit", data: unit });
  }
  return err(400, "Unrecognized barcode format — expected LAB-{YEAR}-I-{n} or LAB-{YEAR}-U-{n}");
}, { minRole: "viewer" });

export { GET };
//# sourceMappingURL=_server.ts-bkkN6UCN.js.map
