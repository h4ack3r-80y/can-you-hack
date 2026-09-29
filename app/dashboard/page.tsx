import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getPaths, getProgressMap } from "@/lib/content";
import { db } from "@/lib/db";
import { getScore, getRank } from "@/lib/points";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/Avatar";
import {
  CATEGORY_STYLE, IconArrowRight, IconBolt, IconCheck, IconCrown,
  IconTrophy, IconChart, IconMedal, IconLock,
} from "@/components/icons";

export default async function Dashboard() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const paths = await getPaths();

  const stats = await Promise.all(
    paths.map(async (p) => {
      const map = await getProgressMap(user.id, p.id);
      const done = [...map.values()].filter((s) => s.complete).length;
      const next = p.modules.find((m) => map.get(m.id)?.unlocked && !map.get(m.id)?.complete);
      return { p, done, total: p.modules.length, next, complete: done === p.modules.length };
    })
  );

  const certs = await db.certificate.findMany({ where: { userId: user.id }, orderBy: { issuedAt: "desc" } });
  const score = await getScore(user.id);
  const rank = await getRank(user.id);
  const totalDone = stats.reduce((a, s) => a + s.done, 0);
  const totalModules = stats.reduce((a, s) => a + s.total, 0);
  const overallPct = totalModules ? Math.round((totalDone / totalModules) * 100) : 0;
  const continueWith = stats.find((s) => !s.complete && s.next);
  const firstName = user.name.split(" ")[0];

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      {/* header */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-5 mb-8">
          <Avatar userId={user.id} name={user.name} size={64} ext={user.avatar || ""} />
          <div className="flex-1 min-w-[220px]">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome back, {firstName}</h1>
            <p className="text-zinc-500 mt-1">Your mission control — track every hack, flag, and certificate.</p>
          </div>
          <Link href="/leaderboard" className="btn-ghost !py-2.5 text-sm"><IconCrown size={17} /> Rankings</Link>
        </div>
      </Reveal>

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: IconBolt, label: "Points", value: score.points.toLocaleString(), color: "var(--accent)", sub: rank ? `Rank #${rank}` : "Unranked" },
          { icon: IconChart, label: "Overall progress", value: `${overallPct}%`, color: "#0ea5e9", sub: `${totalDone}/${totalModules} modules` },
          { icon: IconTrophy, label: "Certificates", value: String(certs.length), color: "#f59e0b", sub: `${score.quizzesPassed} quizzes passed` },
          { icon: IconMedal, label: "Modules done", value: String(score.modulesDone), color: "#f43f5e", sub: "across all paths" },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 70}>
            <div className="card p-5 h-full">
              <span className="inline-flex p-2.5 rounded-xl mb-3" style={{ background: `${s.color}1a`, color: s.color }}>
                <s.icon size={22} />
              </span>
              <p className="text-3xl font-extrabold tracking-tight">{s.value}</p>
              <p className="text-sm font-semibold text-zinc-400 mt-0.5">{s.label}</p>
              <p className="font-mono text-xs text-zinc-600 mt-1">{s.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* continue */}
      {continueWith && (
        <Reveal>
          <Link href={`/learn/${continueWith.p.id}/${continueWith.next!.id}`}
            className="card card-hover p-6 md:p-7 mb-10 flex flex-wrap items-center gap-5 group relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-neon-dim to-neon" aria-hidden />
            <span className="p-4 rounded-2xl bg-neon/10 text-neon anim-glow"><IconBolt size={28} /></span>
            <div className="flex-1 min-w-[220px]">
              <p className="eyebrow !text-[11px] mb-1">Continue learning</p>
              <p className="font-bold text-xl">{continueWith.next!.title}</p>
              <p className="text-sm text-zinc-500">{continueWith.p.title}</p>
            </div>
            <span className="btn-primary">Resume <IconArrowRight size={18} /></span>
          </Link>
        </Reveal>
      )}

      {/* per-path progress */}
      <Reveal className="flex items-center justify-between mb-5">
        <h2 className="font-extrabold text-2xl tracking-tight">Your progress</h2>
        <Link href="/paths" className="text-sm font-semibold text-neon-dim hover:text-neon inline-flex items-center gap-1">
          All paths <IconArrowRight size={16} />
        </Link>
      </Reveal>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
        {stats.map(({ p, done, total, complete }, i) => {
          const pct = Math.round((done / total) * 100);
          const style = CATEGORY_STYLE[p.track];
          const CatIcon = style.icon;
          return (
            <Reveal key={p.id} delay={(i % 3) * 80}>
              <Link href={`/paths/${p.id}`} className="card card-hover p-6 block h-full group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2.5 rounded-xl" style={{ background: style.soft, color: style.color }}>
                    <CatIcon size={20} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold leading-tight truncate">{p.title}</p>
                    <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: style.color }}>{p.track} · {p.level}</p>
                  </div>
                  {complete && <span className="text-neon" title="Path complete"><IconCheck size={22} /></span>}
                </div>
                <div className="pbar h-3 rounded-full" style={{ background: "var(--edge)" }}
                  role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.title} progress`}>
                  <div className="pbar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${style.color}aa, ${style.color})` }} />
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <p className="font-mono text-xs text-zinc-500">{complete ? "Complete — certificate earned" : `${done}/${total} modules`}</p>
                  <p className="font-extrabold text-lg" style={{ color: style.color }}>{pct}%</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {/* certificates */}
      <Reveal className="flex items-center justify-between mb-5">
        <h2 className="font-extrabold text-2xl tracking-tight">Certificates</h2>
        <Link href="/certificates" className="text-sm font-semibold text-neon-dim hover:text-neon inline-flex items-center gap-1">
          View all <IconArrowRight size={16} />
        </Link>
      </Reveal>
      {certs.length === 0 ? (
        <Reveal>
          <div className="card p-10 text-center">
            <span className="inline-flex p-4 rounded-2xl bg-neon/10 text-neon mb-4"><IconTrophy size={30} /></span>
            <p className="font-bold text-lg mb-1">No certificates yet</p>
            <p className="text-zinc-500 mb-5">Complete a full path to earn your first verifiable certificate.</p>
            <Link href="/paths" className="btn-primary"><IconBolt size={18} /> Browse paths</Link>
          </div>
        </Reveal>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.slice(0, 3).map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <Link href={`/certificates/${c.code}`} className="card card-hover p-6 block">
                <span className="inline-flex p-2.5 rounded-xl bg-amber-500/10 text-amber-500 mb-4"><IconTrophy size={22} /></span>
                <p className="font-bold">{c.pathTitle}</p>
                <p className="font-mono text-xs text-zinc-500 mt-1.5">{c.code}</p>
                <p className="text-xs text-zinc-600 mt-2 inline-flex items-center gap-1"><IconLock size={12} /> Click to view & verify</p>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
