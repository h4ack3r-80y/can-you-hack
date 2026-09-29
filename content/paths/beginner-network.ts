import { Path } from "../types";

export const beginnerNetwork: Path = {
  id: "beginner-network",
  title: "Beginner — Network Analysis",
  level: "Beginner",
  track: "Network Analysis",
  tagline: "Learn to read the packets everyone else ignores.",
  modules: [
    {
      id: "how-networks-talk",
      title: "How Networks Talk",
      minutes: 15,
      outcomes: [
        "Explain what a packet is in plain words",
        "Describe the TCP/IP model simply",
        "Name the protocols you'll meet first: DNS, TCP, HTTP",
      ],
      lesson: `## Everything is packets

When you open a website, your computer doesn't send "a website". It chops the conversation into small chunks called **packets** — each stamped with a source, a destination, and a piece of the message. Routers forward them; your computer reassembles them.

Think of it like mailing a book one page at a time, each page in its own envelope with the address on it.

## The TCP/IP model (plain words)

| Layer | Job | Example |
|---|---|---|
| Application | what the user wants | HTTP, DNS |
| Transport | reliable delivery | TCP, UDP |
| Internet | addressing & routing | IP |
| Link | physical transfer | Ethernet, Wi-Fi |

You don't need to memorize this today — just know that packets carry **layers**, and analysts peel them like an onion.

## Your packet viewer

Open any capture in the lab's packet viewer (or run \`tshark -r web-normal\` in the terminal). Columns: number, time, source, destination, protocol, and info. In the next module, you'll read your first real conversation.`,
      labIntro: "Learn the vocabulary of packets before you read your first capture.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "What is a single chunk of data on a network called?", check: { kind: "answer", answers: ["packet", "a packet"], hint: "One word — it rhymes with 'racket'." } },
        { id: "o2", text: "Which protocol turns names like example.com into IP addresses?", check: { kind: "answer", answers: ["dns"], hint: "Three letters — the internet's phone book." } },
      ],
      quiz: [
        { q: "What is a packet?", options: ["A hacking tool", "A chunk of data with source and destination addresses", "A type of cable", "A password"], answer: 1, explain: "Packets are the envelopes data travels in." },
        { q: "What does DNS do?", options: ["Encrypts traffic", "Translates domain names to IP addresses", "Blocks hackers", "Speeds up Wi-Fi"], answer: 1, explain: "DNS is the internet's phone book." },
        { q: "Which layer handles reliable delivery?", options: ["Application", "Transport (TCP/UDP)", "Link", "Physical"], answer: 1, explain: "TCP lives at the transport layer." },
        { q: "Packets from one conversation…", options: ["Always arrive in order", "Can arrive out of order and get reassembled", "Never arrive", "Are always encrypted"], answer: 1, explain: "TCP reassembles them; that's its job." },
      ],
    },
    {
      id: "meet-the-packet",
      title: "Meet the Packet",
      minutes: 15,
      outcomes: [
        "Read a packet table: time, src, dst, protocol, info",
        "Follow a DNS lookup and a TCP handshake",
        "Describe what healthy traffic looks like",
      ],
      lesson: `## Your first capture

Open the **web-normal** capture: an ordinary user visiting a website. Ten packets. Boring — and that's the point. **You must know what normal looks like before you can spot evil.**

## The story, packet by packet

1. **DNS** (1–2): "Where is example.com?" → "93.184.216.34". Every web visit starts here.
2. **TCP handshake** (3–5): \`SYN\` → \`SYN, ACK\` → \`ACK\`. The three-way handshake opens every TCP conversation. Memorize it.
3. **TLS** (6–7): encrypted session setup. Note \`SNI=example.com\` — even encryption leaks the destination name.
4. **HTTP** (8–9): \`GET /\` → \`200 OK\`. The actual page.
5. **FIN** (10): polite goodbye.

## Healthy traffic has rhythm

DNS first, handshake, request, response, close. Short, purposeful, then quiet. When you later see a host chattering every 60 seconds to a strange IP — you'll feel it in your gut before you prove it.`,
      labIntro: "Open the web-normal capture and read a healthy conversation end to end.",
      labKind: "packets",
      captureId: "web-normal",
      objectives: [
        { id: "o1", text: "Which protocol resolves example.com first?", check: { kind: "answer", answers: ["dns"], hint: "Check packets 1–2." } },
        { id: "o2", text: "What IP does example.com resolve to?", check: { kind: "answer", answers: ["93.184.216.34"], hint: "Read the DNS response info." } },
        { id: "o3", text: "What flag does the very first TCP packet carry?", check: { kind: "answer", answers: ["syn"], hint: "Packet 3 — the handshake opener." } },
      ],
      quiz: [
        { q: "What starts almost every web visit?", options: ["A TCP handshake", "A DNS lookup", "An HTTP POST", "A ping"], answer: 1, explain: "Names must become IPs before anything connects." },
        { q: "The three-way handshake is…", options: ["SYN → SYN,ACK → ACK", "GET → POST → FIN", "DNS → DHCP → ARP", "Ping → Pong → Bye"], answer: 0, explain: "SYN, SYN-ACK, ACK opens every TCP conversation." },
        { q: "What does SNI reveal?", options: ["Passwords", "The destination hostname, even in encrypted traffic", "Nothing", "The user's name"], answer: 1, explain: "TLS leaks the hostname in the Client Hello." },
        { q: "Why learn 'normal' first?", options: ["It's fun", "You can't recognize evil without a baseline", "Exams require it", "No reason"], answer: 1, explain: "Anomaly detection starts with knowing normal." },
      ],
    },
    {
      id: "filters-are-superpowers",
      title: "Filters Are Superpowers",
      minutes: 15,
      outcomes: [
        "Write display filters: http, dns, ip.addr ==",
        "Narrow a capture to exactly the traffic you need",
        "Count matching packets",
      ],
      lesson: `## Drink from the firehose — carefully

Real captures have **millions** of packets. Nobody reads them one by one. Analysts use **display filters**: tiny expressions that show only matching packets.

## The three filters you'll use daily

| Filter | Shows |
|---|---|
| \`dns\` | only DNS packets |
| \`http\` | only HTTP packets |
| \`ip.addr == 192.168.56.50\` | only traffic to/from that IP |

Type one into the viewer's filter box and watch the table shrink. Combine ideas: start wide (\`dns\`), then narrow (\`ip.addr == x\`).

## Drill it

On the **web-normal** capture: filter \`dns\` — how many packets? Filter \`http\` — how many? Now write the filter that shows only traffic involving \`192.168.56.50\`. Filtering is a muscle; build it now while captures are small.`,
      labIntro: "Practice display filters on the web-normal capture until they're reflex.",
      labKind: "packets",
      captureId: "web-normal",
      objectives: [
        { id: "o1", text: "Apply the filter 'dns' — how many packets match?", check: { kind: "answer", answers: ["2", "two"], hint: "Type dns in the filter box." } },
        { id: "o2", text: "Apply the filter 'http' — how many packets match?", check: { kind: "answer", answers: ["2", "two"], hint: "Packets 8 and 9." } },
        { id: "o3", text: "Which filter shows only traffic involving 192.168.56.50?", check: { kind: "answer", answers: ["ip.addr == 192.168.56.50"], hint: "Format: ip.addr == <address>" } },
      ],
      quiz: [
        { q: "What does the filter 'dns' do?", options: ["Deletes DNS packets", "Shows only DNS packets", "Blocks DNS", "Encrypts DNS"], answer: 1, explain: "Display filters narrow what you see." },
        { q: "Which filter shows traffic for one IP?", options: ["ip == x", "ip.addr == x", "host = x", "filter x"], answer: 1, explain: "ip.addr == matches source OR destination." },
        { q: "Why filter instead of scrolling?", options: ["It's faster", "Real captures have millions of packets", "Scrolling is banned", "Filters look cool"], answer: 1, explain: "You can't eyeball a million packets." },
        { q: "Filter 'http' on web-normal matches…", options: ["0 packets", "2 packets", "10 packets", "5 packets"], answer: 1, explain: "Only the GET and the 200 OK." },
      ],
    },
    {
      id: "spot-the-scan",
      title: "Spot the Scan",
      minutes: 20,
      outcomes: [
        "Recognize a SYN scan in packet data",
        "Identify the scanner and the target",
        "Explain the SYN → SYN/ACK → RST pattern",
      ],
      lesson: `## Somebody is knocking on doors

Open the **port-scan** capture. Twenty packets, one conversation that isn't a conversation at all. This is what an **Nmap SYN scan** looks like on the wire — the same scan you ran in the pentesting path, now seen from the defender's chair.

## The fingerprint

Watch the pattern repeat, port after port:

1. Scanner → target: \`[SYN]\` — "are you there?"
2. Target → scanner: \`[SYN, ACK]\` — "yes, port open" (or \`[RST, ACK]\` — "closed")
3. Scanner → target: \`[RST]\` — hangs up **without completing the handshake**

That third step is the giveaway. Normal clients finish the handshake; scanners tear it down and move to the next port. Seven different destination ports in under a tenth of a second — no human browses like that.

## Your verdict

Name the scanner, name the target, count the ports. Then write it up like an analyst: *"At T+0, 192.168.56.10 began a SYN sweep of 192.168.56.20…"* — because someday that sentence goes in a real report.`,
      labIntro: "Open the port-scan capture. Someone is sweeping the target — prove it.",
      labKind: "packets",
      captureId: "port-scan",
      objectives: [
        { id: "o1", text: "Which IP is doing the scanning?", check: { kind: "answer", answers: ["192.168.56.10"], hint: "Who sends all the SYNs?" } },
        { id: "o2", text: "Which IP is being scanned?", check: { kind: "answer", answers: ["192.168.56.20"], hint: "Who receives them?" } },
        { id: "o3", text: "How many different ports were probed?", check: { kind: "answer", answers: ["7", "seven"], hint: "List each unique destination port." } },
      ],
      quiz: [
        { q: "What is a SYN scan?", options: ["A virus", "Probing ports with SYN packets without completing handshakes", "A firewall", "A DNS attack"], answer: 1, explain: "SYN → SYN/ACK → RST, port after port." },
        { q: "What gives the scanner away?", options: ["Speed", "The RST that aborts each handshake", "The IP address", "The color"], answer: 1, explain: "Normal clients complete handshakes; scanners hang up." },
        { q: "[RST, ACK] from the target means…", options: ["Port open", "Port closed", "Server crashed", "Nothing"], answer: 1, explain: "RST = 'go away', the port isn't listening." },
        { q: "Seven ports in 0.06 seconds suggests…", options: ["A human browsing", "An automated scan", "A video call", "Normal traffic"], answer: 1, explain: "No human moves that fast or that mechanically." },
      ],
    },
    {
      id: "dns-and-http",
      title: "DNS & HTTP",
      minutes: 15,
      outcomes: [
        "Trace a full web request: DNS → TCP → TLS → HTTP",
        "Read HTTP methods and status codes",
        "Use filters to isolate one conversation",
      ],
      lesson: `## Follow one request home

Back to **web-normal** — but this time you're not sightseeing, you're **tracing**. A user typed a URL. Prove, packet by packet, exactly what happened:

1. **DNS**: which name was asked, what IP came back?
2. **TCP**: who opened the connection, which ports?
3. **TLS**: what hostname leaked in SNI?
4. **HTTP**: which method fetched the page, what status came back?
5. **Close**: who said goodbye, and how?

## Think in flows

Analysts don't read packets — they read **flows**: all packets belonging to one conversation. Filter by the client IP, then read top to bottom. Every incident you'll ever investigate starts the same way: *pick one suspicious flow and follow it to the end.*

Answer the objectives from the capture. No guessing — cite packet numbers in your head like a professional.`,
      labIntro: "Trace the web-normal capture like an analyst following a single flow.",
      labKind: "packets",
      captureId: "web-normal",
      objectives: [
        { id: "o1", text: "Which website was visited?", check: { kind: "answer", answers: ["example.com"], hint: "The DNS query and SNI agree." } },
        { id: "o2", text: "What HTTP method fetched the page?", check: { kind: "answer", answers: ["get"], hint: "Packet 8." } },
        { id: "o3", text: "Which packet number carries the HTTP 200 OK?", check: { kind: "answer", answers: ["9", "packet 9"], hint: "Right after the GET." } },
      ],
      quiz: [
        { q: "What is a 'flow'?", options: ["A river", "All packets of one conversation", "A firewall rule", "A virus"], answer: 1, explain: "Analysts investigate flows, not lone packets." },
        { q: "HTTP GET means…", options: ["Send data", "Retrieve a resource", "Delete a page", "Log in"], answer: 1, explain: "GET fetches; POST sends." },
        { q: "After the HTTP response, how does the capture end?", options: ["RST storm", "A FIN handshake closing the connection", "More DNS", "Nothing"], answer: 1, explain: "Packet 10: FIN, ACK — polite goodbye." },
        { q: "The SNI value was…", options: ["google.com", "example.com", "hidden", "an IP"], answer: 1, explain: "SNI=example.com leaked in the Client Hello." },
      ],
    },
    {
      id: "incident-signs",
      title: "Incident Signs",
      minutes: 20,
      outcomes: [
        "Define beaconing and why malware does it",
        "Spot periodic C2 traffic in a capture",
        "Identify the infected host and its controller",
      ],
      lesson: `## The phone call home

Malware needs instructions. So infected machines **beacon**: they check in with their controller (C2) on a schedule — every 60 seconds, every 5 minutes — like clockwork. Open the **beaconing** capture and feel how wrong it looks next to normal traffic.

## What to look for

- **One internal host** → **one external IP**, over and over: \`192.168.56.30\` → \`203.0.113.99\`.
- **Metronome timing**: 0.2s, 60.2s, 120.2s, 180.2s. Humans are random; malware is punctual.
- **Identical size**: 412 bytes every time. Real browsing varies; beacons don't.
- **Encrypted** (TLS) — so you can't read it, but you don't need to. The *pattern* is the evidence.

## Why this matters

Beaconing is the #1 thing SOC analysts hunt. Firewalls see the connections; analysts see the rhythm. Your verdict: which host is infected, who controls it, and how often does it phone home? **Completing this module earns your certificate: Beginner — Network Analysis.**`,
      labIntro: "Open the beaconing capture. One host is calling home on a schedule — find it.",
      labKind: "packets",
      captureId: "beaconing",
      objectives: [
        { id: "o1", text: "Which internal host is infected?", check: { kind: "answer", answers: ["192.168.56.30"], hint: "Who keeps contacting the same external IP?" } },
        { id: "o2", text: "Which external IP is the controller (C2)?", check: { kind: "answer", answers: ["203.0.113.99"], hint: "The destination that never changes." } },
        { id: "o3", text: "How often does it beacon, in seconds?", check: { kind: "answer", answers: ["60", "60 seconds", "every 60 seconds"], hint: "Subtract consecutive beacon times." } },
      ],
      quiz: [
        { q: "What is beaconing?", options: ["A Wi-Fi feature", "Malware checking in with its controller on a schedule", "A DNS error", "A type of firewall"], answer: 1, explain: "Infected hosts phone home for instructions." },
        { q: "Which signs point to beaconing here?", options: ["Random timing", "Regular 60s interval, same size, same destination", "Large downloads", "Many DNS queries"], answer: 1, explain: "Punctual, identical, repeating = automated." },
        { q: "Why is the traffic encrypted?", options: ["To be polite", "To hide the stolen data and commands", "By accident", "It's not"], answer: 1, explain: "TLS hides content — but not the pattern." },
        { q: "The infected host is…", options: ["192.168.56.50", "192.168.56.30", "8.8.8.8", "93.184.216.34"], answer: 1, explain: ".30 is the metronome calling 203.0.113.99." },
      ],
    },
  ],
};
