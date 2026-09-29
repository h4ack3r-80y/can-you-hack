import crypto from "crypto";
import QRCode from "qrcode";

// Verification code: CYH-2026-XXXXXXXXXXXXXXX (15 chars from a 31-symbol
// unambiguous alphabet → ~74 bits of entropy from crypto.randomInt)
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function newVerificationCode(): string {
  const year = new Date().getFullYear();
  let tail = "";
  for (let i = 0; i < 15; i++) tail += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return `CYH-${year}-${tail}`;
}

export function isValidCodeFormat(code: string): boolean {
  return /^CYH-\d{4}-[A-Z2-9]{15}$/.test(code);
}

/** QR code data URL for a verification link (server-side). */
export async function qrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, { width: 220, margin: 1 });
}

export function verifyUrl(code: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  return `${base}/verify/${code}`;
}
