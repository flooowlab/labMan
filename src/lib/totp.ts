import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// TOTP_ENC_KEY must be 64 hex chars (32 bytes) in .env
function getEncKey(): Buffer {
  const hex = process.env.TOTP_ENC_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error('TOTP_ENC_KEY must be a 64-char hex string (32 bytes)');
  }
  return Buffer.from(hex, 'hex');
}

export function generateSecret(email: string, labName: string) {
  return speakeasy.generateSecret({ name: `${labName} (${email})`, length: 20 });
}

export function verifyTotp(secret: string, token: string): boolean {
  return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
}

export async function generateQr(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

/** Encrypt TOTP secret with AES-256-GCM. Returns base64 string. */
export function encryptSecret(plaintext: string): string {
  const key = getEncKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

/** Decrypt a base64-encoded AES-256-GCM ciphertext. */
export function decryptSecret(ciphertext: string): string {
  const key = getEncKey();
  const buf = Buffer.from(ciphertext, 'base64');
  const iv = buf.subarray(0, 12);
  const authTag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted).toString('utf8') + decipher.final('utf8');
}
