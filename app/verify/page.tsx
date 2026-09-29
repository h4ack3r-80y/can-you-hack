"use client";
import { useState } from "react";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (c) window.location.href = `/verify/${encodeURIComponent(c)}`;
  };
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <p className="font-mono text-sm text-neon-dim mb-3">🔍 CERTIFICATE VERIFICATION</p>
      <h1 className="text-3xl font-bold mb-3">Is this certificate real?</h1>
      <p className="text-zinc-400 mb-8 text-sm">Enter the verification code printed on any "Can you Hack?" certificate.</p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CYH-2026-XXXXXXXXXXXXXXX"
          className="bg-panel border border-edge rounded-lg px-4 py-3.5 font-mono text-center tracking-widest outline-none focus:border-neon text-[16px]"
          aria-label="Certificate verification code"
        />
        <button className="bg-neon text-black font-bold py-3.5 rounded-lg hover:bg-neon-dim min-h-[52px]">Verify</button>
      </form>
    </main>
  );
}
