import { withAuth, ok, err } from '$lib/middleware.js';
import { readDb, withLocks, commit } from '$lib/db.js';
import { newId, generateItemBarcode } from '$lib/ids.js';
import type { Item } from '$lib/types.js';

// POST /api/:labId/items/bulk-import
// Body: multipart/form-data with field "file" (CSV)
//
// Expected CSV columns (header row required):
//   name, sku, category, brand, model, tracking_mode,
//   quantity_total, min_stock_alert, notes
//
// Returns: { imported: N, skipped: N, errors: string[] }
export const POST = withAuth(async (ctx) => {
  const labId = ctx.params.labId!;

  let formData: FormData;
  try {
    formData = await ctx.request.formData();
  } catch {
    return err(400, 'Expected multipart/form-data');
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') return err(400, 'Field "file" must be a CSV file');

  const text = await (file as File).text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return err(400, 'CSV must have a header row and at least one data row');

  // Parse header
  const EXPECTED = ['name', 'sku', 'category', 'brand', 'model', 'tracking_mode'];
  const headers = parseRow(lines[0]!).map((h) => h.toLowerCase().trim());
  const missing = EXPECTED.filter((h) => !headers.includes(h));
  if (missing.length) return err(400, `Missing required CSV columns: ${missing.join(', ')}`);

  const col = (row: string[], name: string): string =>
    (row[headers.indexOf(name)] ?? '').trim();

  const imported: Item[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseRow(lines[i]!);
    if (row.every((c) => !c.trim())) continue; // blank line

    const name = col(row, 'name');
    const mode = col(row, 'tracking_mode') as Item['tracking_mode'];

    if (!name) { errors.push(`Row ${i + 1}: name is required`); continue; }
    if (mode !== 'serialized' && mode !== 'bulk') {
      errors.push(`Row ${i + 1}: tracking_mode must be 'serialized' or 'bulk'`);
      continue;
    }

    const qtyTotal = headers.includes('quantity_total')
      ? parseInt(col(row, 'quantity_total'), 10) || null
      : null;

    if (mode === 'bulk' && (!qtyTotal || qtyTotal < 1)) {
      errors.push(`Row ${i + 1}: bulk items require quantity_total >= 1`);
      continue;
    }
    if (mode === 'serialized' && qtyTotal) {
      errors.push(`Row ${i + 1}: serialized items must not set quantity_total`);
      continue;
    }

    const minStock = headers.includes('min_stock_alert')
      ? parseInt(col(row, 'min_stock_alert'), 10) || null
      : null;

    imported.push({
      id: newId(),
      lab_id: labId,
      sku: col(row, 'sku') || null,
      barcode: '', // filled in during commit
      qr_code: '',
      name,
      category: col(row, 'category'),
      brand: col(row, 'brand'),
      model: col(row, 'model'),
      tracking_mode: mode,
      quantity_total: mode === 'bulk' ? qtyTotal : null,
      quantity_available: mode === 'bulk' ? qtyTotal : null,
      min_stock_alert: mode === 'bulk' ? minStock : null,
      owner_id: null,
      default_location_id: null,
      availability_rule_id: null,
      datasheet_url: null,
      tutorial_links: [],
      included_accessories: [],
      manual_file_ids: [],
      label_size: 'standard',
      notes: headers.includes('notes') ? col(row, 'notes') : '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    });
  }

  if (imported.length === 0) {
    return ok({ imported: 0, skipped: 0, errors });
  }

  await withLocks(labId, ['items.json'], async () => {
    const items = readDb<Item>(labId, 'items.json');
    // Assign barcodes now that we have the full list
    for (const item of imported) {
      item.barcode = generateItemBarcode([...items, ...imported.filter((x) => x !== item)]);
      item.qr_code = `${process.env.PUBLIC_BASE_URL ?? ''}/${labId}/i/${item.id}`;
      items.push(item);
    }
    await commit({
      labId,
      writes: [['items.json', items]],
      audit: {
        actor_id: ctx.locals?.user?.user_id ?? 'system',
        actor_role: ctx.locals?.membership?.role ?? 'manager',
        action: 'items.bulk_import',
        entity_type: 'item',
        entity_id: labId,
        after: { count: imported.length },
      },
    });
  });

  return ok({ imported: imported.length, skipped: 0, errors });
}, { minRole: 'manager' });

/** Parse one CSV row, handling double-quoted fields. */
function parseRow(line: string): string[] {
  const fields: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; } // escaped quote
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      fields.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}
