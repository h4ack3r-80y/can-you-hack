import { Path } from "../types";
import { intermediateNetworkRoom } from "./rooms/intermediate-network-room";

export const intermediateNetwork: Path = {
  id: "intermediate-network",
  title: "Intermediate — Network Analysis",
  level: "Intermediate",
  track: "Network Analysis",
  tagline: "Hunt threats in traffic like a SOC analyst.",
  modules: [
    {
      id: "advanced-pcap",
      title: "Advanced pcap Analysis",
      minutes: 20,
      outcomes: [
        "Follow a TCP stream across many packets",
        "Explain reassembly: why order isn't guaranteed",
        "Reconstruct a full conversation from a capture",
      ],
      lesson: `## Beyond single packets

Beginners read packets; intermediate analysts read **streams**. A TCP stream is the full conversation reassembled: every segment in order, retransmissions removed, the message whole. Wireshark's "Follow TCP Stream" does this — here, you'll do it by eye on **web-normal**.

## Reassembly thinking

Packets 3–5 open the connection, 6–7 negotiate TLS, 8–9 carry the HTTP request and response, 10 closes it. But imagine them shuffled: networks **reorder, duplicate, and fragment** packets. TCP's sequence numbers let the receiver rebuild the original order — that's why every data packet carries \`Seq=\` and \`Ack=\` values.

## Your drill

Trace the stream: which packet *completes* the handshake (not starts it)? What exactly did the client ask for in packet 8? What ends the conversation? Answer from the capture, citing packet numbers. This "follow the stream" reflex is the foundation of everything after — C2 hunting, exfil analysis, incident reconstruction.`,
      labIntro: "Follow the web-normal TCP stream like Wireshark's 'Follow Stream' would.",
      labKind: "packets",
      captureId: "web-normal",
      objectives: [
        { id: "o1", text: "Which packet number completes the TCP handshake?", check: { kind: "answer", answers: ["5", "packet 5"], hint: "SYN, SYN-ACK, then…?" } },
        { id: "o2", text: "What exactly did the client request in packet 8?", check: { kind: "answer", answers: ["get /", "/", "get / http/1.1"], hint: "Read the info column of packet 8." } },
        { id: "o3", text: "What flags end the conversation in packet 10?", check: { kind: "answer", answers: ["fin", "fin, ack", "fin ack"], hint: "The polite goodbye flags." } },
      ],
      quiz: [
        { q: "What is a TCP stream?", options: ["A river", "A full conversation reassembled from its packets", "A video stream", "A firewall"], answer: 1, explain: "Streams rebuild the message from segments." },
        { q: "Why do packets carry sequence numbers?", options: ["For fun", "So the receiver can reorder and reassemble them", "To slow down", "No reason"], answer: 1, explain: "Networks shuffle packets; Seq numbers restore order." },
        { q: "Packet 5's ACK means…", options: ["Attack", "The handshake is complete — conversation open", "Goodbye", "Error"], answer: 1, explain: "SYN → SYN/ACK → ACK: the third packet seals it." },
        { q: "A retransmitted packet is…", options: ["An attack", "A normal resend when an ACK goes missing", "A virus", "Impossible"], answer: 1, explain: "TCP resends unacknowledged data — routine." },
      ],
    },
    {
      id: "ids-concepts",
      title: "IDS Concepts",
      minutes: 20,
      outcomes: [
        "Explain what an IDS does",
        "Read a Snort rule's anatomy",
        "Write a Snort rule detecting a port scan",
      ],
      lesson: `## Teaching the machine to watch

An **Intrusion Detection System** watches traffic and raises alerts on suspicious patterns — like the SYN scan you spotted manually, but at 3 AM, on millions of packets. **Snort** is the classic open-source IDS, and its rules are beautifully simple:

\`\`\`
alert tcp any any -> 192.168.56.20 any (msg:"SYN scan detected"; flags:S; sid:100001;)
\`\`\`

## Anatomy of a rule

| Part | Meaning |
|---|---|
| \`alert\` | action: raise an alert |
| \`tcp\` | protocol to match |
| \`any any -> 192.168.56.20 any\` | from anywhere to the target, any ports |
| \`msg:\` | human-readable alert text |
| \`flags:S\` | match SYN-only packets (scan fingerprint) |
| \`sid:\` | your rule's unique ID |

## Your turn

Re-open the **port-scan** capture, then write your own rule for it: start with the action and protocol. A good rule is *specific* (catches the scan) but not *noisy* (doesn't fire on normal browsing). That balance — detection vs false positives — is the entire art of IDS tuning.`,
      labIntro: "Study the port-scan capture, then write a Snort rule that would catch it.",
      labKind: "packets",
      captureId: "port-scan",
      objectives: [
        { id: "o1", text: "What is the first word of a Snort rule that raises an alert?", check: { kind: "answer", answers: ["alert"], hint: "It's the rule's action." } },
        { id: "o2", text: "Which protocol must your rule specify for this scan?", check: { kind: "answer", answers: ["tcp"], hint: "What protocol are the scan packets?" } },
        { id: "o3", text: "Type the start of your rule: action + protocol (e.g. 'alert tcp')", check: { kind: "answer", answers: ["alert tcp", "alert tcp any any"], hint: "Two words: action, then protocol." } },
      ],
      quiz: [
        { q: "What does an IDS do?", options: ["Blocks all traffic", "Watches traffic and alerts on suspicious patterns", "Speeds up networks", "Encrypts data"], answer: 1, explain: "Detection, not prevention — that's the IDS job." },
        { q: "In a Snort rule, msg: holds…", options: ["The attacker's name", "Human-readable alert text", "A password", "The IP"], answer: 1, explain: "msg is what the analyst reads at 3 AM." },
        { q: "flags:S matches…", options: ["All packets", "SYN-only packets — the scan fingerprint", "Big packets", "DNS"], answer: 1, explain: "Lone SYNs are the scanner's signature." },
        { q: "A rule that fires on normal browsing is…", options: ["Great", "Noisy — a false-positive problem", "Illegal", "Fast"], answer: 1, explain: "Alert fatigue makes analysts ignore real attacks." },
      ],
    },
    {
      id: "c2-exfiltration",
      title: "C2 & Exfiltration",
      minutes: 20,
      outcomes: [
        "Explain command-and-control (C2) channels",
        "Decode hex-encoded data hidden in DNS",
        "Reassemble a multi-query exfiltrated record",
      ],
      lesson: `## The thief's pipeline

**C2 (command and control)** is how attackers steer malware; **exfiltration** is how they steal data out. You saw both patterns in the beginner path — now combine them on the **dns-exfil** capture like a threat hunter.

## Reading the smuggling operation

Three TXT queries to \`evil.example.com\` carry hex labels. Decode each (hex pairs → ASCII):

- \`4a6f686e446f65313233\` → a username
- \`50617373776f72643d733363723374\` → a credential
- \`456e644f665265636f72642e\` → the end marker

One more TXT query later carries another record fragment. The attacker split the loot across queries to stay under the radar — small, innocent-looking, one at a time.

## The hunter's mindset

Ask: *who, what, where, how much?* Who is compromised (192.168.56.40), what was stolen (decode it), where did it go (evil.example.com), how much (count the TXT queries). Answer those four and you've written the core of an incident report.`,
      labIntro: "Dissect the dns-exfil capture: decode every label, reassemble the stolen record.",
      labKind: "packets",
      captureId: "dns-exfil",
      objectives: [
        { id: "o1", text: "Which host is compromised?", check: { kind: "answer", answers: ["192.168.56.40"], hint: "Who queries evil.example.com?" } },
        { id: "o2", text: "Decode the second label: 50617373776f72643d733363723374", check: { kind: "answer", answers: ["password=s3cr#t"], hint: "Hex → ASCII, pair by pair." } },
        { id: "o3", text: "Decode the end marker: 456e644f665265636f72642e", check: { kind: "answer", answers: ["endofrecord.", "endofrecord"], hint: "It literally says what it is." } },
      ],
      quiz: [
        { q: "What is C2?", options: ["A vitamin", "The channel attackers use to control malware", "A cable", "A cipher"], answer: 1, explain: "Command and control = the attacker's remote control." },
        { q: "What is exfiltration?", options: ["Installing software", "Stealing data out of a network", "A firewall", "Backing up"], answer: 1, explain: "Exfil = unauthorized data leaving." },
        { q: "Why split stolen data across many DNS queries?", options: ["For fun", "Small queries blend in and evade size-based detection", "DNS requires it", "No reason"], answer: 1, explain: "Low and slow beats one giant suspicious transfer." },
        { q: "The decoded credential was…", options: ["admin123", "Password=s3cr#t", "guest", "unknown"], answer: 1, explain: "5061…3774 decodes to Password=s3cr#t." },
      ],
    },
    {
      id: "encrypted-traffic",
      title: "Encrypted Traffic",
      minutes: 20,
      outcomes: [
        "Explain what TLS hides and what it leaks",
        "Use metadata (SNI, timing, sizes, endpoints) for analysis",
        "Assess a beaconing host from encrypted traffic alone",
      ],
      lesson: `## Encryption hides content, not behavior

TLS encrypts the *payload* — but the **metadata** stays visible: who talks to whom, when, how much, and (via SNI) often *where*. Analysts can't read the letters, but they can watch the mailman.

Re-open the **beaconing** capture and list what TLS *didn't* hide:

- **Endpoints**: 192.168.56.30 ↔ 203.0.113.99 — the relationship is public.
- **Timing**: every 60 seconds, metronome-steady. Humans aren't.
- **Sizes**: 412 bytes, identical each time. Real browsing varies wildly.
- **SNI** (from web-normal): the hostname leaks in the Client Hello.

## The analyst's verdict

You convicted this host in the beginner path without reading a single byte of content. That's the lesson: **behavior is evidence**. Defenders use this daily — and it's also why privacy advocates push for encrypted DNS and ECH (Encrypted Client Hello): to shrink what leaks.

Answer from the capture: what identifies the controller despite encryption, and what timing pattern proves automation?`,
      labIntro: "Re-examine the beaconing capture: convict the host using metadata alone.",
      labKind: "packets",
      captureId: "beaconing",
      objectives: [
        { id: "o1", text: "What still identifies the C2 server despite encryption?", check: { kind: "answer", answers: ["ip address", "destination ip", "the ip", "its ip"], hint: "Endpoints aren't encrypted." } },
        { id: "o2", text: "What timing pattern proves automation?", check: { kind: "answer", answers: ["every 60 seconds", "regular interval", "60 seconds", "60s interval"], hint: "Subtract consecutive beacon times." } },
        { id: "o3", text: "What did SNI leak in the web-normal capture?", check: { kind: "answer", answers: ["example.com", "the domain", "hostname", "the hostname"], hint: "The Client Hello's SNI field." } },
      ],
      quiz: [
        { q: "What does TLS hide?", options: ["Everything", "Payload content — but not metadata", "Nothing", "Only images"], answer: 1, explain: "Content encrypted; who/when/how-much visible." },
        { q: "Which metadata is visible in encrypted traffic?", options: ["Passwords", "Endpoints, timing, sizes, SNI", "Nothing at all", "File contents"], answer: 1, explain: "The envelope is public; only the letter is sealed." },
        { q: "Identical 412-byte messages every 60s indicate…", options: ["Video streaming", "Automated beaconing", "Human browsing", "A backup"], answer: 1, explain: "Punctual + uniform = machine, not human." },
        { q: "What is ECH (Encrypted Client Hello)?", options: ["A virus", "An effort to encrypt SNI and shrink metadata leaks", "A firewall", "A VPN"], answer: 1, explain: "Privacy tech keeps closing the leaks analysts use." },
      ],
    },
    {
      id: "threat-hunting",
      title: "Threat Hunting",
      minutes: 25,
      outcomes: [
        "Explain threat hunting vs alert-driven SOC work",
        "Form and test a hypothesis against capture data",
        "Profile one actor's full behavior",
      ],
      lesson: `## Hunting, not waiting

SOC analysts usually **react** to alerts. **Threat hunters** go looking: they form a hypothesis ("I think someone is exfiltrating via DNS") and test it against the data. No alert needed — just curiosity and method.

## Your hunt: profile the exfiltrator

Return to **dns-exfil** with a hunter's questions:

1. **Who?** 192.168.56.40 — confirmed by the evil.example.com queries.
2. **How do they blend in?** The same host also makes *normal* DNS queries (\`www.example.com\`, \`mail.example.com\`). Camouflage.
3. **How much?** Count the TXT queries to evil.example.com — that's the exfil volume in queries.
4. **What?** You decoded the labels last module — usernames, credentials.

## Hypothesis → evidence → verdict

Write it as a hunter would: *"Hypothesis: 192.168.56.40 is exfiltrating via DNS TXT. Evidence: 4 TXT queries to evil.example.com carrying hex-encoded credentials, interleaved with legitimate lookups. Verdict: confirmed — isolate the host."* That sentence structure — hypothesis, evidence, verdict — is the hunter's whole craft.`,
      labIntro: "Hunt the dns-exfil actor: hypothesis, evidence, verdict. No alert to guide you.",
      labKind: "mixed",
      captureId: "dns-exfil",
      objectives: [
        { id: "o1", text: "State your hypothesis in one sentence (as a note)", check: { kind: "flag", flag: "notes_used", hint: "notes add Hypothesis: <who> is <doing what> via <how>" } },
        { id: "o2", text: "How does the suspect blend in with normal traffic?", check: { kind: "answer", answers: ["normal dns", "legitimate queries", "normal lookups", "legitimate dns"], hint: "What else does 192.168.56.40 resolve?" } },
        { id: "o3", text: "How many TXT queries carried stolen data?", check: { kind: "answer", answers: ["4", "four"], hint: "Count TXT queries to evil.example.com." } },
      ],
      quiz: [
        { q: "Threat hunting differs from alert triage by…", options: ["It's slower", "Hunters proactively test hypotheses without waiting for alerts", "It needs no skill", "It's automated"], answer: 1, explain: "Hunting = curiosity-driven; triage = alert-driven." },
        { q: "A good hypothesis is…", options: ["Vague", "Specific and testable against data", "Secret", "Long"], answer: 1, explain: "'X is doing Y via Z' — then check." },
        { q: "The suspect blended in by…", options: ["Encrypting everything", "Mixing malicious queries with legitimate DNS lookups", "Going offline", "Deleting logs"], answer: 1, explain: "Camouflage: evil queries hidden among normal ones." },
        { q: "The hunter's verdict format is…", options: ["A guess", "Hypothesis → evidence → verdict", "Blame first", "Silence"], answer: 1, explain: "Structured reasoning others can verify." },
      ],
    },
    intermediateNetworkRoom,
    {
      id: "soc-shift",
      title: "SOC Shift — Triage Simulation",
      minutes: 30,
      outcomes: [
        "Triage multiple alerts by severity and confidence",
        "Prioritize: what gets handled first and why",
        "Write a concise incident note",
      ],
      lesson: `## Your first shift

It's 2 AM. Three alerts just fired. You're the analyst on duty, and everything is "urgent" — which means **you** decide what actually is.

## The queue

- **Alert 1 — port-scan capture**: a SYN sweep of 192.168.56.20 from 192.168.56.10. Recon — hostile intent, but no breach *yet*.
- **Alert 2 — beaconing capture**: 192.168.56.30 phoning 203.0.113.99 every 60 seconds. Likely **active compromise**.
- **Alert 3 — dns-exfil capture**: 192.168.56.40 smuggling credentials out via DNS TXT. Likely **active data theft**.

## Triage framework

For each alert, decide: **severity** (what's the worst case?), **confidence** (how sure am I?), **first action** (isolate host? block IP? escalate?). Rule of thumb: **active data theft > active compromise > recon**. A scanner is tomorrow's problem; an exfiltrator is *now*.

## The incident note

Write one note covering all three: priority order, one-line justification each, and your first action per alert. Clear, calm, actionable — the next shift should be able to execute it blind. **Completing this module earns your certificate: Intermediate — Network Analysis.**`,
      labIntro: "Three alerts, one analyst, 2 AM. Triage them all and write the shift note.",
      labKind: "mixed",
      objectives: [
        { id: "o1", text: "Triage the port-scan: priority and first action (as a note)", check: { kind: "manual", hint: "Recon — urgent? Or watch-and-log?" } },
        { id: "o2", text: "Triage the beaconing host: priority and first action (as a note)", check: { kind: "manual", hint: "Active C2 — what do you do first?" } },
        { id: "o3", text: "Triage the DNS exfil: priority and first action (as a note)", check: { kind: "manual", hint: "Data leaving NOW — what's the fastest containment?" } },
        { id: "o4", text: "Write one incident note ranking all three with justifications", check: { kind: "manual", hint: "Order + one line each + first actions." } },
      ],
      quiz: [
        { q: "Correct priority order?", options: ["Scan > beaconing > exfil", "Exfil > beaconing > scan", "Beaconing > scan > exfil", "All equal"], answer: 1, explain: "Active data theft beats active compromise beats recon." },
        { q: "First action for the exfiltrating host?", options: ["Watch it", "Isolate/contain the host immediately", "Email the attacker", "Reboot"], answer: 1, explain: "Stop the bleeding first, investigate second." },
        { q: "A good incident note is…", options: ["Long", "Clear, calm, actionable — executable by the next shift", "Vague", "Blaming"], answer: 1, explain: "The next analyst should act, not decode." },
        { q: "Why is the port scan lowest priority?", options: ["It's harmless", "Recon shows intent but no breach yet", "Scans are legal", "It's fast"], answer: 1, explain: "Intent ≠ impact. Handle active harm first." },
      ],
    },
  ],
};
