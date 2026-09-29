import type { Module } from "../../types";

export const intermediateNetworkRoom: Module = {
  id: "threat-hunt",
  title: "Threat Hunt — Hypothesis First",
  minutes: 35,
  outcomes: [
    "Run a hypothesis-driven threat hunt across captures",
    "Decode hex-encoded data exfiltrated over DNS",
    "Describe a Snort detection rule for a port scan",
  ],
  lesson: `## Hunting, not waiting

A SOC analyst waits for alerts. A **threat hunter** goes looking. The difference is the starting point: hunters begin with a **hypothesis** — "I believe an attacker is doing X, and if so I'd expect to see Y in the traffic" — then go prove or kill it with evidence.

Today you hunt across three captures with two hypotheses.

## Hypothesis 1: "Someone is mapping our network"

If an attacker is reconning, you'd expect **one host sending SYN packets to many ports on one target in rapid succession** — the pattern you learned to spot in your beginner training (SYN to port 21, SYN-ACK back, RST to tear down, then the same dance on 22, 23, 80, 445…). Now write it as a **detection rule**: a Snort rule has a header (action, protocol, source, destination) and options (message, flags). Describe yours — e.g. *"alert on TCP SYN packets from one source to 5+ ports on one host within seconds."*

## Hypothesis 2: "Data is leaving via DNS"

Normal DNS asks for A records of real domains. In the **dns-exfil** capture, one host (\`192.168.56.40\`) keeps asking for **TXT records** at \`evil.example.com\` — and the labels are long hex strings. Decode them: they spell out a username, a password, an account number, and an end-of-record marker. That's not name resolution; that's a **covert channel**.

## The verdict

A hunt ends with a verdict per hypothesis: **confirmed, refuted, or inconclusive** — plus the evidence that got you there. Guessing is not hunting. Evidence is.`,
  labIntro: "Two hypotheses, one live capture. Prove the DNS exfil with packets, decode the loot, and write the scan rule from your training.",
  labKind: "mixed",
  captureId: "dns-exfil",
  objectives: [
    { id: "o1", text: "Write a Snort-style rule description for the port scan", check: { kind: "manual", hint: "Describe: alert tcp, SYN flags, one source → many ports, your threshold and message" } },
    { id: "o2", text: "Decode the password hidden in the DNS capture", check: { kind: "answer", answers: ["password=s3cr#t"], hint: "Open the dns-exfil capture and hex-decode the TXT labels" } },
    { id: "o3", text: "Name the domain receiving the stolen data", check: { kind: "answer", answers: ["evil.example.com"], hint: "It's the destination domain of the TXT queries" } },
    { id: "o4", text: "Identify the internal host doing the exfiltration", check: { kind: "answer", answers: ["192.168.56.40"], hint: "Which internal IP sends the TXT queries?" } },
  ],
  quiz: [
    { q: "What is a threat-hunting hypothesis?", options: ["A guess you never test", "A testable statement about attacker behavior plus what evidence would prove it", "An IDS alert", "A firewall rule"], answer: 1, explain: "Hypothesis-driven hunting turns 'I think X' into 'the packets show X' — or kills the idea." },
    { q: "Why do attackers exfiltrate over DNS TXT records?", options: ["TXT records are encrypted", "DNS is almost never blocked, and TXT records can carry arbitrary data", "TXT is faster than HTTPS", "DNS can't be captured"], answer: 1, explain: "TXT records hold free-form text and DNS egress is rarely filtered — ideal covert channel." },
    { q: "What belongs in a Snort rule for this scan?", options: ["Action, protocol, SYN flag match, and a threshold like many ports from one source", "Only the attacker's name", "The full packet payload", "Nothing — Snort can't detect scans"], answer: 0, explain: "Detection rules match on patterns: TCP + SYN flags + one source hitting many ports = scan." },
    { q: "What ends a threat hunt?", options: ["A verdict per hypothesis — confirmed, refuted, or inconclusive — with evidence", "Deleting the captures", "Blocking the whole internet", "A new hypothesis"], answer: 0, explain: "Every hypothesis gets a verdict backed by packets; that's the hunt's deliverable." },
  ],
};
