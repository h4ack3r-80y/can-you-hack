import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getLeaderboard } from "@/lib/points";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/Avatar";
import { IconCrown, IconTrophy, IconMedal, IconBolt } from "@/components/icons";

const RANK_STYLE = [
  { ring: "#fbbf24", bg: "rgba(251,191,36,.12)", label: "#1" },
  { ring: "#94a3b8", bg: "rgba(148,163,184,.12)", label: "#2" },
  { ring: "#d97706", bg: "rgba(217,119,6,.12)", label: "#3" },
];

export default async function LeaderboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const board = await getLeaderboard(25);
  const myRank = board.findIndex((u) => u.id === user.id);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 md:py-14">
      <Reveal className="text-center mb-10">
        <span className="inline-flex p-4 rounded-2xl bg-amber-500/10 text-amber-500 mb-5 anim-float-soft"><IconCrown size={32} /></span>
        <p className="eyebrow mb-3">Hall of fame</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Rankings</h1>
        <p className="text-zinc-500 max-w-xl mx-auto">
          Earn <strong className="text-zinc-300">100 pts</strong> per completed module, up to{" "}
          <strong className="text-zinc-300">50 bonus</strong> for quiz scores, and{" "}
          <strong className="text-zinc-300">150 pts</strong> per certificate. Hack more, rank higher.
        </p>
      </Reveal>

      {board.length === 0 ? (
        <Reveal><div className="card p-10 text-center text-zinc-500">No hackers on the board yet — be the first.</div></Reveal>
      ) : (
        <div className="space-y-3">
          {board.map((u, i) => {
            const top = RANK_STYLE[i];
            const isMe = u.id === user.id;
            return (
              <Reveal key={u.id} delay={Math.min(i * 40, 400)}>
                <div className={`card p-4 md:p-5 flex items-center gap-4 ${isMe ? "!border-neon" : ""}`}
                  style={isMe ? { boxShadow: "0 0 24px -8px var(--hero-glow)" } : undefined}>
                  <span className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-mono font-extrabold"
                    style={top ? { background: top.bg, color: top.ring, border: `1.5px solid ${top.ring}` }
                               : { background: "var(--panel-2)", color: "var(--muted)", border: "1px solid var(--edge)" }}>
                    {i < 3 ? <IconMedal size={20} /> : u.rank}
                  </span>
                  <Avatar userId={u.id} name={u.name} size={44} ext={u.avatar || ""} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{u.name} {isMe && <span className="chip ml-1 !text-[10px]">you</span>}</p>
                    <p className="font-mono text-xs text-zinc-500">{u.modulesDone} modules · {u.certificates} certificates</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-xl tabular-nums" style={top ? { color: top.ring } : undefined}>
                      {u.points.toLocaleString()}
                    </p>
                    <p className="font-mono text-[11px] text-zinc-600 inline-flex items-center gap-1"><IconBolt size={11} /> pts</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      {myRank === -1 && (
        <Reveal className="text-center mt-8">
          <p className="text-zinc-500 mb-4">You&apos;re not on the board yet — complete a module to earn your first points.</p>
          <Link href="/paths" className="btn-primary"><IconTrophy size={18} /> Start earning</Link>
        </Reveal>
      )}
    </main>
  );
}
