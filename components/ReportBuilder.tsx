"use client";
import { useEffect, useMemo, useState } from "react";

const FINDINGS: Record<string, { title: string; severity: string; cvss: string; fix: string }> = {
  "recon-1": { title: "Host discovery & port scanning performed (Nmap)", severity: "Informational", cvss: "0.0", fix: "Firewall unnecessary ports; reduce exposed services." },
  "recon-2": { title: "Service enumeration revealed outdated software", severity: "Informational", cvss: "0.0", fix: "Keep an asset inventory; patch aggressively." },
  "first-blood": { title: "vsftpd 2.3.4 backdoor → unauthenticated remote root (CVE-2011-2523)", severity: "Critical", cvss: "9.8", fix: "Upgrade vsftpd to a maintained release; verify package signatures." },
  "passwords-101": { title: "Apache Tomcat manager default credentials → WAR deploy RCE", severity: "High", cvss: "8.8", fix: "Set strong unique passwords; restrict manager to localhost." },
};

export default function ReportBuilder() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [done, setDone] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/progress?pathId=beginner-pentesting")
      .then((r) => r.json())
      .then((d) => {
        const completed = (d.progress || [])
          .filter((p: { lessonDone: boolean; labDone: boolean; quizPassed: boolean }) => p.lessonDone && p.labDone && p.quizPassed)
          .map((p: { moduleId: string }) => p.moduleId);
        setDone(completed);
      })
      .catch(() => {});
  }, []);

  const selected = Object.keys(FINDINGS).filter((id) => done.includes(id));

  const markdown = useMemo(() => {
    const rows = selected.map((id, i) => {
      const f = FINDINGS[id];
      return [`### Finding ${i + 1} — ${f.title}`, ``, `- **Severity:** ${f.severity} (CVSS ${f.cvss})`, `- **Target:** 192.168.56.20 (simulated lab host)`, `- **Remediation:** ${f.fix}`, ``].join("\n");
    }).join("\n");
    return [
      `# Penetration Test Report — Can you Hack?`, ``,
      `| Tester | ${name || "[Your Name]"} |`, `| Date | ${date} |`,
      `| Target | 192.168.56.20 (simulated) |`, ``,
      `## Executive Summary`, ``,
      `A penetration test was performed against the simulated lab target. ${selected.length} attack-chain stages were completed, from reconnaissance to remote code execution. Findings are ordered by severity.`, ``,
      `## Findings`, ``, rows || "_No lab stages completed yet — go hack something first._", ``,
      `## Methodology`, ``,
      `Reconnaissance (Nmap), vulnerability analysis, manual exploitation, documentation. All testing performed against a simulated target in the browser.`, ``,
      `## Conclusion`, ``,
      `Unpatched services and default credentials lead directly to full host compromise. Prioritize patching and credential hygiene.`, ``,
      `*Generated with Can you Hack? Report Builder.*`, ``,
    ].join("\n");
  }, [name, date, selected]);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const download = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "canyouhack-pentest-report.md"; a.click();
    URL.revokeObjectURL(url);
  };

  const input = "w-full bg-panel border border-edge rounded-lg px-4 py-2.5 text-[16px] outline-none focus:border-neon";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label htmlFor="rname" className="font-mono text-xs text-zinc-500">TESTER NAME</label>
          <input id="rname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={`mt-1 ${input}`} />
        </div>
        <div>
          <label htmlFor="rdate" className="font-mono text-xs text-zinc-500">DATE</label>
          <input id="rdate" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`mt-1 ${input}`} />
        </div>
        <div>
          <p className="font-mono text-xs text-zinc-500">COMPLETED STAGES ({selected.length})</p>
          <div className="mt-2 space-y-2">
            {Object.entries(FINDINGS).map(([id, f]) => {
              const isDone = done.includes(id);
              return (
                <div key={id} className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm ${isDone ? "border-green-900 bg-green-950/20" : "border-edge text-zinc-600"}`}>
                  <span aria-hidden>{isDone ? "✓" : "○"}</span>
                  <span>{f.title}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={copy} className="bg-neon text-black font-bold px-5 py-3 rounded-lg hover:bg-neon-dim min-h-[52px]">{copied ? "✓ Copied!" : "Copy markdown"}</button>
          <button onClick={download} className="border border-edge px-5 py-3 rounded-lg hover:border-neon min-h-[52px]">Download .md</button>
        </div>
      </div>
      <div>
        <p className="font-mono text-xs text-zinc-500 mb-1">PREVIEW</p>
        <pre className="h-[480px] overflow-auto rounded-lg border border-edge bg-black p-4 font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">{markdown}</pre>
      </div>
    </div>
  );
}
