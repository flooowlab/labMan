import { w as withAuth, o as ok, e as err } from './middleware-ngQf4GKt.js';
import { a as readDb, w as withLocks, c as commit } from './db-CfhGAyvN.js';
import { p as parseBody, B as BorrowSchema } from './validate-NtJDb-c4.js';
import { n as newId, a as generatePrintToken } from './ids-CipgF91a.js';
import { e as expandKit } from './kits-DWAR5NRL.js';
import { a as assertEligible } from './eligibility-DGc5DGyc.js';
import { A as ApiError } from './types--djZK7fU.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';
import 'zod';

const GET = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const { searchParams } = ctx.url;
  let borrows = readDb(labId, "borrows.json");
  if (membership?.role === "student") {
    borrows = borrows.filter((b) => b.user_id === user.user_id);
  } else {
    const userId = searchParams.get("user_id");
    if (userId) borrows = borrows.filter((b) => b.user_id === userId);
  }
  const status = searchParams.get("status");
  if (status) borrows = borrows.filter((b) => b.status === status);
  return ok(borrows);
}, { minRole: "viewer" });
const POST = withAuth(async (ctx, user, membership) => {
  const labId = ctx.params.labId;
  const parsed = await parseBody(ctx.request, BorrowSchema);
  if ("error" in parsed) return parsed.error;
  const input = parsed.data;
  try {
    const record = await withLocks(
      labId,
      ["borrows.json", "items.json", "reservations.json", "units.json"],
      async () => {
        const items = readDb(labId, "items.json");
        const units = readDb(labId, "units.json");
        const borrows = readDb(labId, "borrows.json");
        const reservations = readDb(labId, "reservations.json");
        const rawLines = input.kit_id ? expandKit(labId, input.kit_id) : input.lines;
        let reservation;
        if (input.reservation_id) {
          reservation = reservations.find((r) => r.id === input.reservation_id);
          if (!reservation) throw new ApiError(404, "Reservation not found");
          if (reservation.status !== "approved") {
            throw new ApiError(409, `Reservation is ${reservation.status}, not approved`);
          }
        }
        const borrowUser = input.user_id !== user.user_id ? { ...user, user_id: input.user_id, memberships: user.memberships } : user;
        const allocatedUnitIds = /* @__PURE__ */ new Set();
        const builtLines = [];
        for (const line of rawLines) {
          const item = items.find((i) => i.id === line.item_id && !i.deleted_at);
          if (!item) throw new ApiError(404, `Item ${line.item_id} not found`);
          const authId = await assertEligible(labId, item, borrowUser);
          if (item.tracking_mode === "serialized") {
            if (line.quantity !== void 0 && line.quantity !== 1) {
              throw new ApiError(422, "Serialized line must have quantity = 1");
            }
            let unitId = line.unit_id ?? null;
            if (!unitId) {
              const free = units.find(
                (u) => u.item_id === item.id && u.status === "available" && !u.deleted_at && !allocatedUnitIds.has(u.id)
              );
              if (!free) throw new ApiError(409, `No available unit for "${item.name}"`);
              unitId = free.id;
            }
            const unit = units.find((u) => u.id === unitId);
            if (!unit || unit.deleted_at) throw new ApiError(404, `Unit ${unitId} not found`);
            if (unit.status !== "available") {
              throw new ApiError(409, `Unit ${unit.serial_number ?? unitId} is ${unit.status}`);
            }
            allocatedUnitIds.add(unitId);
            unit.status = "borrowed";
            unit.current_borrow_id = "__pending__";
            builtLines.push({
              id: newId(),
              item_id: item.id,
              unit_id: unitId,
              quantity: 1,
              is_accessory: line.is_accessory ?? false,
              is_required: line.is_required ?? true,
              borrowed_condition: unit.condition,
              returned_condition: null,
              returned_quantity: 0,
              returned_at: null,
              incident_report_id: null
            });
            if (authId) builtLines[builtLines.length - 1].incident_report_id = null;
          } else {
            const qty = line.quantity;
            if (item.quantity_available < qty) {
              throw new ApiError(409, `Only ${item.quantity_available} of "${item.name}" available`);
            }
            item.quantity_available -= qty;
            if (item.quantity_available < 0 || item.quantity_available > item.quantity_total) {
              throw new Error("INVARIANT: quantity_available out of bounds after decrement");
            }
            builtLines.push({
              id: newId(),
              item_id: item.id,
              unit_id: null,
              quantity: qty,
              is_accessory: line.is_accessory ?? false,
              is_required: line.is_required ?? true,
              borrowed_condition: null,
              returned_condition: null,
              returned_quantity: 0,
              returned_at: null,
              incident_report_id: null
            });
          }
        }
        const cfg = readDb(labId, "config.json")[0];
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const record2 = {
          id: newId(),
          lab_id: labId,
          user_id: input.user_id,
          reservation_id: input.reservation_id ?? null,
          kit_id: input.kit_id ?? null,
          lines: builtLines,
          borrowed_at: now,
          due_date: input.due_date,
          max_due_date: new Date(
            Date.now() + cfg.default_max_borrow_days * 864e5
          ).toISOString(),
          returned_at: null,
          status: "active",
          approved_by: user.user_id,
          instructor_auth_id: null,
          borrower_sig_data: null,
          technician_sig_data: null,
          return_sig_data: null,
          print_token: "",
          penalty_level: 0,
          notes: input.notes ?? "",
          created_at: now,
          updated_at: now
        };
        for (const u of units) {
          if (u.current_borrow_id === "__pending__") u.current_borrow_id = record2.id;
        }
        record2.print_token = generatePrintToken(record2.id);
        if (reservation) {
          reservation.status = "active";
          reservation.borrow_id = record2.id;
          reservation.updated_at = now;
        }
        await commit({
          labId,
          writes: [
            ["items.json", items],
            ["units.json", units],
            ["borrows.json", [...borrows, record2]],
            ["reservations.json", reservations]
          ],
          audit: {
            action: "borrow.create",
            entity_type: "borrow",
            entity_id: record2.id,
            actor_id: user.user_id,
            actor_role: membership?.role ?? "technician",
            after: { user_id: record2.user_id, line_count: record2.lines.length, due_date: record2.due_date },
            ip: ctx.getClientAddress()
          }
        });
        return record2;
      }
    );
    return ok(record, 201);
  } catch (e) {
    if (e instanceof ApiError) return err(e.status, e.message);
    throw e;
  }
}, { minRole: "technician" });

export { GET, POST };
//# sourceMappingURL=_server.ts-CPM5mbi-.js.map
