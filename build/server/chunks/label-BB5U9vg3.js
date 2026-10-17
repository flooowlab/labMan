import bwipjs from 'bwip-js';
import QRCode from 'qrcode';

async function generateBarcodeBuffer(code) {
  return bwipjs.toBuffer({
    bcid: "code128",
    text: code,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: "center"
  });
}
async function generateQrSvg(url) {
  return QRCode.toString(url, { type: "svg", margin: 1 });
}
async function buildLabelHtml(item, units, opts = {}) {
  const labName = opts.labName ?? "Lab";
  const labelsToRender = [];
  if (item.tracking_mode === "serialized" && units.length > 0) {
    for (const u of units) {
      const qr = await generateQrSvg(u.qr_code);
      labelsToRender.push({ barcode: u.barcode, serial: u.serial_number, qr });
    }
  } else {
    const qr = await generateQrSvg(item.qr_code ?? "");
    const repeat = opts.count ?? 1;
    for (let i = 0; i < repeat; i++) {
      labelsToRender.push({ barcode: item.barcode, serial: null, qr });
    }
  }
  const cardPx = { w: 324, h: 204 };
  const stdPx = { w: 236, h: 110 };
  const dims = item.label_size === "card" ? cardPx : stdPx;
  const labelCards = await Promise.all(
    labelsToRender.map((l) => renderLabel(l, item, dims, labName, item.label_size))
  );
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Labels – ${item.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; background: #fff; }
  .sheet { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px; }
  .label {
    width: ${dims.w}px; height: ${dims.h}px;
    border: 1px solid #888; overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 6px;
    page-break-inside: avoid;
  }
  .label-name { font-size: 11px; font-weight: bold; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .label-sub  { font-size: 9px; color: #555; }
  .label-bar  { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2px 0; }
  .label-bar img { max-width: 100%; max-height: ${dims.h - 60}px; }
  .label-footer { font-size: 8px; display: flex; justify-content: space-between; align-items: flex-end; }
  .label-qr svg { width: 36px; height: 36px; }
  @media print {
    body { margin: 0; padding: 0; }
    .sheet { padding: 0; gap: 4px; }
  }
</style>
</head>
<body>
<div class="sheet">
${labelCards.join("\n")}
</div>
</body>
</html>`;
}
async function renderLabel(l, item, dims, labName, size) {
  const barcodeBase64 = (await generateBarcodeBuffer(l.barcode)).toString("base64");
  const barcodeImg = `<img src="data:image/png;base64,${barcodeBase64}" alt="${l.barcode}"/>`;
  const subLine = l.serial ? `S/N: ${l.serial}` : item.sku ?? item.id.slice(0, 8);
  const footer = size === "card" ? `<span>${labName}</span><span class="label-qr">${l.qr}</span>` : `<span>${labName}</span>`;
  return `<div class="label">
  <div class="label-name">${escHtml(item.name)}</div>
  <div class="label-sub">${escHtml(subLine)}</div>
  <div class="label-bar">${barcodeImg}</div>
  <div class="label-footer">${footer}</div>
</div>`;
}
function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export { buildLabelHtml as b };
//# sourceMappingURL=label-BB5U9vg3.js.map
