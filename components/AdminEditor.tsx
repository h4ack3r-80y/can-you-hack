"use client";
import { useEffect, useState } from "react";

interface PathMeta { id: string; title: string; modules: { id: string; title: string }[] }

export default function AdminEditor({ paths }: { paths: PathMeta[] }) {
  const [pathId, setPathId] = useState(paths[0]?.id || "");
  const [moduleId, setModuleId] = useState(paths[0]?.modules[0]?.id || "");
  const [field, setField] = useState<"lesson" | "quiz" | "lab">("lesson");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const modules = paths.find((p) => p.id === pathId)?.modules || [];

  const load = async () => {
    setMsg("");
    const res = await fetch(`/api/admin/content?pathId=${pathId}&moduleId=${moduleId}`);
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || "Load failed"); return; }
    const m = data.module;
    setValue(field === "lesson" ? m.lesson : JSON.stringify(field === "quiz" ? m.quiz : { labIntro: m.labIntro, objectives: m.objectives }, null, 2));
  };

  // Sync editor state from the fetched module (external system).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pathId, moduleId, field]);

  const save = async () => {
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathId, moduleId, field, value }),
      });
      const data = await res.json();
      setMsg(res.ok ? "✓ Saved. Live immediately." : data.error || "Save failed.");
    } catch { setMsg("Network error."); }
    finally { setBusy(false); }
  };

  const revert = async () => {
    if (!confirm("Revert to the built-in file version?")) return;
    await fetch(`/api/admin/content?pathId=${pathId}&moduleId=${moduleId}&field=${field}`, { method: "DELETE" });
    load();
    setMsg("Reverted to file version.");
  };

  const sel = "bg-panel border border-edge rounded-lg px-3 py-2.5 text-sm outline-none focus:border-neon";

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <label className="text-sm">Path
          <select value={pathId} onChange={(e) => { setPathId(e.target.value); const p = paths.find((x) => x.id === e.target.value); setModuleId(p?.modules[0]?.id || ""); }} className={`ml-2 ${sel}`}>
            {paths.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </label>
        <label className="text-sm">Module
          <select value={moduleId} onChange={(e) => setModuleId(e.target.value)} className={`ml-2 ${sel}`}>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </label>
        <label className="text-sm">Field
          <select value={field} onChange={(e) => setField(e.target.value as typeof field)} className={`ml-2 ${sel}`}>
            <option value="lesson">Lesson (markdown)</option>
            <option value="quiz">Quiz (JSON)</option>
            <option value="lab">Lab intro + objectives (JSON)</option>
          </select>
        </label>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={24}
        spellCheck={false}
        className="w-full bg-black border border-edge rounded-xl p-4 font-mono text-[13px] leading-relaxed outline-none focus:border-neon"
        aria-label={`${field} content editor`}
      />
      {msg && <p className="text-sm mt-2 text-zinc-300" role="status">{msg}</p>}
      <div className="flex flex-wrap gap-3 mt-4">
        <button onClick={save} disabled={busy} className="bg-neon text-black font-bold px-6 py-3 rounded-lg hover:bg-neon-dim disabled:opacity-50 min-h-[52px]">
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button onClick={revert} className="border border-edge hover:border-red-500 px-6 py-3 rounded-lg min-h-[52px]">Revert to file version</button>
      </div>
      <div className="mt-8 text-sm text-zinc-500 border-t border-edge pt-6">
        <p className="font-semibold text-zinc-300 mb-2">Content schema quick reference</p>
        <ul className="list-disc ml-5 space-y-1 font-mono text-xs">
          <li>quiz: array of {"{q, options[4], answer (index), explain}"}</li>
          <li>lab: {"{labIntro, objectives: [{id, text, check}]}"}</li>
          <li>check: {"{kind:'flag', flag, hint}"} | {"{kind:'answer', answers[], hint}"} | {"{kind:'manual', hint}"}</li>
          <li>Changes go live instantly — no rebuild needed.</li>
        </ul>
      </div>
    </div>
  );
}
