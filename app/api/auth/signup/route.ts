import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { checkPassword, hashPassword, newSessionToken, SESSION_COOKIE, SESSION_DAYS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, password, ethics } = await req.json().catch(() => ({}));

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  }
  if (!ethics) {
    return NextResponse.json({ error: "You must accept the ethics pledge to join." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look valid." }, { status: 400 });
  }
  const pw = checkPassword(password);
  if (!pw.ok) {
    return NextResponse.json({ error: "Password too weak.", issues: pw.issues }, { status: 400 });
  }
  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists. Try logging in." }, { status: 409 });
  }

  const isAdmin = !!process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
  const user = await db.user.create({
    data: {
      name: name.trim().slice(0, 80),
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      isAdmin,
    },
  });

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
