"use client";
import { useState } from "react";
import { IconCheck, IconX } from "./icons";

export default function NameEdit({ initial }: { initial: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save.");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally { setBusy(false); }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg">{initial}</span>
        <button onClick={() => setEditing(true)} className="text-xs font-semibold text-neon-dim hover:text-neon underline underline-offset-4">
          Edit
        </button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} maxLength={60}
          className="bg-panel-2 border border-edge rounded-lg px-3 py-2 text-sm font-semibold focus:border-neon outline-none"
          aria-label="Display name" />
        <button onClick={save} disabled={busy} aria-label="Save name"
          className="p-2 rounded-lg bg-neon text-black hover:bg-neon-dim disabled:opacity-50"><IconCheck size={16} /></button>
        <button onClick={() => { setEditing(false); setValue(initial); setError(""); }} aria-label="Cancel"
          className="p-2 rounded-lg border border-edge text-zinc-400 hover:text-neon hover:border-neon"><IconX size={16} /></button>
      </div>
      {error && <p className="text-xs mt-1.5 font-semibold" style={{ color: "var(--danger)" }}>{error}</p>}
      <p className="text-xs text-zinc-600 mt-1.5">This name appears on your certificates.</p>
    </div>
  );
}
