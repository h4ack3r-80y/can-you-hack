"use client";
import { useMemo, useState } from "react";
import { CAPTURES } from "@/lib/sim/captures";

function matchesFilter(pkt: { src: string; dst: string; proto: string; info: string }, filter: string): boolean {
  const f = filter.trim().toLowerCase();
  if (!f) return true;
  // ip.addr == x / ip.src == x / ip.dst == x
  const m = f.match(/ip\.(addr|src|dst)\s*==\s*([\d.]+)/);
  if (m) {
    const [, field, ip] = m;
    if (field === "src") return pkt.src === ip;
    if (field === "dst") return pkt.dst === ip;
    return pkt.src === ip || pkt.dst === ip;
  }
  return `${pkt.src} ${pkt.dst} ${pkt.proto} ${pkt.info}`.toLowerCase().includes(f);
}

export default function PacketViewer({ captureId }: { captureId: string }) {
  const cap = CAPTURES[captureId];
  const [filter, setFilter] = useState("");
  const packets = useMemo(
    () => (cap ? cap.packets.filter((p) => matchesFilter(p, filter)) : []),
    [cap, filter]
  );
  if (!cap) return <p className="text-red-400">Unknown capture: {captureId}</p>;

  return (
    <div className="term-dark border border-edge rounded-xl overflow-hidden bg-black/60">
      <div className="p-4 border-b border-edge">
        <h3 className="font-bold">{cap.name}</h3>
        <p className="text-sm text-zinc-400 mt-1">{cap.desc}</p>
        <label className="block mt-3">
          <span className="text-xs font-mono text-zinc-500">DISPLAY FILTER — try: <code>http</code>, <code>dns</code>, <code>ip.addr == 192.168.56.10</code></span>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="e.g. dns"
            className="mt-1 w-full bg-panel border border-edge rounded-lg px-3 py-2.5 font-mono text-sm outline-none focus:border-neon text-[16px]"
            aria-label="Packet display filter"
          />
        </label>
        <p className="font-mono text-xs text-zinc-500 mt-2" role="status">
          {packets.length} of {cap.packets.length} packets shown
        </p>
      </div>
      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-edge">
              <th className="px-3 py-2 font-medium">No.</th>
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">Destination</th>
              <th className="px-3 py-2 font-medium">Proto</th>
              <th className="px-3 py-2 font-medium">Info</th>
            </tr>
          </thead>
          <tbody>
            {packets.map((p) => (
              <tr key={p.no} className="border-b border-edge/50 hover:bg-panel">
                <td className="px-3 py-1.5 text-zinc-500">{p.no}</td>
                <td className="px-3 py-1.5 text-zinc-400">{p.time}</td>
                <td className="px-3 py-1.5 text-cyan-300">{p.src}</td>
                <td className="px-3 py-1.5 text-cyan-300">{p.dst}</td>
                <td className="px-3 py-1.5 text-yellow-300">{p.proto}</td>
                <td className="px-3 py-1.5 text-zinc-300">{p.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* mobile cards */}
      <div className="md:hidden divide-y divide-edge/50">
        {packets.map((p) => (
          <div key={p.no} className="p-3 font-mono text-xs">
            <div className="flex justify-between text-zinc-500"><span>#{p.no}</span><span>t={p.time}s</span></div>
            <div className="mt-1"><span className="text-cyan-300">{p.src}</span> <span className="text-zinc-600">→</span> <span className="text-cyan-300">{p.dst}</span></div>
            <div className="mt-1"><span className="text-yellow-300">{p.proto}</span> <span className="text-zinc-300">{p.info}</span></div>
          </div>
        ))}
      </div>
      {packets.length === 0 && (
        <p className="p-6 text-center text-zinc-500 text-sm">No packets match. Try clearing the filter.</p>
      )}
    </div>
  );
}
