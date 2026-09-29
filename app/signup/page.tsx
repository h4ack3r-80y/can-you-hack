"use client";
import { useState } from "react";
import Link from "next/link";
import PasswordStrength from "@/components/PasswordStrength";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ethics, setEthics] = useState(false);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIssues([]);
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (!ethics) { setError("Please accept the ethics pledge."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, ethics }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed.");
        setIssues(data.issues || []);
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full bg-panel border border-edge rounded-lg px-4 py-3 text-[16px] outline-none focus:border-neon placeholder:text-zinc-600";

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Create your account</h1>
      <p className="text-zinc-400 mb-8">Free forever. Your lab, your progress, your certificates.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm text-zinc-300 mb-1.5">Full name</label>
          <input id="name" className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" required autoComplete="name" />
          <p className="text-xs text-zinc-600 mt-1">This exact name goes on your certificates.</p>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-zinc-300 mb-1.5">Email</label>
          <input id="email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="pw" className="block text-sm text-zinc-300 mb-1.5">Password</label>
          <input id="pw" type="password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" aria-describedby="pw-help" />
          <p id="pw-help" className="text-xs text-zinc-600 mt-1">Minimum 12 characters, mixing 3 of: uppercase, lowercase, numbers, symbols.</p>
          <PasswordStrength password={password} onSuggest={(pw) => { setPassword(pw); setConfirm(pw); }} />
        </div>
        <div>
          <label htmlFor="pw2" className="block text-sm text-zinc-300 mb-1.5">Confirm password</label>
          <input id="pw2" type="password" className={input} value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
        </div>
        <label className="flex gap-3 items-start text-sm text-zinc-300 bg-panel border border-edge rounded-lg p-4 cursor-pointer">
          <input type="checkbox" checked={ethics} onChange={(e) => setEthics(e.target.checked)} className="mt-1 w-4 h-4 accent-green-500" />
          <span>I pledge to use these skills <strong>only</strong> on systems I own or have written permission to test. <Link href="/ethics" className="text-neon-dim underline">Read the ethics pledge</Link></span>
        </label>
        {error && (
          <div className="text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-lg p-3" role="alert">
            {error}
            {issues.length > 0 && <ul className="mt-1 ml-4 list-disc">{issues.map((i) => <li key={i}>{i}</li>)}</ul>}
          </div>
        )}
        <button disabled={busy} className="w-full bg-neon text-black font-bold py-3.5 rounded-lg hover:bg-neon-dim disabled:opacity-50 min-h-[52px]">
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="text-sm text-zinc-500 mt-6 text-center">
        Already have an account? <Link href="/login" className="text-neon-dim hover:text-neon">Log in</Link>
      </p>
    </main>
  );
}
