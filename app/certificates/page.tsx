import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { verifyUrl } from "@/lib/cert";

function linkedinUrl(code: string, pathTitle: string) {
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: `Can you Hack? — ${pathTitle}`,
    organizationName: "Tech Sol",
    credentialId: code,
    credentialUrl: verifyUrl(code),
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

export default async function CertificatesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const certs = await db.certificate.findMany({
    where: { userId: user.id },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">My certificates</h1>
      <p className="text-zinc-400 mb-8">Each certificate has a unique verification code anyone can check.</p>

      {certs.length === 0 ? (
        <div className="border border-edge rounded-xl p-10 text-center bg-panel">
          <p className="text-4xl mb-3" aria-hidden>🏆</p>
          <p className="text-zinc-400">No certificates yet.</p>
          <p className="text-sm text-zinc-500 mt-1">Complete all modules of a learning path to earn one.</p>
          <Link href="/paths" className="inline-block mt-5 bg-neon text-black font-bold px-6 py-3 rounded-lg hover:bg-neon-dim">Browse paths</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {certs.map((c) => (
            <div key={c.id} className="border border-edge rounded-xl p-6 bg-panel flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-lg">{c.pathTitle}</p>
                <p className="font-mono text-sm text-zinc-500 mt-1">{c.code}</p>
                <p className="text-xs text-zinc-600 mt-1">Issued {new Date(c.issuedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/certificates/${c.code}`} className="border border-edge hover:border-neon px-4 py-2.5 rounded-lg text-sm font-semibold min-h-[48px] inline-flex items-center">
                  View & print
                </Link>
                <a
                  href={linkedinUrl(c.code, c.pathTitle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0a66c2] text-white px-4 py-2.5 rounded-lg text-sm font-semibold min-h-[48px] inline-flex items-center hover:brightness-110"
                >
                  Add to LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
