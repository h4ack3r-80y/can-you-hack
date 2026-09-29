import type { Module } from "../../types";

export const beginnerNetworkRoom: Module = {
  id: "three-am-alert",
  title: "3 AM Alert — The SOC Call",
  minutes: 25,
  outcomes: [
    "Spot beaconing behavior in a packet capture",
    "Recognize a SYN port-scan pattern",
    "Distinguish normal traffic from malicious traffic",
  ],
  lesson: `## Your phone rings at 3 AM

*"This is the SOC. Our IDS flagged something on the night shift — one workstation keeps phoning an outside server, and something else swept the network earlier. We need answers before the morning standup: which host is compromised, where is it calling, and how often?"*

You're the on-call analyst. Coffee helps. Packet captures help more.

## Beaconing: malware's heartbeat

Compromised machines **beacon** — they check in with their command-and-control (C2) server on a schedule, like a heartbeat. In a capture, beaconing looks like **the same two IPs talking at perfectly regular intervals** while everything else is irregular. Open the **beaconing** capture: one host makes short, identical TLS connections to an outside IP every 60 seconds. The other host in that capture is just a decoy doing normal browsing — learn to tell them apart.

## Port scans: the knock on every door

Earlier, something probed the target — a **SYN scan**, the first thing an attacker does: one host sends **SYN packets to many ports in rapid sequence**, and the target answers SYN-ACK (open) or RST (closed). You'll hunt a real scan capture in the intermediate track. For tonight, the quiz will test that you recognize the pattern.

## What the SOC needs

Three facts, no fluff: the **compromised internal host**, the **external C2 address** it's calling, and the **beacon interval**. Use the capture's display filter (\`dns\`, \`tcp\`, or an IP) to isolate the conversations, and check the timestamps — regularity is the smoking gun.`,
  labIntro: "One capture, one long night. Find the compromised host, its C2, the beacon rhythm — and the port it calls home on.",
  labKind: "packets",
  captureId: "beaconing",
  objectives: [
    { id: "o1", text: "Identify the compromised internal host", check: { kind: "answer", answers: ["192.168.56.30"], hint: "Open the beaconing capture — which host talks on a schedule?" } },
    { id: "o2", text: "Identify the external C2 address it calls", check: { kind: "answer", answers: ["203.0.113.99"], hint: "It's the outside IP in the beaconing capture" } },
    { id: "o3", text: "Determine the beacon interval in seconds", check: { kind: "answer", answers: ["60", "60s", "60 seconds"], hint: "Compare the timestamps of the repeated connections" } },
    { id: "o4", text: "Identify the destination port the C2 uses", check: { kind: "answer", answers: ["443", "port 443", "https"], hint: "Look at the TCP destination port in the beacon connections" } },
  ],
  quiz: [
    { q: "What makes beaconing suspicious in a capture?", options: ["Large downloads", "The same two hosts communicating at perfectly regular intervals", "Encrypted traffic", "DNS queries"], answer: 1, explain: "Humans are irregular; malware heartbeats are metronome-regular — that's the tell." },
    { q: "What does a SYN, SYN-ACK, RST sequence indicate?", options: ["A completed download", "A SYN scan probing a port", "A DHCP request", "A TLS handshake"], answer: 1, explain: "SYN to many ports in sequence with RST tear-downs is textbook reconnaissance." },
    { q: "Why is the second host in the beaconing capture NOT the suspect?", options: ["It uses HTTPS", "Its traffic is irregular — normal DNS and web browsing", "It has a higher IP", "It never sends packets"], answer: 1, explain: "Irregular DNS/HTTP at human-like times is normal traffic; only the metronome-regular TLS is malicious." },
    { q: "What should the SOC do first with the compromised host?", options: ["Delete all its files", "Isolate it from the network and preserve evidence", "Ignore it until morning", "Reinstall the OS immediately"], answer: 1, explain: "Contain first (isolate), then investigate — wiping destroys the evidence you need." },
  ],
};
