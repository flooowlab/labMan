import { a as readDb } from './db-CfhGAyvN.js';

function buildPrintHtml(labId, borrow) {
  const items = readDb(labId, "items.json");
  const units = readDb(labId, "units.json");
  const users = readDb("_global", "users.json");
  const borrower = users.find((u) => u.id === borrow.user_id);
  const borrowerName = borrower?.name ?? borrow.user_id;
  const lineRows = borrow.lines.map((line) => {
    const item = items.find((i) => i.id === line.item_id);
    const unit = line.unit_id ? units.find((u) => u.id === line.unit_id) : null;
    const itemName = item?.name ?? line.item_id;
    const unitInfo = unit ? `${unit.serial_number ?? ""} (${unit.barcode})` : `×${line.quantity}`;
    const condition = line.borrowed_condition ?? "—";
    const returned = line.returned_at ? `✓ ${line.returned_condition ?? "—"}` : line.returned_quantity > 0 ? `Partial (${line.returned_quantity}/${line.quantity})` : "—";
    return `<tr>
        <td>${itemName}</td>
        <td>${unitInfo}</td>
        <td>${condition}</td>
        <td>${returned}</td>
      </tr>`;
  }).join("");
  const sigSection = (label, data) => data ? `<div class="sig-block"><p><strong>${label}</strong></p><img src="${data}" alt="${label} signature" style="max-width:280px;border:1px solid #ccc"/></div>` : `<div class="sig-block"><p><strong>${label}</strong></p><div style="height:60px;border:1px solid #ccc;width:280px"></div></div>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Borrow Document – ${borrow.id}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
    h1 { font-size: 16px; }
    table { border-collapse: collapse; width: 100%; margin-top: 10px; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
    th { background: #f0f0f0; }
    .sig-row { display: flex; gap: 40px; margin-top: 20px; }
    .sig-block { flex: 1; }
    .meta { margin-bottom: 10px; }
  </style>
</head>
<body>
  <h1>Equipment Borrow Document</h1>
  <div class="meta">
    <p><strong>Borrow ID:</strong> ${borrow.id}</p>
    <p><strong>Borrower:</strong> ${borrowerName}</p>
    <p><strong>Borrowed at:</strong> ${borrow.borrowed_at}</p>
    <p><strong>Due date:</strong> ${borrow.due_date}</p>
    <p><strong>Status:</strong> ${borrow.status}</p>
    ${borrow.returned_at ? `<p><strong>Returned at:</strong> ${borrow.returned_at}</p>` : ""}
    ${borrow.notes ? `<p><strong>Notes:</strong> ${borrow.notes}</p>` : ""}
  </div>
  <table>
    <thead><tr><th>Item</th><th>Unit / Qty</th><th>Out condition</th><th>Returned</th></tr></thead>
    <tbody>${lineRows}</tbody>
  </table>
  <div class="sig-row">
    ${sigSection("Borrower signature", borrow.borrower_sig_data)}
    ${sigSection("Technician signature", borrow.technician_sig_data)}
    ${borrow.return_sig_data ? sigSection("Return signature", borrow.return_sig_data) : ""}
  </div>
</body>
</html>`;
}

export { buildPrintHtml as b };
//# sourceMappingURL=print-WHcfKY6D.js.map
