import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import Terminal from "@/components/Terminal";
import { CAPTURES } from "@/lib/sim/captures";

export default async function LabPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Terminal lab</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Free-play Kali terminal. Kali: <code className="font-mono text-neon-dim">192.168.56.10</code> · Target: <code className="font-mono text-neon-dim">192.168.56.20</code> ·
        Evidence: <code className="font-mono">evidence/</code> · Captures: <code className="font-mono">captures/</code>
      </p>
      <Terminal />
      <h2 className="font-bold text-lg mt-8 mb-3">Packet captures</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {Object.values(CAPTURES).map((c) => (
          <Link key={c.id} href={`/lab/packets?cap=${c.id}`} className="border border-edge rounded-xl p-4 bg-panel hover:border-neon">
            <p className="font-semibold text-sm">{c.name}</p>
            <p className="text-xs text-zinc-500 mt-1">{c.desc}</p>
            <p className="font-mono text-xs text-zinc-600 mt-2">{c.packets.length} packets</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
