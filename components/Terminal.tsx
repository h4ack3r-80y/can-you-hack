"use client";
import { useEffect, useRef, useState } from "react";
import { SimEngine } from "@/lib/sim/engine";

interface TerminalProps {
  onFlags?: (flags: string[]) => void;
  initialLines?: string[];
  compact?: boolean;
}

const SHORTCUTS = ["|", "-", "/", " ", "Tab"];

export default function Terminal({ onFlags, initialLines, compact }: TerminalProps) {
  const [engine] = useState(() => new SimEngine());
  const [lines, setLines] = useState<{ text: string; color: string }[]>([]);
  const [input, setInput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const flagsRef = useRef<Set<string>>(new Set());

  const print = (text: string, color = "text-zinc-200") =>
    setLines((prev) => [...prev.slice(-400), { text, color }]);

  const run = (cmd: string) => {
    print(engine.prompt() + cmd, "text-zinc-100");
    const out = engine.exec(cmd);
    if (out.some((l) => l.clear)) setLines([]);
    else out.forEach((l) => print(l.text, colorClass(l.color)));
    setPrompt(engine.prompt());
    const fresh = [...engine.flags].filter((f) => !flagsRef.current.has(f));
    if (fresh.length) {
      fresh.forEach((f) => flagsRef.current.add(f));
      onFlags?.([...engine.flags]);
    }
  };

  useEffect(() => {
    // Sync from the simulator engine (external system) on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrompt(engine.prompt());
    (initialLines ?? [
      "Can you Hack? virtual lab — type 'help' to see your tools.",
      "Kali: 192.168.56.10 · Target: 192.168.56.20 (simulated)",
      "",
    ]).forEach((l) => print(l, "text-zinc-500"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input;
    setInput("");
    setHistory((h) => [cmd, ...h].slice(0, 100));
    setHIdx(-1);
    run(cmd);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.min(hIdx + 1, history.length - 1);
      if (history[n] !== undefined) { setHIdx(n); setInput(history[n]); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = hIdx - 1;
      setHIdx(Math.max(n, -1));
      setInput(n >= 0 ? history[n] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cmds = ["help", "nmap", "ping", "telnet", "nc", "curl", "ssh", "smbclient", "file", "strings", "hexdump", "exiftool", "carve", "tshark", "notes", "ls", "cat", "whoami", "clear"];
      const match = cmds.find((c) => c.startsWith(input.trim()) && c !== input.trim());
      if (match) setInput(match + " ");
    }
  };

  return (
    <div className="term-shell term-dark overflow-hidden" onClick={() => inputRef.current?.focus()}>
      <div className="flex items-center gap-2 border-b border-edge px-4 py-2.5" aria-hidden>
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 font-mono text-xs text-zinc-500">kali@hacklab: virtual lab</span>
      </div>
      <div
        ref={outRef}
        className={`term-out overflow-y-auto p-4 font-mono text-[13px] leading-relaxed ${compact ? "h-72" : "h-[420px] md:h-[480px]"}`}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        tabIndex={0}
      >
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap break-all ${l.color}`}>{l.text || "\u00A0"}</div>
        ))}
      </div>
      <div className="flex gap-1 px-3 pb-1 md:hidden" aria-label="Terminal shortcut keys">
        {SHORTCUTS.map((s) => (
          <button
            key={s}
            type="button"
            className="flex-1 min-h-[44px] font-mono text-sm bg-panel border border-edge rounded-lg text-zinc-300"
            onClick={() => setInput((v) => v + (s === "Tab" ? " " : s))}
          >
            {s === " " ? "space" : s}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center px-4 pb-4 font-mono text-[13px]">
        <span className="whitespace-pre text-neon-dim shrink-0" aria-hidden>{prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          className="flex-1 bg-transparent outline-none text-zinc-100 min-w-0"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
      </form>
    </div>
  );
}

function colorClass(c?: string): string {
  switch (c) {
    case "green": return "text-green-400";
    case "red": return "text-red-400";
    case "yellow": return "text-yellow-300";
    case "cyan": return "text-cyan-300";
    case "dim": return "text-zinc-500";
    default: return "text-zinc-200";
  }
}
