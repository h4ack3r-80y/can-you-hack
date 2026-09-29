import bcrypt from "bcryptjs";
import crypto from "crypto";

// ---- Password policy ----
const COMMON_PASSWORDS = new Set(
  "password password1 password123 123456 12345678 123456789 qwerty abc123 letmein welcome admin administrator login passw0rd iloveyou monkey dragon sunshine master shadow football baseball superman trustno1".split(" ")
);

export interface PasswordCheck {
  ok: boolean;
  issues: string[];
  score: 0 | 1 | 2 | 3 | 4; // strength meter
}

export function checkPassword(pw: string): PasswordCheck {
  const issues: string[] = [];
  if (pw.length < 12) issues.push("Use at least 12 characters");
  const classes = [
    /[A-Z]/.test(pw),
    /[a-z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ].filter(Boolean).length;
  if (classes < 3) issues.push("Mix uppercase, lowercase, numbers and symbols (at least 3 kinds)");
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) issues.push("That password is too common — pick something unique");
  if (/(.)\1{3,}/.test(pw)) issues.push("Avoid repeating the same character");

  // simple strength score
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (classes >= 3) score++;
  if (classes === 4 && pw.length >= 14) score++;
  return { ok: issues.length === 0, issues, score: score as PasswordCheck["score"] };
}

export function suggestPassphrase(): string {
  const words = [
    "river", "falcon", "lantern", "meadow", "cipher", "harbor", "comet", "willow",
    "quartz", "thunder", "saffron", "orbit", "cedar", "monsoon", "ember", "tiger",
  ];
  const pick = () => words[crypto.randomInt(words.length)];
  return `${pick()}-${pick()}-${pick()}-${crypto.randomInt(10)}${crypto.randomInt(10)}`;
}

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 12);
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

// ---- Sessions (opaque tokens) ----
export function newSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const SESSION_COOKIE = "cyh_session";
export const SESSION_DAYS = 30;
