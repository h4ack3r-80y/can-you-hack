// Usage: node scripts/make-admin.mjs you@email.com
// Grants admin (founder) rights to an existing account.
import { DatabaseSync } from "node:sqlite";

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/make-admin.mjs you@email.com");
  process.exit(1);
}
const url = process.env.DATABASE_URL || "file:./dev.db";
const path = (url.match(/^file:(.+)$/) || [])[1] || "./dev.db";
const db = new DatabaseSync(path);
const r = db.prepare("UPDATE users SET isAdmin = 1 WHERE email = ?").run(email.toLowerCase());
console.log(r.changes > 0 ? `✓ ${email} is now an admin.` : `✗ No account found for ${email}.`);
db.close();
