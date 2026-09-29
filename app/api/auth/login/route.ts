import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifyPassword, newSessionToken, SESSION_COOKIE, SESSION_DAYS } from "@/lib/auth";
import { loginRateLimited } from "@/lib/session";

export async function POST(req: NextRequest) {
  if (loginRateLimited(req)) {
    return NextResponse.json({ error: "Too many attempts. Wait a minute and try again." }, { status: 429 });
  }
  const { email, password } = await req.json().catch(() => ({}));
  const fail = () => NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!email || !password) return fail();
  const user = await db.user.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!user) return fail();
  if (!(await verifyPassword(String(password), user.passwordHash))) return fail();

  const token = newSessionToken();
  await db.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_DAYS * 86400_000),
    },
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });

  return NextResponse.json({ ok: true });
}
