"use client";
import { useState } from "react";

export default function PasswordChange() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); setBusy(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const data = await res.json();
      setMsg(res.ok ? "✓ Password changed." : data.error || "Failed.");
      if (res.ok) { setCurrent(""); setNext(""); }
    } catch {
      setMsg("Network error.");
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full bg-panel border border-edge rounded-lg px-4 py-3 text-[16px] outline-none focus:border-neon";

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md">
      <h2 className="font-bold text-lg">Change password</h2>
      <div>
        <label htmlFor="cur" className="text-sm text-zinc-400">Current password</label>
        <input id="cur" type="password" className={input} value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
      </div>
      <div>
        <label htmlFor="nxt" className="text-sm text-zinc-400">New password (12+ chars, 3 of 4 character kinds)</label>
        <input id="nxt" type="password" className={input} value={next} onChange={(e) => setNext(e.target.value)} required autoComplete="new-password" />
      </div>
      {msg && <p className="text-sm text-zinc-300" role="status">{msg}</p>}
      <button disabled={busy} className="bg-panel border border-edge hover:border-neon px-5 py-3 rounded-lg font-semibold min-h-[52px]">
        {busy ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
