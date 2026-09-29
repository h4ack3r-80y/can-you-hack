import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getModule, getProgressMap, PASS_MARK } from "@/lib/content";

// Lab checkers run in the browser simulator; the server records completion.
// Answer-based checks are verified here against content truth. Quiz grading is
// fully server-side. Modules must be unlocked (no skipping).

async function getOrCreateProgress(userId: string, pathId: string, moduleId: string) {
  let row = await db.progress.findUnique({
    where: { userId_pathId_moduleId: { userId, pathId, moduleId } },
  });
  if (!row) {
    row = await db.progress.create({ data: { userId, pathId, moduleId } });
  }
  return row;
}

function parseObjectives(row: { objectives: string }): string[] {
  try {
    const v = JSON.parse(row.objectives);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;

  const body = await req.json().catch(() => ({}));
  const { action, pathId, moduleId } = body;
  if (!action || !pathId || !moduleId) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const found = await getModule(pathId, moduleId);
  if (!found) return NextResponse.json({ error: "Module not found." }, { status: 404 });
  const { module, path } = found;

  const map = await getProgressMap(user.id, pathId);
  const status = map.get(moduleId);
  if (!status?.unlocked) {
    return NextResponse.json({ error: "This module is locked. Complete the previous one first." }, { status: 403 });
  }

  if (action === "lesson") {
    await getOrCreateProgress(user.id, pathId, moduleId);
    await db.progress.update({
      where: { userId_pathId_moduleId: { userId: user.id, pathId, moduleId } },
      data: { lessonDone: true },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "lab-objective") {
    const { objectiveId, answer } = body;
    const obj = module.objectives.find((o) => o.id === objectiveId);
    if (!obj) return NextResponse.json({ error: "Objective not found." }, { status: 404 });

    // verify answer-based checks server-side
    if (obj.check.kind === "answer") {
      const given = String(answer ?? "").trim().toLowerCase();
      const ok = obj.check.answers.some((a) => a.toLowerCase() === given) ||
        obj.check.answers.some((a) => given.includes(a.toLowerCase()));
      if (!ok) return NextResponse.json({ error: "Not quite — check the hint and try again." }, { status: 400 });
    }
    // flag/manual checks: recorded from the simulator (client verified)

    const row = await getOrCreateProgress(user.id, pathId, moduleId);
    const done = new Set(parseObjectives(row));
    done.add(objectiveId);
    const allDone = module.objectives.every((o) => done.has(o.id));
    await db.progress.update({
      where: { userId_pathId_moduleId: { userId: user.id, pathId, moduleId } },
      data: {
        objectives: JSON.stringify([...done]),
        labDone: allDone,
      },
    });
    return NextResponse.json({ ok: true, labDone: allDone });
  }

  if (action === "quiz") {
    const answers: number[] = body.answers ?? [];
    if (!Array.isArray(answers) || answers.length !== module.quiz.length) {
      return NextResponse.json({ error: "Answer every question." }, { status: 400 });
    }
    let correct = 0;
    module.quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    const score = Math.round((correct / module.quiz.length) * 100);
    const passed = score >= PASS_MARK;

    const row = await getOrCreateProgress(user.id, pathId, moduleId);
    const best = Math.max(row.score ?? 0, score);
    await db.progress.update({
      where: { userId_pathId_moduleId: { userId: user.id, pathId, moduleId } },
      data: {
        score: best,
        quizPassed: row.quizPassed || passed,
      },
    });

    const mapAfter = await getProgressMap(user.id, pathId);
    const pathComplete = [...mapAfter.values()].every((s) => s.complete);
    return NextResponse.json({
      ok: true, score, passed, correct, total: module.quiz.length,
      pathComplete,
      explanations: module.quiz.map((q) => q.explain),
    });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  const pathId = new URL(req.url).searchParams.get("pathId");
  if (!pathId) return NextResponse.json({ error: "pathId required" }, { status: 400 });
  const rows = await db.progress.findMany({ where: { userId: user.id, pathId } });
  return NextResponse.json({
    progress: rows.map((r) => ({
      moduleId: r.moduleId,
      lessonDone: r.lessonDone,
      labDone: r.labDone,
      objectives: parseObjectives(r),
      score: r.score,
      quizPassed: r.quizPassed,
    })),
  });
}
