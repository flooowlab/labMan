import bwipjs from 'bwip-js';
import QRCode from 'qrcode';

/** Returns a PNG Buffer for the given code string (Code 128). */
export async function generateBarcodeBuffer(code: string): Promise<Buffer> {
  return bwipjs.toBuffer({
    bcid: 'code128',
    text: code,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: 'center',
  });
}

/** Returns an SVG string for the given URL (QR code). */
export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, { type: 'svg', margin: 1 });
}
