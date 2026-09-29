"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import PacketViewer from "@/components/PacketViewer";
import { CAPTURES, CAPTURE_IDS } from "@/lib/sim/captures";

function PacketsInner() {
  const params = useSearchParams();
  const [cap, setCap] = useState(params.get("cap") || CAPTURE_IDS[0]);
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Captures">
        {Object.values(CAPTURES).map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={cap === c.id}
            onClick={() => setCap(c.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold border min-h-[48px] ${cap === c.id ? "border-neon bg-neon/10 text-white" : "border-edge text-zinc-400 hover:border-zinc-600"}`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <PacketViewer captureId={cap} />
      <p className="text-sm text-zinc-500 mt-4">
        Tip: the same captures are available in the terminal — try <code className="font-mono text-neon-dim">tshark -r {cap}</code>.
      </p>
    </div>
  );
}

export default function PacketsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-zinc-500 mb-4" aria-label="Breadcrumb">
        <Link href="/lab" className="hover:text-white">Terminal lab</Link> → <span className="text-zinc-300">Packet viewer</span>
      </nav>
      <h1 className="text-2xl font-bold mb-6">Packet viewer</h1>
      <Suspense><PacketsInner /></Suspense>
    </main>
  );
}
