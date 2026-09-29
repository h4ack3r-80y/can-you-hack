import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getPath, isPathComplete } from "@/lib/content";
import { newVerificationCode } from "@/lib/cert";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  const { pathId } = await req.json().catch(() => ({}));
  const path = await getPath(pathId);
  if (!path) return NextResponse.json({ error: "Path not found." }, { status: 404 });

  if (!(await isPathComplete(user.id, pathId))) {
    return NextResponse.json({ error: "Complete every module in this path first." }, { status: 403 });
  }

  const existing = await db.certificate.findUnique({
    where: { userId_pathId: { userId: user.id, pathId } },
  });
  if (existing) return NextResponse.json({ ok: true, code: existing.code });

  const code = newVerificationCode();
  const cert = await db.certificate.create({
    data: { code, userId: user.id, pathId, pathTitle: path.title },
  });
  return NextResponse.json({ ok: true, code: cert.code });
}

export async function GET() {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  const certs = await db.certificate.findMany({
    where: { userId: user.id },
    orderBy: { issuedAt: "desc" },
  });
  return NextResponse.json({ certificates: certs });
}
