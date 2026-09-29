import Link from "next/link";
import Image from "next/image";
import { getPaths } from "@/lib/content";

const TRACK_ICON: Record<string, string> = {
  Pentesting: "🎯",
  Forensics: "🔍",
  "Network Analysis": "🌐",
};

export default async function Home() {
  const paths = await getPaths();
  return (
    <main>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-16 md:pt-24 pb-12 text-center">
        <p className="font-mono text-sm text-neon-dim mb-4">$ whoami → future hacker</p>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Can you <span className="text-neon">Hack?</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 mt-5 max-w-2xl mx-auto">
          A free, open-source hacking lab for cybersecurity students. Learn pentesting,
          forensics, and network analysis — from absolute zero to intermediate — right
          in your browser. No installs. No VMs. No excuses.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/signup" className="bg-neon text-black font-bold px-8 py-4 rounded-xl hover:bg-neon-dim text-lg min-h-[56px] inline-flex items-center justify-center">
            Start hacking — free
          </Link>
          <Link href="/paths" className="border border-edge px-8 py-4 rounded-xl hover:border-neon text-lg min-h-[56px] inline-flex items-center justify-center">
            Browse learning paths
          </Link>
        </div>
        <p className="font-mono text-xs text-zinc-600 mt-6">⚖️ Education only — only test systems you own or have permission to test.</p>
      </section>

      {/* TERMINAL TEASER */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="border border-edge rounded-xl bg-black/90 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-edge px-4 py-2.5" aria-hidden>
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="p-5 font-mono text-sm leading-relaxed">
            <p><span className="text-neon-dim">┌──(kali㉿kali)-[~]</span></p>
            <p><span className="text-neon-dim">└─$</span> <span className="text-white">nmap -sV 192.168.56.20</span></p>
            <p className="text-zinc-400">21/tcp open  ftp     vsftpd 2.3.4  <span className="text-yellow-300">← backdoor?</span></p>
            <p className="text-zinc-400">6667/tcp open  irc   UnrealIRCd 3.2.8.1</p>
            <p className="text-zinc-400">445/tcp open  smb     Samba 3.0.20</p>
            <p className="text-zinc-500 mt-2"># this is a simulation — but the skills are real</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: "1", t: "Pick a path", d: "Beginner or Intermediate, in Pentesting, Forensics, or Network Analysis. Six guided paths, zero assumed knowledge." },
            { n: "2", t: "Learn by doing", d: "Short lessons, hands-on labs in a simulated Kali terminal, and quizzes. Modules unlock in order — no skipping." },
            { n: "3", t: "Earn certificates", d: "Finish a path and get a verifiable certificate with a unique code and QR — shareable on LinkedIn." },
          ].map((s) => (
            <div key={s.n} className="border border-edge rounded-xl p-6 bg-panel">
              <div className="font-mono text-neon text-2xl font-bold mb-3">{s.n}</div>
              <h3 className="font-bold text-lg mb-2">{s.t}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PATHS */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Six paths. Zero to intermediate.</h2>
        <p className="text-zinc-400 text-center mb-10">Every module: lesson → hands-on lab → quiz. Pass at 80% to unlock the next.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paths.map((p) => (
            <Link key={p.id} href={`/paths/${p.id}`} className="border border-edge rounded-xl p-6 bg-panel hover:border-neon transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl" aria-hidden>{TRACK_ICON[p.track]}</span>
                <span className={`font-mono text-xs px-2.5 py-1 rounded-full ${p.level === "Beginner" ? "bg-green-950 text-green-300" : "bg-yellow-950 text-yellow-300"}`}>
                  {p.level}
                </span>
              </div>
              <h3 className="font-bold text-lg group-hover:text-neon-dim">{p.title}</h3>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{p.tagline}</p>
              <p className="font-mono text-xs text-zinc-600 mt-4">{p.modules.length} modules · ~{p.modules.reduce((a, m) => a + m.minutes, 0)} min</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ETHICS */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="border border-yellow-900/60 bg-yellow-950/20 rounded-xl p-6 md:p-8 text-center">
          <h2 className="text-xl font-bold mb-3">⚖️ The hacker ethic</h2>
          <p className="text-zinc-300 leading-relaxed">
            These skills are powerful — and power needs rules. Every student pledges to use
            them only on systems they own or have written permission to test. Everything in
            this lab is simulated; the ethics are real.
          </p>
          <Link href="/ethics" className="inline-block mt-4 text-neon-dim hover:text-neon underline underline-offset-4">Read the full pledge</Link>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <Image src="/logo.png" alt="Tech Sol logo" width={64} height={64} className="rounded-2xl mx-auto mb-4" />
        <p className="text-zinc-400">Built by <strong className="text-white">Shayan Ahmad</strong>, founder of <strong className="text-white">Tech Sol</strong> — for every student who can&apos;t afford a lab.</p>
        <p className="font-mono text-xs text-zinc-600 mt-2">Open source · MIT licensed</p>
      </section>
    </main>
  );
}
