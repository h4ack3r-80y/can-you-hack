import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getModule } from "@/lib/content";

async function adminOr(res: unknown) {
  const user = await requireUser();
  if (user instanceof NextResponse) return { user: null as never, err: user };
  if (!user.isAdmin) return { user: null as never, err: NextResponse.json({ error: "Admin only." }, { status: 403 }) };
  return { user, err: null };
}

export async function GET(req: NextRequest) {
  const { user, err } = await adminOr(null);
  if (err) return err;
  const q = new URL(req.url).searchParams;
  const found = await getModule(q.get("pathId") || "", q.get("moduleId") || "");
  if (!found) return NextResponse.json({ error: "Module not found." }, { status: 404 });
  return NextResponse.json({ module: found.module });
}

export async function PUT(req: NextRequest) {
  const { user, err } = await adminOr(null);
  if (err) return err;
  const { pathId, moduleId, field, value } = await req.json().catch(() => ({}));
  if (!pathId || !moduleId || !["lesson", "quiz", "lab"].includes(field)) {
    return NextResponse.json({ error: "pathId, moduleId and field (lesson|quiz|lab) required." }, { status: 400 });
  }
  if (field === "quiz" || field === "lab") {
    try { JSON.parse(value); } catch {
      return NextResponse.json({ error: "quiz/lab must be valid JSON." }, { status: 400 });
    }
  }
  await db.contentOverride.upsert({
    where: { pathId_moduleId_field: { pathId, moduleId, field } },
    update: { value: String(value) },
    create: { pathId, moduleId, field, value: String(value) },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { user, err } = await adminOr(null);
  if (err) return err;
  const q = new URL(req.url).searchParams;
  await db.contentOverride.deleteMany({
    where: { pathId: q.get("pathId") || "", moduleId: q.get("moduleId") || "", field: q.get("field") || "" },
  });
  return NextResponse.json({ ok: true });
}
