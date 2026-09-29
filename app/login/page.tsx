"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Login failed.");
      else window.location.href = params.get("next") || "/dashboard";
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full bg-panel border border-edge rounded-lg px-4 py-3 text-[16px] outline-none focus:border-neon placeholder:text-zinc-600";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm text-zinc-300 mb-1.5">Email</label>
        <input id="email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </div>
      <div>
        <label htmlFor="pw" className="block text-sm text-zinc-300 mb-1.5">Password</label>
        <input id="pw" type="password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
      </div>
      {error && <div className="text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-lg p-3" role="alert">{error}</div>}
      <button disabled={busy} className="w-full bg-neon text-black font-bold py-3.5 rounded-lg hover:bg-neon-dim disabled:opacity-50 min-h-[52px]">
        {busy ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
      <p className="text-zinc-400 mb-8">Your lab missed you.</p>
      <Suspense><LoginForm /></Suspense>
      <p className="text-sm text-zinc-500 mt-6 text-center">
        New here? <Link href="/signup" className="text-neon-dim hover:text-neon">Create an account</Link>
      </p>
    </main>
  );
}
