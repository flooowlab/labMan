import { createHmac } from "crypto";
function getPrintSecret() {
  const s = process.env.PRINT_TOKEN_SECRET ?? "";
  if (!s.trim()) throw new Error("PRINT_TOKEN_SECRET env var is not set. Add it to .env (min 32 chars).");
  return s;
}
function newId() {
  return crypto.randomUUID();
}
function generateItemBarcode(items) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const max = items.map((i) => i.barcode).filter((b) => b?.startsWith(`LAB-${year}-I-`)).map((b) => parseInt(b.split("-")[3] ?? "0", 10)).reduce((a, c) => Math.max(a, c), 0);
  return `LAB-${year}-I-${String(max + 1).padStart(5, "0")}`;
}
function generateUnitBarcode(units) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const max = units.map((u) => u.barcode).filter((b) => b?.startsWith(`LAB-${year}-U-`)).map((b) => parseInt(b.split("-")[3] ?? "0", 10)).reduce((a, c) => Math.max(a, c), 0);
  return `LAB-${year}-U-${String(max + 1).padStart(5, "0")}`;
}
function generatePrintToken(borrowId) {
  const expires = Date.now() + 36e5;
  const payload = `${borrowId}:${expires}`;
  const sig = createHmac("sha256", getPrintSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}
function verifyPrintToken(token, borrowId) {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const colonIdx = decoded.lastIndexOf(":");
    const sigPart = decoded.slice(colonIdx + 1);
    const payloadPart = decoded.slice(0, colonIdx);
    const [id, expiresStr] = payloadPart.split(":");
    if (id !== borrowId || Date.now() > parseInt(expiresStr, 10)) return false;
    const expected = createHmac("sha256", getPrintSecret()).update(payloadPart).digest("hex");
    return sigPart === expected;
  } catch {
    return false;
  }
}
export {
  generatePrintToken as a,
  generateUnitBarcode as b,
  generateItemBarcode as g,
  newId as n,
  verifyPrintToken as v
};
