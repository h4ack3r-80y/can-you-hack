import type { Module } from "../../types";

export const beginnerForensicsRoom: Module = {
  id: "usb-drop",
  title: "The USB Drop",
  minutes: 25,
  outcomes: [
    "Triage unknown files with file, strings and hexdump",
    "Carve a hidden file out of an image",
    "Record evidence without contaminating it",
  ],
  lesson: `## Found in the parking lot

Monday morning. Security finds a **USB stick** in the company parking lot, right by the back entrance. Nobody claims it. Your forensics lead hands it to you: *"Triage it. Don't plug it into your own machine — everything happens in the sandbox. Tell me what's on it and whether someone planted it on purpose."*

USB drops are a classic **social engineering** attack: curiosity does the attacker's work. Your job is the opposite of curiosity — it's **methodical identification**.

## The triage order

Forensic analysts work in layers, cheapest test first:

1. **\`file\`** — reads magic bytes (the file's true fingerprint), not the extension. Attackers rename files; magic bytes don't lie.
2. **\`strings\`** — dumps readable text from binary files. Passwords, URLs, and taunts often sit in plain sight.
3. **\`hexdump\`** — shows you the raw bytes when nothing else makes sense. Learn to spot \`FFD8\` (JPEG start) and \`504B\` (ZIP/PK).
4. **\`carve\`** — pulls hidden files out of other files. A photo with a secret zipped inside it is called **steganography-by-appending**, and it's older than you think.

## Handle it like evidence

Two files came off the stick: \`evidence/mystery.bin\` and \`evidence/photo.jpg\`. Work through them in order, save your findings with \`notes add\`, and answer the one question that matters: **what did the attacker leave behind, and was the drop an accident?**`,
  labIntro: "Two files, one parking lot, zero trust. Triage them in the sandbox terminal.",
  labKind: "terminal",
  objectives: [
    { id: "o1", text: "Identify the true file type of photo.jpg", check: { kind: "answer", answers: ["jpeg", "jpg", "jpeg image"], hint: "Run: file evidence/photo.jpg" } },
    { id: "o2", text: "Carve the hidden file out of photo.jpg", check: { kind: "flag", flag: "carved_photojpg", hint: "Type: carve evidence/photo.jpg" } },
    { id: "o3", text: "Find the secret string hidden in mystery.bin", check: { kind: "answer", answers: ["sup3rs3cret!"], hint: "Run: strings evidence/mystery.bin" } },
    { id: "o4", text: "Write a triage summary in your field notes", check: { kind: "manual", hint: "Use: notes add <your summary of both files>" } },
  ],
  quiz: [
    { q: "Why use `file` before trusting a file extension?", options: ["Extensions are always wrong", "Magic bytes reveal the true format; extensions are just labels", "file is faster than ls", "Extensions are encrypted"], answer: 1, explain: "Anyone can rename evil.exe to photo.jpg — the magic bytes still say executable." },
    { q: "What does `strings` do?", options: ["Encrypts a file", "Extracts printable text from binary data", "Compresses a file", "Deletes hidden data"], answer: 1, explain: "Binaries often contain readable secrets — strings surfaces them." },
    { q: "What is file carving?", options: ["Deleting files securely", "Recovering hidden or embedded files from other files", "Cutting images into pieces", "Formatting a drive"], answer: 1, explain: "Carving scans raw bytes for known file headers and extracts what it finds." },
    { q: "Why not plug a found USB stick into your own computer?", options: ["It might be dirty", "It could auto-run malware — always use an isolated sandbox", "USB ports are fragile", "It's illegal to pick up"], answer: 1, explain: "USB drops are a social-engineering vector; triage happens in isolation, never on your workstation." },
  ],
};
