import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await db.session.delete({ where: { id: session.id } });
    return null;
  }
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    isAdmin: session.user.isAdmin,
  };
}

export async function requireUser(): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return user;
}

// Simple in-memory login rate limiter: 5 attempts / minute / IP
const attempts = new Map<string, { count: number; reset: number }>();

export function loginRateLimited(req: NextRequest): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.reset) {
    attempts.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  rec.count++;
  return rec.count > 5;
}
