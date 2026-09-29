import { Path, Module, QuizQuestion, LabObjective, PASS_MARK } from "@/content/types";
import { beginnerPentesting } from "@/content/paths/beginner-pentesting";
import { beginnerForensics } from "@/content/paths/beginner-forensics";
import { beginnerNetwork } from "@/content/paths/beginner-network";
import { intermediatePentesting } from "@/content/paths/intermediate-pentesting";
import { intermediateForensics } from "@/content/paths/intermediate-forensics";
import { intermediateNetwork } from "@/content/paths/intermediate-network";
import { db } from "./db";

const FILE_PATHS: Path[] = [
  beginnerPentesting,
  beginnerForensics,
  beginnerNetwork,
  intermediatePentesting,
  intermediateForensics,
  intermediateNetwork,
];

/** Load all paths, applying founder ContentOverrides on top of file content. */
export async function getPaths(): Promise<Path[]> {
  const overrides = await db.contentOverride.findMany({ where: {} });
  const byKey = new Map(overrides.map((o) => [`${o.pathId}/${o.moduleId}/${o.field}`, o.value]));
  return FILE_PATHS.map((p) => ({
    ...p,
    modules: p.modules.map((m) => {
      const lesson = byKey.get(`${p.id}/${m.id}/lesson`);
      const quiz = byKey.get(`${p.id}/${m.id}/quiz`);
      const lab = byKey.get(`${p.id}/${m.id}/lab`);
      let quizParsed: QuizQuestion[] | undefined;
      let labParsed: { labIntro: string; objectives: LabObjective[] } | undefined;
      try { if (quiz) quizParsed = JSON.parse(quiz); } catch { /* keep file version */ }
      try { if (lab) labParsed = JSON.parse(lab); } catch { /* keep file version */ }
      return {
        ...m,
        ...(lesson ? { lesson } : {}),
        ...(quizParsed ? { quiz: quizParsed } : {}),
        ...(labParsed ? labParsed : {}),
      };
    }),
  }));
}

export async function getPath(pathId: string): Promise<Path | undefined> {
  return (await getPaths()).find((p) => p.id === pathId);
}

export async function getModule(pathId: string, moduleId: string): Promise<{ path: Path; module: Module; index: number } | undefined> {
  const path = await getPath(pathId);
  if (!path) return undefined;
  const index = path.modules.findIndex((m) => m.id === moduleId);
  if (index < 0) return undefined;
  return { path, module: path.modules[index], index };
}

// ---- Progression ----
export interface ModuleStatus {
  lessonDone: boolean;
  labDone: boolean;
  quizPassed: boolean;
  complete: boolean;
  unlocked: boolean;
}

export async function getProgressMap(userId: string, pathId: string): Promise<Map<string, ModuleStatus>> {
  const path = await getPath(pathId);
  if (!path) return new Map();
  const rows = await db.progress.findMany({ where: { userId, pathId } });
  const byModule = new Map(rows.map((r) => [r.moduleId, r]));
  const map = new Map<string, ModuleStatus>();
  path.modules.forEach((m, i) => {
    const r = byModule.get(m.id);
    const lessonDone = !!r?.lessonDone;
    const quizPassed = !!r?.quizPassed;
    // lab is done when every objective is done; stored as labDone once all checked
    const labDone = !!r?.labDone;
    const complete = lessonDone && labDone && quizPassed;
    const prevComplete = i === 0 || map.get(path.modules[i - 1].id)?.complete;
    map.set(m.id, { lessonDone, labDone, quizPassed, complete, unlocked: i === 0 || !!prevComplete });
  });
  return map;
}

export async function isPathComplete(userId: string, pathId: string): Promise<boolean> {
  const map = await getProgressMap(userId, pathId);
  if (map.size === 0) return false;
  return [...map.values()].every((s) => s.complete);
}

export { PASS_MARK };
