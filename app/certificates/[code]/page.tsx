import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { qrDataUrl, verifyUrl } from "@/lib/cert";
import PrintButton from "@/components/PrintButton";

export default async function CertificateViewPage({ params }: { params: Promise<{ code: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const { code } = await params;
  const cert = await db.certificate.findUnique({ where: { code }, include: { user: true } });
  if (!cert || cert.userId !== user.id) notFound();

  const url = verifyUrl(cert.code);
  const qr = await qrDataUrl(url);
  const issued = new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link href="/certificates" className="text-sm text-zinc-400 hover:text-white">← Back to certificates</Link>
        <PrintButton />
      </div>

      {/* Certificate — light theme so it prints beautifully */}
      <div className="bg-[#fdfcf8] text-zinc-900 rounded-2xl p-8 md:p-12 border-8 border-double border-amber-700/60 shadow-2xl print:shadow-none print:border-4">
        <div className="text-center">
          <Image src="/logo.png" alt="Tech Sol logo" width={72} height={72} className="rounded-2xl mx-auto mb-4" />
          <p className="font-mono text-xs tracking-[0.3em] text-amber-800">TECH SOL · CAN YOU HACK?</p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mt-3">Certificate of Completion</h1>
          <p className="text-zinc-600 mt-4">This certificate is proudly presented to</p>
          <p className="text-2xl md:text-4xl font-bold mt-2 font-serif">{cert.user.name}</p>
          <p className="text-zinc-600 mt-4">for successfully completing</p>
          <p className="text-xl md:text-2xl font-semibold mt-1 text-emerald-800">{cert.pathTitle}</p>
          <p className="text-sm text-zinc-500 mt-2">Issued on {issued}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-10 gap-6">
          <div className="text-center">
            <Image src="/signature.svg" alt="Signature of Shayan Ahmad" width={200} height={70} />
            <div className="border-t border-zinc-400 pt-1 mt-1">
              <p className="font-semibold text-sm">Shayan Ahmad</p>
              <p className="text-xs text-zinc-500">Founder — Tech Sol</p>
            </div>
          </div>
          <div className="text-center">
            <Image src={qr} alt={`QR code linking to ${url}`} width={120} height={120} className="mx-auto" />
            <p className="font-mono text-xs mt-2 font-bold tracking-wider">{cert.code}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Verify at<br />canyouhack.tech/verify</p>
          </div>
        </div>
      </div>

      <p className="no-print text-center text-xs text-zinc-600 font-mono mt-4">
        Tip: use your browser's Print → "Save as PDF" for a digital copy.
      </p>
    </main>
  );
}
