import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getPath, getProgressMap } from "@/lib/content";

export default async function PathDetailPage({ params }: { params: Promise<{ pathId: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const { pathId } = await params;
  const path = await getPath(pathId);
  if (!path) notFound();
  const map = await getProgressMap(user.id, pathId);
  const done = [...map.values()].filter((s) => s.complete).length;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-zinc-500 mb-4" aria-label="Breadcrumb">
        <Link href="/paths" className="hover:text-white">Paths</Link> → <span className="text-zinc-300">{path.title}</span>
      </nav>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">{path.title}</h1>
        <span className={`font-mono text-xs px-2.5 py-1 rounded-full ${path.level === "Beginner" ? "bg-green-950 text-green-300" : "bg-yellow-950 text-yellow-300"}`}>{path.level}</span>
      </div>
      <p className="text-zinc-400 mb-2">{path.tagline}</p>
      <p className="font-mono text-sm text-zinc-500 mb-8">{done}/{path.modules.length} modules complete</p>

      <ol className="space-y-3">
        {path.modules.map((m, i) => {
          const s = map.get(m.id)!;
          return (
            <li key={m.id}>
              {s.unlocked ? (
                <Link href={`/learn/${path.id}/${m.id}`} className={`flex items-center gap-4 border rounded-xl p-4 transition-colors ${s.complete ? "border-green-900 bg-green-950/20 hover:border-green-700" : "border-edge bg-panel hover:border-neon"}`}>
                  <span className={`font-mono text-sm w-8 h-8 grid place-items-center rounded-full shrink-0 ${s.complete ? "bg-green-900 text-green-200" : "bg-edge text-zinc-300"}`}>
                    {s.complete ? "✓" : i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="font-semibold block">{m.title}</span>
                    <span className="text-xs text-zinc-500 font-mono">~{m.minutes} min · {m.objectives.length} lab objectives · quiz</span>
                  </span>
                  <span className="text-zinc-500" aria-hidden>→</span>
                </Link>
              ) : (
                <div className="flex items-center gap-4 border border-edge/60 rounded-xl p-4 opacity-50" aria-label={`${m.title} (locked)`}>
                  <span className="font-mono text-sm w-8 h-8 grid place-items-center rounded-full bg-void border border-edge text-zinc-600 shrink-0" aria-hidden>🔒</span>
                  <span className="flex-1">
                    <span className="font-semibold block text-zinc-400">{m.title}</span>
                    <span className="text-xs text-zinc-600 font-mono">Complete the previous module to unlock</span>
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {done === path.modules.length && (
        <div className="mt-8 border border-green-800 bg-green-950/30 rounded-xl p-6 text-center">
          <p className="font-bold text-lg">🏆 Path complete!</p>
          <Link href="/certificates" className="inline-block mt-3 bg-neon text-black font-bold px-6 py-3 rounded-lg hover:bg-neon-dim">Get your certificate</Link>
        </div>
      )}
    </main>
  );
}
