import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getPaths, getProgressMap } from "@/lib/content";
import { db } from "@/lib/db";
import { getScore, getRank } from "@/lib/points";
import PasswordChange from "@/components/PasswordChange";
import AvatarUpload from "@/components/AvatarUpload";
import NameEdit from "@/components/NameEdit";
import Reveal from "@/components/Reveal";
import {
  CATEGORY_STYLE, IconBolt, IconTrophy, IconCrown, IconChart,
  IconMedal, IconArrowRight, IconUser,
} from "@/components/icons";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const paths = await getPaths();
  const score = await getScore(user.id);
  const rank = await getRank(user.id);
  const certs = await db.certificate.findMany({ where: { userId: user.id }, orderBy: { issuedAt: "desc" } });

  const progress = await Promise.all(
    paths.map(async (p) => {
      const map = await getProgressMap(user.id, p.id);
      const done = [...map.values()].filter((s) => s.complete).length;
      return { p, done, total: p.modules.length };
    })
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 md:py-14">
      <Reveal>
        <p className="eyebrow mb-3">Account</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Profile</h1>
      </Reveal>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-6">
          {/* identity */}
          <Reveal>
            <section className="card p-6 md:p-7" aria-label="Identity">
              <h2 className="font-bold text-lg mb-5 inline-flex items-center gap-2"><IconUser size={19} className="text-neon" /> Identity</h2>
              <AvatarUpload userId={user.id} name={user.name} ext={user.avatar || ""} />
              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1.5">Display name</p>
                  <NameEdit initial={user.name} />
                </div>
                <div className="flex justify-between border-t border-edge pt-4">
                  <span className="text-zinc-500">Email</span><span className="font-mono">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Role</span>
                  <span className="font-semibold">{user.isAdmin ? "Founder (admin)" : "Student"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Member since</span>
                  <span>{user.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </section>
          </Reveal>

          {/* per-path progress */}
          <Reveal>
            <section className="card p-6 md:p-7" aria-label="Learning progress">
              <h2 className="font-bold text-lg mb-5 inline-flex items-center gap-2"><IconChart size={19} className="text-neon" /> Learning progress</h2>
              <div className="space-y-5">
                {progress.map(({ p, done, total }) => {
                  const pct = total ? Math.round((done / total) * 100) : 0;
                  const style = CATEGORY_STYLE[p.track];
                  return (
                    <div key={p.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <Link href={`/paths/${p.id}`} className="font-semibold text-sm hover:text-neon truncate pr-3">{p.title}</Link>
                        <span className="font-mono text-xs text-zinc-500 shrink-0">{done}/{total} · {pct}%</span>
                      </div>
                      <div className="pbar h-2.5 rounded-full" style={{ background: "var(--edge)" }}
                        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.title} progress`}>
                        <div className="pbar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${style.color}aa, ${style.color})` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </Reveal>

          <Reveal><PasswordChange /></Reveal>
        </div>

        {/* sidebar: score + certs */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Reveal>
            <section className="card p-6 overflow-hidden relative" aria-label="Score">
              <div className="absolute inset-0 pointer-events-none" aria-hidden
                style={{ background: "radial-gradient(300px 160px at 50% -40px, var(--hero-glow), transparent 70%)" }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg inline-flex items-center gap-2"><IconBolt size={19} className="text-neon" /> Score</h2>
                  {rank && <Link href="/leaderboard" className="chip !text-amber-500 !border-amber-500/40"><IconCrown size={13} /> Rank #{rank}</Link>}
                </div>
                <p className="text-5xl font-extrabold tracking-tight tabular-nums">{score.points.toLocaleString()}</p>
                <p className="font-mono text-xs text-zinc-500 mt-1 mb-5">total points</p>
                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between"><dt className="text-zinc-500 inline-flex items-center gap-1.5"><IconMedal size={15} /> Modules completed</dt><dd className="font-bold">{score.modulesDone}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-500 inline-flex items-center gap-1.5"><IconChart size={15} /> Quizzes passed</dt><dd className="font-bold">{score.quizzesPassed}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-500 inline-flex items-center gap-1.5"><IconTrophy size={15} /> Certificates</dt><dd className="font-bold">{score.certificates}</dd></div>
                </dl>
                <Link href="/leaderboard" className="btn-ghost w-full justify-center mt-6 !py-2.5 text-sm">View rankings <IconArrowRight size={16} /></Link>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="card p-6" aria-label="Certificates">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg inline-flex items-center gap-2"><IconTrophy size={19} className="text-amber-500" /> Certificates</h2>
                {certs.length > 3 && <Link href="/certificates" className="text-xs font-semibold text-neon-dim hover:text-neon">View all</Link>}
              </div>
              {certs.length === 0 ? (
                <p className="text-sm text-zinc-500">Complete a path to earn certificates — they&apos;ll appear here.</p>
              ) : (
                <ul className="space-y-3">
                  {certs.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      <Link href={`/certificates/${c.code}`} className="block rounded-xl border border-edge p-3.5 hover:border-neon transition-colors">
                        <p className="font-semibold text-sm">{c.pathTitle}</p>
                        <p className="font-mono text-[11px] text-zinc-500 mt-0.5">{c.code}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
