// Points & ranking — derived from server-recorded progress (no extra tables).
// 100 pts per completed module + up to 50 bonus from quiz score.
import { db } from "./db";
import { getPaths } from "./content";

export interface ScoreBreakdown {
  points: number;
  modulesDone: number;
  quizzesPassed: number;
  certificates: number;
}

export async function getScore(userId: string): Promise<ScoreBreakdown> {
  const paths = await getPaths();
  const rows = await db.progress.findMany({ where: { userId } });
  const byKey = new Map(rows.map((r) => [`${r.pathId}:${r.moduleId}`, r]));
  let points = 0, modulesDone = 0, quizzesPassed = 0;
  for (const p of paths) {
    for (const m of p.modules) {
      const r = byKey.get(`${p.id}:${m.id}`);
      if (!r) continue;
      const complete = r.lessonDone && r.labDone && r.quizPassed;
      if (complete) { modulesDone++; points += 100; }
      if (r.quizPassed) {
        quizzesPassed++;
        points += Math.round(((r.score ?? 80) / 100) * 50);
      }
    }
  }
  const certs = await db.certificate.findMany({ where: { userId } });
  points += certs.length * 150;
  return { points, modulesDone, quizzesPassed, certificates: certs.length };
}

export interface RankedUser {
  id: string;
  name: string;
  points: number;
  modulesDone: number;
  certificates: number;
  rank: number;
}

/** Top N users by points. Fine for a learning platform's scale. */
export async function getLeaderboard(limit = 25): Promise<RankedUser[]> {
  const paths = await getPaths();
  const allProgress = await db.progress.findMany({ where: {} });
  const allCerts = await db.certificate.findMany({ where: {} });
  const users = new Map<string, { points: number; modulesDone: number; certificates: number }>();

  const bump = (id: string) => {
    if (!users.has(id)) users.set(id, { points: 0, modulesDone: 0, certificates: 0 });
    return users.get(id)!;
  };

  const valid = new Set<string>();
  for (const p of paths) for (const m of p.modules) valid.add(`${p.id}:${m.id}`);

  for (const r of allProgress) {
    if (!valid.has(`${r.pathId}:${r.moduleId}`)) continue;
    const u = bump(r.userId);
    if (r.lessonDone && r.labDone && r.quizPassed) { u.modulesDone++; u.points += 100; }
    if (r.quizPassed) u.points += Math.round(((r.score ?? 80) / 100) * 50);
  }
  for (const c of allCerts) {
    const u = bump(c.userId);
    u.certificates++;
    u.points += 150;
  }

  const ranked = [...users.entries()]
    .map(([id, s]) => ({ id, ...s }))
    .sort((a, b) => b.points - a.points || b.modulesDone - a.modulesDone)
    .slice(0, limit);

  const result: RankedUser[] = [];
  for (let i = 0; i < ranked.length; i++) {
    const u = await db.user.findUnique({ where: { id: ranked[i].id } });
    if (!u) continue;
    result.push({ id: u.id, name: u.name, points: ranked[i].points, modulesDone: ranked[i].modulesDone, certificates: ranked[i].certificates, rank: i + 1 });
  }
  return result;
}

export async function getRank(userId: string): Promise<number | null> {
  const board = await getLeaderboard(1000);
  const me = board.find((u) => u.id === userId);
  return me ? me.rank : null;
}
