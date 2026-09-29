import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getPaths, getProgressMap } from "@/lib/content";
import { db } from "@/lib/db";

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
  const totalDone = stats.reduce((a, s) => a + s.done, 0);
  const totalModules = stats.reduce((a, s) => a + s.total, 0);
  const continueWith = stats.find((s) => !s.complete && s.next);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name.split(" ")[0]}</h1>
      <p className="text-zinc-400 mb-8 font-mono text-sm">{totalDone}/{totalModules} modules · {certs.length} certificates</p>

      {continueWith && (
        <Link href={`/learn/${continueWith.p.id}/${continueWith.next!.id}`} className="block border border-neon/50 bg-neon/5 rounded-xl p-6 mb-8 hover:border-neon">
          <p className="font-mono text-xs text-neon-dim mb-1">CONTINUE LEARNING</p>
          <p className="font-bold text-lg">{continueWith.next!.title}</p>
          <p className="text-sm text-zinc-400">{continueWith.p.title}</p>
        </Link>
      )}

      <h2 className="font-bold text-xl mb-4">Your paths</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {stats.map(({ p, done, total, complete }) => {
          const pct = Math.round((done / total) * 100);
          return (
            <Link key={p.id} href={`/paths/${p.id}`} className="border border-edge rounded-xl p-5 bg-panel hover:border-neon">
              <p className="font-semibold">{p.title}</p>
              <div className="h-2 bg-edge rounded-full overflow-hidden mt-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.title} progress`}>
                <div className="h-full bg-neon" style={{ width: `${pct}%` }} />
              </div>
              <p className="font-mono text-xs text-zinc-500 mt-2">{complete ? "✓ Complete" : `${done}/${total} · ${pct}%`}</p>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">Certificates</h2>
        <Link href="/certificates" className="text-sm text-neon-dim hover:text-neon">View all →</Link>
      </div>
      {certs.length === 0 ? (
        <div className="border border-edge rounded-xl p-8 text-center text-zinc-500 bg-panel">
          <p className="text-3xl mb-2" aria-hidden>🏆</p>
          <p>No certificates yet — complete a path to earn your first one.</p>
          <Link href="/paths" className="inline-block mt-4 text-neon-dim hover:text-neon underline underline-offset-4">Browse paths</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.slice(0, 3).map((c) => (
            <Link key={c.id} href={`/certificates/${c.code}`} className="border border-edge rounded-xl p-5 bg-panel hover:border-neon">
              <p className="font-semibold text-sm">{c.pathTitle}</p>
              <p className="font-mono text-xs text-zinc-500 mt-1">{c.code}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
