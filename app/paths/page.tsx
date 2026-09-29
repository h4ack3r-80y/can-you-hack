import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { getPaths, getProgressMap } from "@/lib/content";
import { redirect } from "next/navigation";
import Reveal from "@/components/Reveal";
import { CATEGORY_STYLE, IconArrowRight, IconCheck, IconLock } from "@/components/icons";

const CATEGORIES = ["Pentesting", "Forensics", "Network Analysis"] as const;

export default async function PathsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const paths = await getPaths();

  const withProgress = await Promise.all(
    paths.map(async (p) => {
      const map = await getProgressMap(user.id, p.id);
      const done = [...map.values()].filter((s) => s.complete).length;
      const next = p.modules.find((m) => map.get(m.id)?.unlocked && !map.get(m.id)?.complete);
      return { p, done, total: p.modules.length, next, complete: done === p.modules.length };
    })
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      <Reveal>
        <p className="eyebrow mb-3">Curriculum</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Learning paths</h1>
        <p className="text-zinc-500 max-w-2xl">Six paths across three disciplines. Modules unlock in order — no skipping. Finish a path to earn its certificate.</p>
      </Reveal>

      <div className="space-y-10 mt-10">
        {CATEGORIES.map((cat, ci) => {
          const style = CATEGORY_STYLE[cat];
          const CatIcon = style.icon;
          const items = withProgress.filter(({ p }) => p.track === cat);
          const catDone = items.reduce((a, s) => a + s.done, 0);
          const catTotal = items.reduce((a, s) => a + s.total, 0);
          const catPct = catTotal ? Math.round((catDone / catTotal) * 100) : 0;
          return (
            <Reveal key={cat} delay={ci * 80}>
              <section aria-label={`${cat} paths`}>
                <div className="flex flex-wrap items-center gap-4 mb-5">
                  <span className="p-3 rounded-2xl" style={{ background: style.soft, color: style.color }}>
                    <CatIcon size={26} />
                  </span>
                  <div className="flex-1 min-w-[200px]">
                    <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                      {style.label}
                      <span className="font-mono text-xs font-bold px-2 py-1 rounded-full" style={{ background: style.soft, color: style.color }}>
                        {catPct}%
                      </span>
                    </h2>
                    <div className="pbar h-2 rounded-full mt-2 max-w-md" style={{ background: "var(--edge)" }}
                      role="progressbar" aria-valuenow={catPct} aria-valuemin={0} aria-valuemax={100} aria-label={`${style.label} overall progress`}>
                      <div className="pbar-fill" style={{ width: `${catPct}%`, background: `linear-gradient(90deg, ${style.color}cc, ${style.color})` }} />
                    </div>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">{catDone}/{catTotal} modules</span>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {items.map(({ p, done, total, next, complete }) => {
                    const pct = Math.round((done / total) * 100);
                    return (
                      <Link key={p.id} href={`/paths/${p.id}`} className="card card-hover p-6 md:p-7 block group">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <span className="chip" style={p.level === "Intermediate" ? { borderColor: `${style.color}66`, color: style.color } : undefined}>
                            {p.level}
                          </span>
                          {complete
                            ? <span className="inline-flex items-center gap-1.5 text-sm font-bold text-neon"><IconCheck size={18} /> Complete</span>
                            : <IconArrowRight size={20} className="text-zinc-600 group-hover:text-neon group-hover:translate-x-1 transition-all" />}
                        </div>
                        <h3 className="text-xl font-bold mb-1.5">{p.title}</h3>
                        <p className="text-sm text-zinc-500 mb-5 line-clamp-2">{p.tagline}</p>
                        <div className="pbar h-2.5 rounded-full" style={{ background: "var(--edge)" }}
                          role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.title} progress`}>
                          <div className="pbar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${style.color}bb, ${style.color})` }} />
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <p className="font-mono text-xs text-zinc-500">{done}/{total} modules · {pct}%</p>
                          {next && !complete && (
                            <p className="text-xs text-zinc-500 inline-flex items-center gap-1">
                              <IconLock size={13} /> Next: <span className="text-zinc-300 font-semibold truncate max-w-[180px]">{next.title}</span>
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
