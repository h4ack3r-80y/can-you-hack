import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { getPaths, getProgressMap } from "@/lib/content";
import { redirect } from "next/navigation";

const TRACK_ICON: Record<string, string> = { Pentesting: "🎯", Forensics: "🔍", "Network Analysis": "🌐" };

export default async function PathsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const paths = await getPaths();

  const withProgress = await Promise.all(
    paths.map(async (p) => {
      const map = await getProgressMap(user.id, p.id);
      const done = [...map.values()].filter((s) => s.complete).length;
      const next = p.modules.find((m) => map.get(m.id)?.unlocked && !map.get(m.id)?.complete);
      return { p, done, total: p.modules.length, next };
    })
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Learning paths</h1>
      <p className="text-zinc-400 mb-8">Six paths. Modules unlock in order — no skipping.</p>
      <div className="grid md:grid-cols-2 gap-5">
        {withProgress.map(({ p, done, total, next }) => {
          const pct = Math.round((done / total) * 100);
          return (
            <Link key={p.id} href={`/paths/${p.id}`} className="border border-edge rounded-xl p-6 bg-panel hover:border-neon transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl" aria-hidden>{TRACK_ICON[p.track]}</span>
                <span className={`font-mono text-xs px-2.5 py-1 rounded-full ${p.level === "Beginner" ? "bg-green-950 text-green-300" : "bg-yellow-950 text-yellow-300"}`}>{p.level}</span>
              </div>
              <h2 className="font-bold text-lg">{p.title}</h2>
              <p className="text-zinc-400 text-sm mt-1">{p.tagline}</p>
              <div className="mt-4">
                <div className="flex justify-between font-mono text-xs text-zinc-500 mb-1.5">
                  <span>{done}/{total} modules</span><span>{pct}%</span>
                </div>
                <div className="h-2 bg-edge rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.title} progress`}>
                  <div className="h-full bg-neon transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <p className="text-sm text-neon-dim mt-3">
                {done === total ? "✓ Complete — view certificate" : next ? `Continue: ${next.title} →` : `Start: ${p.modules[0].title} →`}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
