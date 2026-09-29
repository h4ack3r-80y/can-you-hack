"use client";
import { useState } from "react";
import type { QuizQuestion } from "@/content/types";
import { PASS_MARK } from "@/content/types";

export default function QuizPlayer({
  quiz,
  pathId,
  moduleId,
  alreadyPassed,
  bestScore,
  onPass,
}: {
  quiz: QuizQuestion[];
  pathId: string;
  moduleId: string;
  alreadyPassed: boolean;
  bestScore: number | null;
  onPass: (pathComplete: boolean) => void;
}) {
  const [answers, setAnswers] = useState<number[]>(Array(quiz.length).fill(-1));
  const [result, setResult] = useState<{ score: number; passed: boolean; explanations: string[]; pathComplete: boolean } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (answers.some((a) => a < 0)) { setError("Answer every question first."); return; }
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "quiz", pathId, moduleId, answers }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Couldn't submit.");
      else {
        setResult(data);
        if (data.passed) onPass(data.pathComplete);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div>
        <div className={`border rounded-xl p-6 text-center ${result.passed ? "border-green-800 bg-green-950/30" : "border-red-900 bg-red-950/30"}`} role="status">
          <p className="text-4xl font-extrabold font-mono">{result.score}%</p>
          <p className="mt-2 font-semibold">{result.passed ? "🎉 Passed! Module complete." : `Not yet — you need ${PASS_MARK}% to pass.`}</p>
          {!result.passed && <p className="text-sm text-zinc-400 mt-1">Review the explanations below and try again.</p>}
        </div>
        <div className="mt-6 space-y-4">
          {quiz.map((q, i) => (
            <div key={i} className="border border-edge rounded-xl p-4 bg-panel">
              <p className="font-semibold mb-1">{i + 1}. {q.q}</p>
              <p className={`text-sm ${answers[i] === q.answer ? "text-green-400" : "text-red-300"}`}>
                Your answer: {q.options[answers[i]]} {answers[i] === q.answer ? "✓" : "✗"}
              </p>
              {answers[i] !== q.answer && <p className="text-sm text-zinc-400">Correct: {q.options[q.answer]}</p>}
              <p className="text-sm text-zinc-500 mt-2">{result.explanations[i]}</p>
            </div>
          ))}
        </div>
        {!result.passed && (
          <button onClick={() => { setResult(null); setAnswers(Array(quiz.length).fill(-1)); }} className="mt-6 w-full sm:w-auto bg-neon text-black font-bold px-6 py-3 rounded-lg hover:bg-neon-dim min-h-[52px]">
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {alreadyPassed && (
        <p className="text-sm text-green-400 mb-4" role="status">✓ Already passed{bestScore != null && ` — best score ${bestScore}%`}. Retake to improve.</p>
      )}
      <div className="space-y-6">
        {quiz.map((q, qi) => (
          <fieldset key={qi} className="border border-edge rounded-xl p-5 bg-panel">
            <legend className="sr-only">Question {qi + 1}</legend>
            <p className="font-semibold mb-4">{qi + 1}. {q.q}</p>
            <div className="space-y-2" role="radiogroup" aria-label={`Question ${qi + 1}`}>
              {q.options.map((opt, oi) => (
                <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer min-h-[52px] ${answers[qi] === oi ? "border-neon bg-neon/10" : "border-edge hover:border-zinc-600"}`}>
                  <input
                    type="radio"
                    name={`q${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => setAnswers((a) => { const n = [...a]; n[qi] = oi; return n; })}
                    className="w-4 h-4 accent-green-500"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      {error && <p className="text-red-300 text-sm mt-4" role="alert">{error}</p>}
      <button onClick={submit} disabled={busy} className="mt-6 w-full sm:w-auto bg-neon text-black font-bold px-8 py-3.5 rounded-lg hover:bg-neon-dim disabled:opacity-50 min-h-[52px]">
        {busy ? "Grading…" : "Submit quiz"}
      </button>
      <p className="text-xs text-zinc-600 mt-2">Pass mark: {PASS_MARK}%</p>
    </div>
  );
}
