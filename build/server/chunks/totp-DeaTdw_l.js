import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { createDecipheriv, randomBytes, createCipheriv } from 'crypto';

function getEncKey() {
  const hex = process.env.TOTP_ENC_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("TOTP_ENC_KEY must be a 64-char hex string (32 bytes)");
  }
  return Buffer.from(hex, "hex");
}
function generateSecret(email, labName) {
  return speakeasy.generateSecret({ name: `${labName} (${email})`, length: 20 });
}
function verifyTotp(secret, token) {
  return speakeasy.totp.verify({ secret, encoding: "base32", token, window: 1 });
}
async function generateQr(otpauthUrl) {
  return QRCode.toDataURL(otpauthUrl);
}
function encryptSecret(plaintext) {
  const key = getEncKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}
function decryptSecret(ciphertext) {
  const key = getEncKey();
  const buf = Buffer.from(ciphertext, "base64");
  const iv = buf.subarray(0, 12);
  const authTag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted).toString("utf8") + decipher.final("utf8");
}

export { generateSecret as a, decryptSecret as d, encryptSecret as e, generateQr as g, verifyTotp as v };
//# sourceMappingURL=totp-DeaTdw_l.js.map
