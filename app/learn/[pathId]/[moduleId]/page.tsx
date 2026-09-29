import { redirect, notFound } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getModule, getProgressMap } from "@/lib/content";
import { db } from "@/lib/db";
import ModulePlayer from "@/components/ModulePlayer";

function parseObjectives(v: string): string[] {
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ pathId: string; moduleId: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const { pathId, moduleId } = await params;

  const found = await getModule(pathId, moduleId);
  if (!found) notFound();
  const { path, module, index } = found;

  const map = await getProgressMap(user.id, pathId);
  const status = map.get(moduleId);
  if (!status?.unlocked) redirect(`/paths/${pathId}`); // no skipping

  const nextModuleId = index + 1 < path.modules.length ? path.modules[index + 1].id : null;

  const row = await db.progress.findUnique({
    where: { userId_pathId_moduleId: { userId: user.id, pathId, moduleId } },
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <ModulePlayer
        path={path}
        module={module}
        index={index}
        total={path.modules.length}
        initial={{
          lessonDone: status.lessonDone,
          labDone: status.labDone,
          quizPassed: status.quizPassed,
          objectives: row ? parseObjectives(row.objectives) : [],
        }}
        nextModuleId={nextModuleId}
      />
    </main>
  );
}
