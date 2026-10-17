import { w as withAuth, e as err, o as ok } from './middleware-ngQf4GKt.js';
import { w as withLocks, a as readDb, c as commit } from './db-CfhGAyvN.js';
import { n as newId, g as generateItemBarcode } from './ids-CipgF91a.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'fs';
import 'crypto';
import 'path';
import 'proper-lockfile';

const POST = withAuth(async (ctx) => {
  const labId = ctx.params.labId;
  let formData;
  try {
    formData = await ctx.request.formData();
  } catch {
    return err(400, "Expected multipart/form-data");
  }
  const file = formData.get("file");
  if (!file || typeof file === "string") return err(400, 'Field "file" must be a CSV file');
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return err(400, "CSV must have a header row and at least one data row");
  const EXPECTED = ["name", "sku", "category", "brand", "model", "tracking_mode"];
  const headers = parseRow(lines[0]).map((h) => h.toLowerCase().trim());
  const missing = EXPECTED.filter((h) => !headers.includes(h));
  if (missing.length) return err(400, `Missing required CSV columns: ${missing.join(", ")}`);
  const col = (row, name) => (row[headers.indexOf(name)] ?? "").trim();
  const imported = [];
  const errors = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseRow(lines[i]);
    if (row.every((c) => !c.trim())) continue;
    const name = col(row, "name");
    const mode = col(row, "tracking_mode");
    if (!name) {
      errors.push(`Row ${i + 1}: name is required`);
      continue;
    }
    if (mode !== "serialized" && mode !== "bulk") {
      errors.push(`Row ${i + 1}: tracking_mode must be 'serialized' or 'bulk'`);
      continue;
    }
    const qtyTotal = headers.includes("quantity_total") ? parseInt(col(row, "quantity_total"), 10) || null : null;
    if (mode === "bulk" && (!qtyTotal || qtyTotal < 1)) {
      errors.push(`Row ${i + 1}: bulk items require quantity_total >= 1`);
      continue;
    }
    if (mode === "serialized" && qtyTotal) {
      errors.push(`Row ${i + 1}: serialized items must not set quantity_total`);
      continue;
    }
    const minStock = headers.includes("min_stock_alert") ? parseInt(col(row, "min_stock_alert"), 10) || null : null;
    imported.push({
      id: newId(),
      lab_id: labId,
      sku: col(row, "sku") || null,
      barcode: "",
      // filled in during commit
      qr_code: "",
      name,
      category: col(row, "category"),
      brand: col(row, "brand"),
      model: col(row, "model"),
      tracking_mode: mode,
      quantity_total: mode === "bulk" ? qtyTotal : null,
      quantity_available: mode === "bulk" ? qtyTotal : null,
      min_stock_alert: mode === "bulk" ? minStock : null,
      owner_id: null,
      default_location_id: null,
      availability_rule_id: null,
      datasheet_url: null,
      tutorial_links: [],
      included_accessories: [],
      manual_file_ids: [],
      label_size: "standard",
      notes: headers.includes("notes") ? col(row, "notes") : "",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      deleted_at: null
    });
  }
  if (imported.length === 0) {
    return ok({ imported: 0, skipped: 0, errors });
  }
  await withLocks(labId, ["items.json"], async () => {
    const items = readDb(labId, "items.json");
    for (const item of imported) {
      item.barcode = generateItemBarcode([...items, ...imported.filter((x) => x !== item)]);
      item.qr_code = `${process.env.PUBLIC_BASE_URL ?? ""}/${labId}/i/${item.id}`;
      items.push(item);
    }
    await commit({
      labId,
      writes: [["items.json", items]],
      audit: {
        actor_id: ctx.locals?.user?.user_id ?? "system",
        actor_role: ctx.locals?.membership?.role ?? "manager",
        action: "items.bulk_import",
        entity_type: "item",
        entity_id: labId,
        after: { count: imported.length }
      }
    });
  });
  return ok({ imported: imported.length, skipped: 0, errors });
}, { minRole: "manager" });
function parseRow(line) {
  const fields = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuote = !inQuote;
    } else if (ch === "," && !inQuote) {
      fields.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

export { POST };
//# sourceMappingURL=_server.ts-ChdR6JTg.js.map
