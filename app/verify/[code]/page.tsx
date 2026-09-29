import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { isValidCodeFormat } from "@/lib/cert";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const cert = isValidCodeFormat(code)
    ? await db.certificate.findUnique({ where: { code }, include: { user: true } })
    : null;
  return {
    title: cert ? `${cert.user.name} — ${cert.pathTitle} | Can you Hack?` : "Verify certificate | Can you Hack?",
    description: cert
      ? `Verified certificate: ${cert.user.name} completed ${cert.pathTitle} (Tech Sol). Code ${cert.code}.`
      : "Verify a Can you Hack? certificate.",
    openGraph: {
      title: cert ? `🏆 ${cert.user.name} earned ${cert.pathTitle}` : "Certificate verification",
      description: cert ? `Issued by Tech Sol · Code ${cert.code}` : undefined,
      images: ["/logo.png"],
    },
  };
}

export default async function VerifyCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = code.toUpperCase();
  const full = isValidCodeFormat(normalized)
    ? await db.certificate.findUnique({ where: { code: normalized }, include: { user: true } })
    : null;

  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center">
      <Image src="/logo.png" alt="Tech Sol logo" width={56} height={56} className="rounded-2xl mx-auto mb-6" />
      {full ? (
        <div>
          <p className="inline-block font-mono text-sm font-bold px-4 py-2 rounded-full bg-green-950 text-green-300 border border-green-800" role="status">
            ✓ VALID CERTIFICATE
          </p>
          <h1 className="text-2xl font-bold mt-6">{full.user.name}</h1>
          <p className="text-zinc-400 mt-2">successfully completed</p>
          <p className="text-lg font-semibold text-neon-dim mt-1">{full.pathTitle}</p>
          <dl className="mt-6 text-sm text-zinc-500 space-y-1">
            <div><dt className="inline font-mono">Code: </dt><dd className="inline font-mono text-zinc-300">{full.code}</dd></div>
            <div><dt className="inline">Issued: </dt><dd className="inline">{new Date(full.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
            <div><dt className="inline">Issued by: </dt><dd className="inline">Tech Sol — Shayan Ahmad</dd></div>
          </dl>
        </div>
      ) : (
        <div>
          <p className="inline-block font-mono text-sm font-bold px-4 py-2 rounded-full bg-red-950 text-red-300 border border-red-900" role="status">
            ✗ NOT FOUND
          </p>
          <h1 className="text-2xl font-bold mt-6">No certificate with this code</h1>
          <p className="text-zinc-400 mt-2 text-sm">Check the code and try again — it looks like <code className="font-mono">CYH-2026-XXXXXX</code>.</p>
        </div>
      )}
      <Link href="/verify" className="inline-block mt-8 text-neon-dim hover:text-neon underline underline-offset-4 text-sm">Verify another code</Link>
    </main>
  );
}
