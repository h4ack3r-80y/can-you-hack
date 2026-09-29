import type { Module } from "../../types";

export const intermediateForensicsRoom: Module = {
  id: "the-insider",
  title: "The Insider",
  minutes: 30,
  outcomes: [
    "Correlate web logs with memory artifacts on a timeline",
    "Spot a masqueraded malicious process in a process list",
    "Decode data hidden in DNS queries",
  ],
  lesson: `## Someone on the inside helped them

A company suspects a breach — and worse, that an **insider** helped. You're handed three pieces of evidence: a web server log, a memory dump, and a packet capture. Separately they're noise. Together, they tell a story. Your job: build the **timeline**.

## Piece one: the web log

\`evidence/access.log\` is timestamped to the second. One outside IP — \`203.0.113.77\` — shows up at **09:14:55** probing \`/admin\`, then hits \`/login\`, then tries a path-traversal grab at \`/etc/passwd\`. That's not browsing; that's a break-in attempt, and the log tells you exactly when it started.

## Piece two: the memory dump

\`evidence/memdump.txt\` holds a process list. Look closely: \`svch0st.exe\` — with a **zero** where the 'o' should be. Real Windows uses \`svchost.exe\`. This is **masquerading**, malware wearing a trusted name as a disguise. It's PID **3133**, and its child is a PowerShell with an \`-enc\` (encoded) command — the classic sign of a payload hiding in plain sight.

## Piece three: the way out

The **dns-exfil** capture shows a workstation stuffing stolen data into DNS TXT queries to \`evil.example.com\`. The labels are hex — decode them and they spell out exactly what was taken.

## The analyst's product

Findings mean nothing until they're written down. Your final objective: a short incident timeline in your notes — **who, what, when** — because in forensics, the write-up IS the deliverable.`,
  labIntro: "Three evidence sources, one story. Correlate the log, the memory dump, and the DNS capture.",
  labKind: "mixed",
  captureId: "dns-exfil",
  objectives: [
    { id: "o1", text: "Identify the attacker's IP in access.log", check: { kind: "answer", answers: ["203.0.113.77"], hint: "cat evidence/access.log — which outside IP probes /admin?" } },
    { id: "o2", text: "Name the masqueraded process in the memory dump", check: { kind: "answer", answers: ["svch0st.exe"], hint: "Check memdump.txt — look for the zero that should be an 'o'" } },
    { id: "o3", text: "Decode the first secret hidden in the DNS capture", check: { kind: "answer", answers: ["johndoe123"], hint: "Open the dns-exfil capture and decode the hex labels" } },
    { id: "o4", text: "Write an incident timeline in your field notes", check: { kind: "manual", hint: "notes add: attacker IP, first-seen time, malicious process + PID, what was exfiltrated" } },
  ],
  quiz: [
    { q: "Why is svch0st.exe suspicious?", options: ["It uses too much RAM", "It mimics the legitimate svchost.exe with a zero instead of 'o' — masquerading", "It's in the wrong folder", "It has no PID"], answer: 1, explain: "Masquerading as trusted system processes is a standard malware persistence trick." },
    { q: "What does powershell.exe -enc indicate?", options: ["An encrypted hard drive", "A base64-encoded command — often used to hide malicious payloads", "A PowerShell update", "A network error"], answer: 1, explain: "-enc runs an encoded command string, a favorite obfuscation method for fileless malware." },
    { q: "Why hide stolen data inside DNS queries?", options: ["DNS is encrypted by default", "DNS is rarely blocked and rarely inspected — it blends in", "DNS is faster than HTTP", "DNS can't be logged"], answer: 1, explain: "Firewalls almost always allow DNS, so exfiltration over DNS slips past basic monitoring." },
    { q: "What makes the three evidence sources stronger together?", options: ["They're bigger files", "Timeline correlation turns isolated clues into a single narrative of the attack", "They're all text files", "More files means more evidence"], answer: 1, explain: "One artifact is a clue; correlated artifacts across log, memory, and network are a case." },
  ],
};
