import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  const { name } = await req.json().catch(() => ({}));
  const clean = typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
  if (clean.length < 2 || clean.length > 60) {
    return NextResponse.json({ error: "Name must be 2–60 characters." }, { status: 400 });
  }
  await db.user.update({ where: { id: user.id }, data: { name: clean } });
  return NextResponse.json({ ok: true, name: clean });
}
