import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { checkPassword, hashPassword, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  const { current, next } = await req.json().catch(() => ({}));

  const full = await db.user.findUnique({ where: { id: user.id } });
  if (!full || !(await verifyPassword(String(current || ""), full.passwordHash))) {
    return NextResponse.json({ error: "Current password is wrong." }, { status: 400 });
  }
  const check = checkPassword(String(next || ""));
  if (!check.ok) {
    return NextResponse.json({ error: "New password too weak: " + check.issues.join("; ") }, { status: 400 });
  }
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } });
  return NextResponse.json({ ok: true });
}
