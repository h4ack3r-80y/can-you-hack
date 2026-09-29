"use client";
import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Module, Path } from "@/content/types";
import Terminal from "@/components/Terminal";
import PacketViewer from "@/components/PacketViewer";
import QuizPlayer from "@/components/QuizPlayer";

interface Status {
  lessonDone: boolean;
  labDone: boolean;
  quizPassed: boolean;
  objectives: string[];
}

export default function ModulePlayer({
  path, module, index, total, initial, nextModuleId,
}: {
  path: Path;
  module: Module;
  index: number;
  total: number;
  initial: Status;
  nextModuleId: string | null;
}) {
  const [tab, setTab] = useState<"lesson" | "lab" | "quiz">("lesson");
  const [status, setStatus] = useState<Status>(initial);
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [certCode, setCertCode] = useState<string | null>(null);

  const moduleComplete = status.lessonDone && status.labDone && status.quizPassed;

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathId: path.id, moduleId: module.id, ...body }),
    });
    return { res, data: await res.json().catch(() => ({})) };
  };

  const markLesson = async () => {
    const { res } = await post({ action: "lesson" });
    if (res.ok) { setStatus((s) => ({ ...s, lessonDone: true })); setTab("lab"); }
  };

  const checkObjective = async (objectiveId: string, answer?: string) => {
    const { res, data } = await post({ action: "lab-objective", objectiveId, answer });
    if (res.ok) {
      setStatus((s) => {
        const objectives = s.objectives.includes(objectiveId) ? s.objectives : [...s.objectives, objectiveId];
        return { ...s, objectives, labDone: data.labDone || s.labDone };
      });
      setMsg("");
    } else {
      setMsg(data.error || "Couldn't verify. Try again.");
    }
  };

  const onFlags = (flags: string[]) => {
    for (const o of module.objectives) {
      if (o.check.kind === "flag" && flags.includes(o.check.flag) && !status.objectives.includes(o.id)) {
        checkObjective(o.id);
      }
    }
  };

  const claimCertificate = async () => {
    const res = await fetch("/api/certificates/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathId: path.id }),
    });
    const data = await res.json();
    if (res.ok) setCertCode(data.code);
  };

  const tabs = [
    { id: "lesson", label: `1. Learn ${status.lessonDone ? "✓" : ""}` },
    { id: "lab", label: `2. Practice ${status.labDone ? "✓" : ""}` },
    { id: "quiz", label: `3. Quiz ${status.quizPassed ? "✓" : ""}` },
  ] as const;

  return (
    <div>
      {/* breadcrumbs + progress */}
      <nav className="text-sm text-zinc-500 mb-4" aria-label="Breadcrumb">
        <Link href="/paths" className="hover:text-white">Paths</Link> →{" "}
        <Link href={`/paths/${path.id}`} className="hover:text-white">{path.title}</Link> →{" "}
        <span className="text-zinc-300">Module {index + 1}</span>
      </nav>
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono text-xs text-zinc-500">MODULE {index + 1} OF {total} · ~{module.minutes} MIN</p>
        {moduleComplete && <p className="font-mono text-xs text-green-400">✓ MODULE COMPLETE</p>}
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{module.title}</h1>

      {/* path-complete celebration */}
      {certCode ? (
        <div className="border border-green-800 bg-green-950/30 rounded-xl p-6 mb-6 text-center" role="status">
          <p className="text-2xl mb-2">🏆</p>
          <p className="font-bold text-lg">Path complete! Your certificate is ready.</p>
          <p className="font-mono text-sm text-zinc-400 mt-1">Code: {certCode}</p>
          <Link href="/certificates" className="inline-block mt-4 bg-neon text-black font-bold px-6 py-3 rounded-lg hover:bg-neon-dim">View my certificates</Link>
        </div>
      ) : null}

      {/* tabs */}
      <div className="flex gap-2 mb-6 border-b border-edge" role="tablist" aria-label="Module steps">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 font-semibold text-sm min-h-[52px] border-b-2 -mb-px ${tab === t.id ? "border-neon text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "lesson" && (
        <article>
          <div className="border border-edge rounded-xl p-6 md:p-8 bg-panel mb-6">
            <h2 className="font-bold mb-4 text-neon-dim">🎯 You will be able to…</h2>
            <ul className="list-disc ml-5 space-y-1 text-zinc-300 text-sm leading-relaxed">
              {module.outcomes.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </div>
          <div className="lesson-md border border-edge rounded-xl p-6 md:p-8 bg-panel">
            <ReactMarkdown>{module.lesson}</ReactMarkdown>
          </div>
          <button
            onClick={markLesson}
            disabled={status.lessonDone}
            className="mt-6 w-full sm:w-auto bg-neon text-black font-bold px-8 py-3.5 rounded-lg hover:bg-neon-dim disabled:bg-edge disabled:text-zinc-500 min-h-[52px]"
          >
            {status.lessonDone ? "✓ Lesson complete — continue to Practice" : "Mark lesson complete →"}
          </button>
        </article>
      )}

      {tab === "lab" && (
        <div>
          <p className="text-zinc-400 mb-6 leading-relaxed">{module.labIntro}</p>
          {(module.labKind === "terminal" || module.labKind === "mixed") && (
            <div className="mb-6"><Terminal onFlags={onFlags} compact={module.labKind === "mixed"} /></div>
          )}
          {(module.labKind === "packets" || module.labKind === "mixed") && module.captureId && (
            <div className="mb-6"><PacketViewer captureId={module.captureId} /></div>
          )}
          <h2 className="font-bold mb-3">Objectives</h2>
          {msg && <p className="text-yellow-300 text-sm mb-3" role="alert">{msg}</p>}
          <ul className="space-y-3">
            {module.objectives.map((o) => {
              const done = status.objectives.includes(o.id);
              return (
                <li key={o.id} className={`border rounded-xl p-4 ${done ? "border-green-800 bg-green-950/20" : "border-edge bg-panel"}`}>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 font-mono ${done ? "text-green-400" : "text-zinc-600"}`}>{done ? "✓" : "○"}</span>
                    <div className="flex-1">
                      <p className={done ? "text-zinc-400 line-through" : "text-zinc-100"}>{o.text}</p>
                      {!done && o.check.kind === "answer" && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                          <input
                            value={answerInputs[o.id] || ""}
                            onChange={(e) => setAnswerInputs((m) => ({ ...m, [o.id]: e.target.value }))}
                            placeholder="Type your answer…"
                            className="flex-1 bg-void border border-edge rounded-lg px-3 py-2.5 text-sm outline-none focus:border-neon text-[16px]"
                            aria-label={`Answer for: ${o.text}`}
                          />
                          <button onClick={() => checkObjective(o.id, answerInputs[o.id] || "")} className="bg-panel border border-edge hover:border-neon px-4 py-2.5 rounded-lg text-sm font-semibold min-h-[48px]">
                            Check
                          </button>
                        </div>
                      )}
                      {!done && o.check.kind === "manual" && (
                        <button onClick={() => checkObjective(o.id)} className="mt-3 bg-panel border border-edge hover:border-neon px-4 py-2.5 rounded-lg text-sm font-semibold min-h-[48px]">
                          Mark as done
                        </button>
                      )}
                      {!done && o.check.kind === "flag" && (
                        <p className="text-xs text-zinc-600 mt-2 font-mono">Hint: {o.check.hint}</p>
                      )}
                      {!done && o.check.kind !== "flag" && (
                        <p className="text-xs text-zinc-600 mt-2 font-mono">Hint: {o.check.hint}</p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {status.labDone && (
            <button onClick={() => setTab("quiz")} className="mt-6 w-full sm:w-auto bg-neon text-black font-bold px-8 py-3.5 rounded-lg hover:bg-neon-dim min-h-[52px]">
              Lab complete — take the quiz →
            </button>
          )}
        </div>
      )}

      {tab === "quiz" && (
        <QuizPlayer
          quiz={module.quiz}
          pathId={path.id}
          moduleId={module.id}
          alreadyPassed={status.quizPassed}
          bestScore={null}
          onPass={(pathComplete) => {
            setStatus((s) => ({ ...s, quizPassed: true }));
            if (pathComplete) claimCertificate();
          }}
        />
      )}

      {/* next */}
      {moduleComplete && (
        <div className="mt-10 border-t border-edge pt-6 flex flex-col sm:flex-row gap-3">
          {nextModuleId ? (
            <Link href={`/learn/${path.id}/${nextModuleId}`} className="bg-neon text-black font-bold px-6 py-3.5 rounded-lg hover:bg-neon-dim text-center min-h-[52px] inline-flex items-center justify-center">
              Next module →
            </Link>
          ) : (
            <Link href="/certificates" className="bg-neon text-black font-bold px-6 py-3.5 rounded-lg hover:bg-neon-dim text-center min-h-[52px] inline-flex items-center justify-center">
              View your certificate 🏆
            </Link>
          )}
          <Link href={`/paths/${path.id}`} className="border border-edge px-6 py-3.5 rounded-lg hover:border-neon text-center min-h-[52px] inline-flex items-center justify-center">
            Back to path
          </Link>
        </div>
      )}
    </div>
  );
}
