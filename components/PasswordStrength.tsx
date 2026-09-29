"use client";
import { useMemo } from "react";
import { checkPassword, suggestPassphrase } from "@/lib/auth";

const LABELS = ["Very weak", "Weak", "Okay", "Strong", "Excellent"];
const COLORS = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-lime-400", "bg-green-500"];

export default function PasswordStrength({
  password,
  onSuggest,
}: {
  password: string;
  onSuggest: (pw: string) => void;
}) {
  const check = useMemo(() => checkPassword(password), [password]);
  if (!password) return null;
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" role="progressbar" aria-valuenow={check.score} aria-valuemin={0} aria-valuemax={4} aria-label="Password strength">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < check.score ? COLORS[check.score] : "bg-edge"}`} />
        ))}
      </div>
      <p className="text-xs mt-1.5 text-zinc-400">
        Strength: <span className="text-zinc-200 font-medium">{LABELS[check.score]}</span>
      </p>
      {check.issues.length > 0 && (
        <ul className="text-xs text-yellow-300/90 mt-1 space-y-0.5">
          {check.issues.map((issue) => <li key={issue}>• {issue}</li>)}
        </ul>
      )}
      <button
        type="button"
        className="text-xs text-neon-dim hover:text-neon mt-1.5 underline underline-offset-2"
        onClick={() => onSuggest(suggestPassphrase())}
      >
        Suggest a strong passphrase instead
      </button>
    </div>
  );
}
