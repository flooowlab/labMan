import { w as withAuth, o as ok, e as err } from './middleware-ngQf4GKt.js';
import { w as withLocks, a as readDb, c as commit } from './db-CfhGAyvN.js';
import { p as parseBody, g as ReturnSchema } from './validate-NtJDb-c4.js';
import { A as ApiError } from './types--djZK7fU.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const POST = withAuth(async (ctx, user, membership) => {
  const { labId, id: borrowId } = ctx.params;
  const parsed = await parseBody(ctx.request, ReturnSchema);
  if ("error" in parsed) return parsed.error;
  const input = parsed.data;
  try {
    const borrow = await withLocks(
      labId,
      ["borrows.json", "items.json", "units.json"],
      async () => {
        const borrows = readDb(labId, "borrows.json");
        const items = readDb(labId, "items.json");
        const units = readDb(labId, "units.json");
        const borrow2 = borrows.find((b) => b.id === borrowId);
        if (!borrow2) throw new ApiError(404, "Borrow not found");
        if (borrow2.status === "returned" || borrow2.status === "cancelled") {
          throw new ApiError(409, `Borrow is already ${borrow2.status}`);
        }
        const now = (/* @__PURE__ */ new Date()).toISOString();
        for (const ret of input.lines) {
          const line = borrow2.lines.find((l) => l.id === ret.line_id);
          if (!line) throw new ApiError(404, `Line ${ret.line_id} not found`);
          const remaining = line.quantity - line.returned_quantity;
          if (ret.returned_quantity > remaining) {
            throw new ApiError(
              422,
              `Cannot return ${ret.returned_quantity}; only ${remaining} remaining`
            );
          }
          line.returned_quantity += ret.returned_quantity;
          if (ret.returned_condition) line.returned_condition = ret.returned_condition;
          if (line.returned_quantity >= line.quantity) line.returned_at = now;
          if (line.unit_id) {
            const unit = units.find((u) => u.id === line.unit_id);
            unit.status = "available";
            unit.current_borrow_id = null;
            if (ret.returned_condition) unit.condition = ret.returned_condition;
          } else {
            const item = items.find((i) => i.id === line.item_id);
            item.quantity_available = Math.min(
              item.quantity_available + ret.returned_quantity,
              item.quantity_total
            );
          }
        }
        const allSettled = borrow2.lines.every((l) => l.returned_quantity >= l.quantity);
        const anySettled = borrow2.lines.some((l) => l.returned_quantity > 0);
        borrow2.status = allSettled ? "returned" : anySettled ? "partially_returned" : borrow2.status;
        if (allSettled) borrow2.returned_at = now;
        if (input.return_sig_data) borrow2.return_sig_data = input.return_sig_data;
        borrow2.updated_at = now;
        await commit({
          labId,
          writes: [
            ["borrows.json", borrows],
            ["items.json", items],
            ["units.json", units]
          ],
          audit: {
            action: allSettled ? "borrow.return" : "borrow.partial_return",
            entity_type: "borrow",
            entity_id: borrowId,
            actor_id: user.user_id,
            actor_role: membership?.role ?? "technician",
            after: { status: borrow2.status },
            ip: ctx.getClientAddress()
          }
        });
        return borrow2;
      }
    );
    return ok(borrow);
  } catch (e) {
    if (e instanceof ApiError) return err(e.status, e.message);
    throw e;
  }
}, { minRole: "technician" });

export { POST };
//# sourceMappingURL=_server.ts-Bwg1xNB_.js.map
