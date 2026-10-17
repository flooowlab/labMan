import { createHmac } from 'crypto';
import type { Item, Unit } from './types.js';

function getPrintSecret(): string {
  const s = process.env.PRINT_TOKEN_SECRET ?? '';
  if (!s.trim()) throw new Error('PRINT_TOKEN_SECRET env var is not set. Add it to .env (min 32 chars).');
  return s;
}

export function newId(): string {
  return crypto.randomUUID();
}

/** Generate the next item barcode: LAB-{YEAR}-I-{5-digit} */
export function generateItemBarcode(items: Item[]): string {
  const year = new Date().getFullYear();
  const max = items
    .map((i) => i.barcode)
    .filter((b) => b?.startsWith(`LAB-${year}-I-`))
    .map((b) => parseInt(b.split('-')[3] ?? '0', 10))
    .reduce((a, c) => Math.max(a, c), 0);
  return `LAB-${year}-I-${String(max + 1).padStart(5, '0')}`;
}

/** Generate the next unit barcode: LAB-{YEAR}-U-{5-digit} */
export function generateUnitBarcode(units: Unit[]): string {
  const year = new Date().getFullYear();
  const max = units
    .map((u) => u.barcode)
    .filter((b) => b?.startsWith(`LAB-${year}-U-`))
    .map((b) => parseInt(b.split('-')[3] ?? '0', 10))
    .reduce((a, c) => Math.max(a, c), 0);
  return `LAB-${year}-U-${String(max + 1).padStart(5, '0')}`;
}

/**
 * Generate a time-limited print token for a borrow.
 * Deliver via Authorization header or POST body — never query string.
 */
export function generatePrintToken(borrowId: string): string {
  const expires = Date.now() + 3_600_000;
  const payload = `${borrowId}:${expires}`;
  const sig = createHmac('sha256', getPrintSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

export function verifyPrintToken(token: string, borrowId: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const colonIdx = decoded.lastIndexOf(':');
    const sigPart = decoded.slice(colonIdx + 1);
    const payloadPart = decoded.slice(0, colonIdx);
    const [id, expiresStr] = payloadPart.split(':');
    if (id !== borrowId || Date.now() > parseInt(expiresStr, 10)) return false;
    const expected = createHmac('sha256', getPrintSecret())
      .update(payloadPart)
      .digest('hex');
    return sigPart === expected;
  } catch {
    return false;
  }
}
