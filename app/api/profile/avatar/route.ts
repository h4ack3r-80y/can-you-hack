import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const MAX_BYTES = 2 * 1024 * 1024;

function detectExt(buf: Buffer): "png" | "jpg" | "webp" | null {
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return "webp";
  return null;
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const form = await req.formData();
  const file = form.get("avatar");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be under 2 MB." }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = detectExt(buf);
  if (!ext) return NextResponse.json({ error: "Only PNG, JPEG, or WebP images are allowed." }, { status: 400 });

  const dir = join(process.cwd(), "public", "avatars");
  await mkdir(dir, { recursive: true });
  // remove any previous avatar in another format
  const { unlink } = await import("fs/promises");
  for (const e of ["png", "jpg", "webp"]) {
    if (e !== ext) await unlink(join(dir, `${user.id}.${e}`)).catch(() => {});
  }
  await writeFile(join(dir, `${user.id}.${ext}`), buf);

  // record extension so <Avatar> resolves the right file
  const { db } = await import("@/lib/db");
  await db.user.update({ where: { id: user.id }, data: { avatar: ext } });

  return NextResponse.json({ ok: true, ext });
}
