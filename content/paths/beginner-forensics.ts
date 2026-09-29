import { Path } from "../types";
import { beginnerForensicsRoom } from "./rooms/beginner-forensics-room";

export const beginnerForensics: Path = {
  id: "beginner-forensics",
  title: "Beginner — Digital Forensics",
  level: "Beginner",
  track: "Forensics",
  tagline: "Read the digital crime scene — files, photos, and logs.",
  modules: [
    {
      id: "what-forensics-is",
      title: "What Forensics Is",
      minutes: 15,
      outcomes: [
        "Explain what digital forensics is and where it is used",
        "State the chain-of-custody rule",
        "List the evidence files in your locker",
      ],
      lesson: `## Digital detective work

**Digital forensics** is the science of finding out *what happened* on a computer — after the fact, from the traces left behind. Forensic analysts work in incident response teams, law enforcement, and corporate security. When a company gets hacked, forensics answers: *who did it, what did they touch, and when?*

## The one rule: chain of custody

Evidence is useless if nobody trusts it. **Chain of custody** means documenting every step: who collected the evidence, when, and what was done with it. And the golden rule behind it:

> **Never alter the original evidence.** Work on copies. Document everything.

A single changed timestamp can get evidence thrown out of court — or send an investigation down the wrong path.

## Your evidence locker

This lab ships with fictional evidence files under \`evidence/\`:

- \`photo.jpg\` — a vacation photo… or is it?
- \`mystery.bin\` — an unknown binary
- \`access.log\` — a web server log
- \`memdump.txt\` — a slice of memory

Over the next modules you'll interrogate each one with real forensic commands: \`file\`, \`strings\`, \`exiftool\`, and more. Type \`help\` in the terminal to see them.`,
      labIntro: "Meet your evidence locker and learn the first rule of forensics.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "List the evidence locker and count the files", check: { kind: "answer", answers: ["4", "four"], hint: "Type: ls evidence/" } },
        { id: "o2", text: "State the first rule of handling evidence", check: { kind: "answer", answers: ["don't alter it", "do not alter it", "preserve it", "never modify it", "chain of custody", "don't change it"], hint: "Never change the original — work on copies." } },
      ],
      quiz: [
        { q: "What does digital forensics answer?", options: ["How to hack faster", "What happened on a system, from traces left behind", "How to write malware", "How to hide evidence"], answer: 1, explain: "Forensics reconstructs past events from digital traces." },
        { q: "What is chain of custody?", options: ["A type of handcuff", "Documenting who handled evidence and what was done with it", "A password policy", "A network cable"], answer: 1, explain: "It keeps evidence trustworthy from collection to court." },
        { q: "The golden rule of evidence handling is…", options: ["Alter it to test theories", "Never alter the original — work on copies", "Delete it when done", "Share it publicly"], answer: 1, explain: "One changed byte can destroy an investigation." },
        { q: "Which file is the web server log?", options: ["photo.jpg", "mystery.bin", "access.log", "memdump.txt"], answer: 2, explain: "access.log holds the web server's request history." },
      ],
    },
    {
      id: "files-lie",
      title: "Files Lie",
      minutes: 15,
      outcomes: [
        "Explain why file extensions can't be trusted",
        "Identify a file's true type with the file command",
        "Read magic bytes",
      ],
      lesson: `## Never trust the extension

\`totally-innocent.jpg.exe\`. Attackers rename files to fool humans — malware dressed as a photo, a script dressed as a document. The extension is just a **label**. The truth is inside the file.

## Magic bytes

Almost every file format starts with **magic bytes** — a signature. JPEGs start with \`ff d8 ff\`. Executables on Linux start with \`7f 45 4c 46\` (that's \`.ELF\` in ASCII). The \`file\` command reads these bytes and tells you the truth:

\`\`\`
file evidence/photo.jpg
file evidence/mystery.bin
\`\`\`

## Why this matters

In an investigation, a "photo" that is secretly an executable is a **red flag**. Malware loves disguises. Your first job with any unknown file: ask what it *really* is.

Try it now — check both files and compare what the extension claims versus what \`file\` reports.`,
      labIntro: "Interrogate two files. Trust the bytes, not the name.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "Identify the true type of photo.jpg", check: { kind: "answer", answers: ["jpeg", "jpeg image", "jpeg image data"], hint: "Type: file evidence/photo.jpg" } },
        { id: "o2", text: "Identify the true type of mystery.bin", check: { kind: "answer", answers: ["elf", "elf executable", "elf 64-bit", "executable"], hint: "Type: file evidence/mystery.bin" } },
      ],
      quiz: [
        { q: "Why can't you trust file extensions?", options: ["They're too long", "Anyone can rename a file — the extension is just a label", "They change daily", "They're encrypted"], answer: 1, explain: "A .jpg can secretly be an executable." },
        { q: "What are magic bytes?", options: ["Encrypted passwords", "Signature bytes at the start of a file identifying its format", "A hacking tool", "File permissions"], answer: 1, explain: "ff d8 ff = JPEG, 7f 45 4c 46 = ELF." },
        { q: "mystery.bin is actually…", options: ["A JPEG photo", "A Linux executable", "A text file", "An empty file"], answer: 1, explain: "file reports ELF 64-bit executable." },
        { q: "A 'photo' that is secretly an executable is…", options: ["Normal", "A red flag worth investigating", "Impossible", "A camera bug"], answer: 1, explain: "Malware loves disguises — investigate." },
      ],
    },
    {
      id: "strings-and-secrets",
      title: "Strings & Secrets",
      minutes: 15,
      outcomes: [
        "Extract readable text from any binary with strings",
        "Find hardcoded secrets in a binary",
        "Explain why hardcoded passwords are dangerous",
      ],
      lesson: `## Binaries talk

Even compiled programs contain readable text: error messages, prompts, file paths — and sometimes **secrets the developer left behind**. The \`strings\` command pulls every printable string out of a file:

\`\`\`
strings evidence/mystery.bin
\`\`\`

## The jackpot

Read the output slowly. You'll see \`Enter password:\`, \`Access granted.\`, \`Access denied.\` — and one line that makes a forensic analyst smile: a **hardcoded password**.

Developers hardcode passwords when they're lazy. Attackers (and analysts) find them with \`strings\` in seconds. That's why secrets belong in vaults and config — never baked into binaries.

## Your task

Run \`strings\` on the binary, find the password line, and save it to your field notes. In a real investigation, this is exactly how you'd recover a credential from a suspect program.`,
      labIntro: "Pull the secrets out of a binary. Somebody was careless.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "Find the hardcoded password in mystery.bin", check: { kind: "answer", answers: ["sup3rs3cret!", "password=sup3rs3cret!"], hint: "Type: strings evidence/mystery.bin" } },
        { id: "o2", text: "Save the password and binary name to your notes", check: { kind: "flag", flag: "notes_used", hint: "Type: notes add <what you found>" } },
      ],
      quiz: [
        { q: "What does the strings command do?", options: ["Encrypts files", "Extracts printable text from any file", "Deletes binaries", "Compresses data"], answer: 1, explain: "strings reveals hidden text inside binaries." },
        { q: "What secret was hardcoded in mystery.bin?", options: ["A username", "The password Sup3rS3cret!", "An IP address", "Nothing"], answer: 1, explain: "The line password=Sup3rS3cret! was baked into the binary." },
        { q: "Why are hardcoded passwords dangerous?", options: ["They're too long", "Anyone with the binary can read them with strings", "They expire", "They're hard to type"], answer: 1, explain: "Secrets in binaries are secrets shared with the world." },
        { q: "Where should secrets live instead?", options: ["In the binary", "In a secrets vault or protected config", "In the filename", "In comments"], answer: 1, explain: "Vaults and restricted configs — never baked into code." },
      ],
    },
    {
      id: "photo-evidence",
      title: "Photo Evidence",
      minutes: 20,
      outcomes: [
        "Read EXIF metadata with exiftool",
        "Explain what GPS metadata reveals",
        "Carve a hidden archive out of a JPEG",
      ],
      lesson: `## Photos remember everything

Every digital photo carries **EXIF metadata**: camera model, date taken, and often **GPS coordinates** of exactly where it was shot. \`exiftool\` reads it all:

\`\`\`
exiftool evidence/photo.jpg
\`\`\`

Check the GPS fields and the Comment. Photographers rarely realize how much they publish with each upload — investigators do.

## Steganography: hiding in plain sight

Now look at the \`strings\` output again… see \`PK\\x03\\x04\`? That's a **ZIP archive header** — inside a JPEG. Someone appended a hidden zip file to the photo. This is **steganography**: concealing data inside innocent-looking files.

Carve it out:

\`\`\`
carve evidence/photo.jpg
\`\`\`

\`carve\` scans for embedded file signatures and extracts them. Read what falls out — and ask yourself *why* someone hid it there.`,
      labIntro: "The photo is lying twice. Find the location, then find what's buried inside it.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "Read the photo's EXIF — what comment did the photographer leave?", check: { kind: "answer", answers: ["nothing to see here", "nothing to see here :)"], hint: "Type: exiftool evidence/photo.jpg" } },
        { id: "o2", text: "Carve the hidden archive out of the photo", check: { kind: "flag", flag: "carved_photojpg", hint: "Type: carve evidence/photo.jpg" } },
        { id: "o3", text: "What does the hidden secret.txt say?", check: { kind: "answer", answers: ["meet at the usual place", "meet at the usual place — r."], hint: "Read the carve output line by line." } },
      ],
      quiz: [
        { q: "What is EXIF metadata?", options: ["A photo filter", "Data embedded in photos: camera, date, GPS", "A virus", "A file extension"], answer: 1, explain: "EXIF records how, when, and where a photo was taken." },
        { q: "What is steganography?", options: ["Deleting files", "Hiding data inside innocent-looking files", "Encrypting disks", "A camera brand"], answer: 1, explain: "A zip appended to a JPEG is classic steganography." },
        { q: "What gave away the hidden archive?", options: ["The file size", "The PK zip header visible in strings", "The GPS data", "The filename"], answer: 1, explain: "PK\\x03\\x04 is the ZIP local file header signature." },
        { q: "Why do investigators check photo metadata?", options: ["For fun", "It can reveal locations, dates, and devices", "It's required", "To improve quality"], answer: 1, explain: "Metadata is a silent witness." },
      ],
    },
    {
      id: "logs-dont-lie",
      title: "Logs Don't Lie",
      minutes: 20,
      outcomes: [
        "Read a web server access log",
        "Distinguish normal traffic from attacker traffic",
        "Identify the attacker's IP and techniques",
      ],
      lesson: `## The server kept receipts

Web servers log **every request**: who came, when, what they asked for, and what the server answered. When something goes wrong, the log is the first witness you interview.

\`\`\`
cat evidence/access.log
\`\`\`

## Reading the story

A normal visitor fetches pages: \`GET /index.html\` → \`200\` (success). Now find the stranger. One IP behaves very differently:

- Probing \`/admin\` → \`404\` (not found — but *why* is a stranger looking?)
- \`POST /login\` → \`200\` (did they get in?)
- \`GET /../../etc/passwd\` → \`403\` (a **path traversal attack** — trying to escape the web folder and read system files)

That \`/..\` pattern is the attacker's fingerprint. Your job: name the IP, name the technique, and write the timeline. This is **exactly** what junior SOC analysts do on their first week.`,
      labIntro: "One IP in this log is not like the others. Find it and reconstruct what it did.",
      labKind: "terminal",
      objectives: [
        { id: "o1", text: "Which IP address is the attacker?", check: { kind: "answer", answers: ["203.0.113.77"], hint: "Type: cat evidence/access.log — who is misbehaving?" } },
        { id: "o2", text: "What sensitive file did the attacker try to read?", check: { kind: "answer", answers: ["/../../etc/passwd", "../../etc/passwd", "/etc/passwd", "etc/passwd"], hint: "Look for '..' in the log lines." } },
        { id: "o3", text: "Write a 3-line incident timeline as a field note", check: { kind: "flag", flag: "notes_used", hint: "Type: notes add <time>: <what happened>" } },
      ],
      quiz: [
        { q: "What does HTTP 200 mean?", options: ["Not found", "Success", "Forbidden", "Server error"], answer: 1, explain: "200 = the request worked." },
        { q: "What does /../../etc/passwd indicate?", options: ["A normal page", "A path traversal attack attempt", "A typo", "A backup"], answer: 1, explain: ".. climbs out of the web folder toward system files." },
        { q: "Why is probing /admin suspicious?", options: ["It isn't", "Strangers hunting admin panels are usually attackers", "Admins do it", "It's fast"], answer: 1, explain: "Legit users don't go looking for /admin." },
        { q: "The attacker's IP was…", options: ["192.168.56.50", "203.0.113.77", "8.8.8.8", "127.0.0.1"], answer: 1, explain: "203.0.113.77 made all the hostile requests." },
      ],
    },
    beginnerForensicsRoom,
    {
      id: "case-file",
      title: "Case File",
      minutes: 25,
      outcomes: [
        "Assemble evidence into a coherent case narrative",
        "Write findings an investigator would trust",
        "Recommend one remediation",
      ],
      lesson: `## From clues to case

You now hold four pieces of evidence: a photo with hidden data and GPS, a binary with a hardcoded password, a log showing an attack, and a memory slice. A forensic analyst's final product isn't the tools they ran — it's the **case file**: a clear, defensible story.

## Writing findings that hold up

A good case file has four parts:

1. **Chain of custody** — what evidence you examined, and that originals were untouched.
2. **Findings** — facts only, in time order. "At 09:14:55, 203.0.113.77 requested /admin (404)."
3. **Analysis** — what the facts mean. "The /../../etc/passwd request is a path traversal attempt."
4. **Recommendation** — one concrete fix. "Block the attacker IP and patch the traversal flaw."

## Your capstone

Use the terminal to re-examine anything you need, then write your case file in your notes. Facts first, opinions labeled, no leaps. **Completing this module earns your certificate: Beginner — Digital Forensics.**`,
      labIntro: "Close the case. Re-examine any evidence you need, then document everything.",
      labKind: "mixed",
      objectives: [
        { id: "o1", text: "Write a chain-of-custody note covering all 4 evidence files", check: { kind: "manual", hint: "List each file and confirm originals were untouched." } },
        { id: "o2", text: "Write your findings in time order (facts only)", check: { kind: "manual", hint: "Use your notes: notes add <finding>." } },
        { id: "o3", text: "Add one concrete remediation recommendation", check: { kind: "manual", hint: "One fix the victim should apply first." } },
      ],
      quiz: [
        { q: "What comes first in a case file?", options: ["Opinions", "Chain of custody and facts", "Recommendations", "Blame"], answer: 1, explain: "Facts and custody first — analysis after." },
        { q: "A finding should be…", options: ["A guess", "A verifiable fact with a timestamp", "An accusation", "A feeling"], answer: 1, explain: "'At 09:14:55, IP X did Y' — checkable by anyone." },
        { q: "Why separate facts from analysis?", options: ["No reason", "So others can verify your work and reach their own conclusions", "It looks longer", "It's the law everywhere"], answer: 1, explain: "Defensible investigations let the reader retrace your steps." },
        { q: "A good recommendation is…", options: ["Vague", "One concrete, actionable fix", "Ten pages", "Blaming the user"], answer: 1, explain: "Clients act on specific fixes." },
      ],
    },
  ],
};
