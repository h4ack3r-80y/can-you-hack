# MASTER PROMPT — "Can you Hack?" Educational Cybersecurity Lab Platform

> **How to use this document:** Paste this entire prompt into an AI coding assistant
> (or hand it to a developer) to build the complete platform. It is written as a
> single build instruction. Sections marked **[EDITABLE]** are designed so the
> founder can change them at any time without rebuilding the app.

---

## 1. ROLE & MISSION

You are an expert full-stack developer and cybersecurity educator. Build a complete,
production-quality, **open-source** web platform called **"Can you Hack?"** — a personal
hacking lab for **education only**, aimed at cybersecurity students from absolute
beginner to intermediate level.

**Founder:** Shayan Ahmad
**Company:** Tech Sol
**Logo asset:** `assets/techsol-logo.png` (use on navbar, footer, and certificates)
**Tagline:** "From zero to hacker — legally."

**Non-negotiable principles:**

1. Education only. Every page that touches offensive technique carries the ethics banner (Section 12).
2. Zero setup for students. All labs run **in the browser** — a simulated Kali-style terminal, simulated targets, simulated forensic/network tools. No VMs, no installs.
3. No skipping. Modules unlock strictly in sequence (Section 8).
4. Practical first. Every module = short theory + hands-on lab + quiz.
5. The founder can change **any content** at any time without code changes (Section 11).
6. Open source under the MIT license (Section 13).

---

## 2. TECH STACK

- **Framework:** Next.js 16+ (App Router), TypeScript, Tailwind CSS v4
- **Database:** Prisma ORM. SQLite for local dev, PostgreSQL for production (same schema, env-switched)
- **Auth:** Custom credentials auth (email + password) with secure sessions (httpOnly cookies). Passwords hashed with **bcrypt (cost 12)**. No third-party auth required so the project stays self-hostable.
- **Lab engine:** Framework-free TypeScript simulation engine in `lib/sim/` (inspired by the HackLab prototype): a virtual network, a shell parser, and per-track tool simulators. Must work fully client-side with zero backend calls during labs.
- **Certificates:** Server-generated, with unique verification codes + QR codes (use a QR library).
- **Deployment:** Must run with `npm install && npm run dev`, and deploy free on Vercel. No paid services anywhere.

---

## 3. DESIGN SYSTEM & UI/UX EXCELLENCE — "BEST FOR EVERYONE"

The UI must feel world-class for **every** student: on a phone in a village or a
laptop in a university lab, for beginners who have never seen a terminal, and for
users with disabilities. Beauty and usability are requirements, not decoration.

### 3A. Visual design

- Dark "hacker lab" aesthetic: near-black backgrounds (`#09090b`), neon-green primary (`#22c55e`), monospace accents for terminal/code, clean sans for reading.
- Tech Sol logo in navbar (left), footer, and certificates.
- Consistent spacing scale, rounded cards, subtle borders — no cluttered pages. Every page has one clear primary action.
- Smooth micro-animations (button hovers, progress fills, mission-complete celebrations) that **respect `prefers-reduced-motion`**.

### 3B. Responsive — mobile first

- Design mobile-first, then scale up. Breakpoints: phone (<640px), tablet, desktop.
- The **terminal must be fully usable on a phone**: minimum 14px terminal font, the input always visible above the on-screen keyboard, command history via swipe/tap buttons, and a row of tappable shortcut keys (`|`, `-`, `/`, `Tab`-like autocomplete for commands).
- Tables (packet viewer, findings) collapse into cards on small screens. No horizontal page scroll anywhere.
- Touch targets ≥ 44px. No hover-only interactions — everything must work by tap.

### 3C. Accessibility (WCAG 2.1 AA)

- Full keyboard navigation: logical tab order, visible focus rings, skip-to-content link. The terminal input is a real labeled input.
- Screen-reader support: ARIA labels on terminal output (polite live region announcing new lines), labeled form fields, quiz radio groups, progress bars with `aria-valuenow`.
- Color contrast ≥ 4.5:1 for all text. Status is never color-only — always pair with text/icons ("✓ DONE", not just green).
- No auto-playing motion; honors reduced-motion settings.

### 3D. UX clarity for absolute beginners

- First-visit **guided tour** (3–4 steps): "this is your terminal, type here, try `help`".
- Every page states its purpose in one plain sentence. Breadcrumbs on learning pages ("Paths → Beginner Pentesting → Module 4").
- Clear states everywhere: loading skeletons, empty states ("No certificates yet — complete a path to earn one"), friendly error messages that say what to do next.
- Progress is always visible: dashboard bars, "Module 3 of 8", "Next: pass the quiz".
- Plain, simple English throughout. Explain jargon the first time it appears (tooltip or glossary link).

### 3E. Performance

- Landing page interactive in under 2 seconds on a mid-range phone with 4G.
- Lazy-load heavy pieces (packet datasets, certificate preview). No layout shift.
- Target Lighthouse scores ≥ 90 on Performance, Accessibility, Best Practices, SEO.
- Reusable components: `Navbar`, `Footer`, `Terminal`, `QuizPlayer`, `LabChecklist`, `ProgressBar`, `CertificateCard`, `EthicsBanner`, `PasswordStrengthMeter`, `EmptyState`, `Breadcrumbs`.

---

## 4. SITE MAP & PAGES

| Route | Purpose |
|---|---|
| `/` | Landing: hero, "how it works", the 6 learning paths, ethics statement, founder credit (Shayan Ahmad, Tech Sol), CTA to sign up |
| `/signup`, `/login` | Auth (Section 7) |
| `/dashboard` | Student home: overall progress, continue-learning card, earned certificates |
| `/paths` | The 6 categories: Beginner/Intermediate × Pentesting, Forensics, Network Analysis |
| `/paths/[pathId]` | Path detail: module list in locked/unlocked/completed states |
| `/learn/[pathId]/[moduleId]` | Module player: lesson → hands-on lab → quiz, in order |
| `/lab` | Free-play terminal (Kali-style, no mission gating) |
| `/certificates` | Student's earned certificates: view, download (printable), LinkedIn share |
| `/verify` + `/verify/[code]` | **Public** certificate verification page — no login required |
| `/profile` | Name, public profile handle, password change |
| `/admin` **[EDITABLE]** | Founder content editor: edit lessons, quizzes, labs (Section 11) |

---

## 5. THE VIRTUAL LAB ENGINE (`lib/sim/`)

This is the heart of the platform. Build a deterministic, in-browser simulation:

**Core (`lib/sim/engine.ts`):**

- A `SimEngine` class holding: virtual filesystem/network state, background listeners, achieved flags, and an optional interactive session (ftp login, shell, irc).
- Command parser supporting quotes; commands: `help`, `clear`, `echo`, `whoami`, `id`, `hostname`, `pwd`, `ls`, `cat`, `ping`, `nmap` (flags: `-sn`, `-sV`, `-sC`, `-p-`, `-O`, `--script`), `telnet`, `nc`/`ncat` (connect + `-lvnp` listen), `curl`, `wget`, `ssh`, `smbclient`.
- Realistic outputs (Nmap tables, banners, FTP dialogues). Unknown commands → helpful error, never a crash.

**Track extensions:**

- **Pentesting:** virtual network `192.168.56.0/24`; attacker `192.168.56.10`, target `192.168.56.20` with scripted vulnerabilities (vsftpd backdoor → port 6200 shell, UnrealIRCd `AB;` RCE, Samba username-map RCE, Tomcat `tomcat:tomcat` WAR deploy RCE, distccd, weak `msfadmin:msfadmin` creds). Flag names the curriculum references (e.g. `recon_done`, `vsftpd_root`).
- **Forensics:** simulated toolset — `file`, `strings`, `hexdump -C`, `exiftool`, `binwalk`-style carve, `fls`/`icat`-style listing — operating on **bundled evidence files** (small, generated at build time: a JPEG with hidden EXIF + appended zip, a memory-dump excerpt, log files). Labs ask students to answer evidence questions; answers are checked client-side, then recorded server-side.
- **Network Analysis:** a simulated packet viewer — pre-generated `capture.pcap.json` datasets rendered as a Wireshark-style table (no., time, src, dst, protocol, info) with display-filter box (`http`, `dns`, `ip.addr == x`). Labs: "find the port scan", "extract the DNS exfiltration", "spot the C2 beacon". Include an `tshark`-style CLI in the terminal too.

**Rules:** the engine never touches the real network. All data is local and fictional. Every lab states its learning objective up front.

---

## 6. CURRICULUM STRUCTURE **[EDITABLE]**

Two levels × three tracks = **6 paths**. Each path = ordered modules. Each module = lesson (Markdown), hands-on lab (objectives + checker), quiz (5–8 questions, pass mark 80%).

### 6A. BEGINNER

**Beginner · Pentesting** (`beginner-pentesting`)

1. The Rules & Your Lab — ethics, how the simulator works, `help`
2. Terminal Basics — `ls/cd/cat/echo`, pipes concept, man-style help
3. Networking Basics — IPs, ports, TCP vs UDP (interactive diagram)
4. Recon I — `ping`, `nmap -sn`, reading output
5. Recon II — `nmap -sV -sC`, banner grabbing, note-taking
6. First Blood — vsftpd backdoor by hand (guided)
7. Passwords 101 — why defaults kill; find Tomcat `tomcat:tomcat`
8. Report Like a Pro — write findings; intro to CVSS

**Beginner · Forensics** (`beginner-forensics`)

1. What Forensics Is — chain of custody, documentation mindset
2. Files Lie — `file`, extensions vs magic bytes
3. Strings & Secrets — `strings` on a mystery binary
4. Photo Evidence — EXIF with `exiftool`, find the hidden zip (carve it)
5. Logs Don't Lie — web server log: find the attacker IP
6. Case File — document one full mini-investigation

**Beginner · Network Analysis** (`beginner-network`)

1. How Networks Talk — OSI/TCP-IP in plain words
2. Meet the Packet — open your first capture in the viewer
3. Filters Are Superpowers — display filters drill
4. Spot the Scan — find the Nmap sweep in traffic
5. DNS & HTTP — follow a web request end to end
6. Incident Signs — beaconing: find the infected host

### 6B. INTERMEDIATE

**Intermediate · Pentesting** (`intermediate-pentesting`)

1. Advanced Enumeration — `-p-`, `-O`, `--script`, UDP basics
2. Manual Exploitation I — UnrealIRCd `AB;` RCE + reverse shells (`nc -lvnp`)
3. Manual Exploitation II — Samba username-map command injection
4. Web Attack Basics — inspect, tamper, deploy via Tomcat manager
5. Privilege Escalation Concepts — Linux privesc checklist thinking
6. Full Box — unguided: recon → exploit → document, then peer-review style report

**Intermediate · Forensics** (`intermediate-forensics`)

1. Timelines — build a super-timeline from evidence
2. Memory Forensics Concepts — processes, injected code signs
3. Malware Triage — static basics: hashes, strings, sandbox thinking
4. Network Forensics — extract files from a pcap
5. Anti-Forensics Awareness — timestomping, log wiping (defensive view)
6. Full Case — end-to-end investigation with written findings

**Intermediate · Network Analysis** (`intermediate-network`)

1. Advanced pcap Analysis — streams, reassembly thinking
2. IDS Concepts — write your first Snort-style rule
3. C2 & Exfiltration — DNS tunneling patterns
4. Encrypted Traffic — what TLS still leaks (SNI, sizes, timing)
5. Threat Hunting — hunt across logs + packets for one actor
6. SOC Shift — timed simulation: triage 5 alerts, write the incident note

> The founder may rename, reorder, add, or remove modules at any time via the admin editor or Markdown files — the player must render purely from content data (Section 11).

---

## 7. AUTH — SIGNUP & LOGIN WITH STRONG PASSWORDS

- **Signup fields:** full name, email, password, confirm password, ethics checkbox ("I will only use these skills on systems I own or have permission to test").
- **Login fields:** email + password. Generic error messages ("Invalid email or password") to avoid user enumeration.
- **Strong password policy (enforced + taught):**
  - Minimum **12 characters**; must include 3 of 4 classes (upper, lower, digit, symbol).
  - Live **strength meter** (zxcvbn-style scoring) with plain-language feedback: e.g. "Add 4 more characters", "Avoid common words like 'password123'".
  - Blocklist of the 10,000 most common passwords — rejected with explanation.
  - Show a generated **passphrase suggestion** option ("correct-horse-battery-staple" style) as the recommended path.
  - Confirm-password match check; paste allowed (never block pasting — that hurts password-manager users).
- **Security:** bcrypt-12 hashing, httpOnly + Secure + SameSite cookies, rate-limit login attempts (5/min/IP with backoff), timing-safe comparison, password change requires current password, sessions revocable.
- **Education touch:** a 60-second "passwords that survive" micro-lesson linked from the signup page.

---

## 8. NO-SKIP PROGRESSION RULES

- Within a path, module N+1 stays **locked** until module N is fully complete.
- A module is complete only when: lesson marked read **+** lab objectives all checked green **+** quiz passed at **≥80%**.
- Quiz: randomized question order, 2 attempts shown with cooldown, explanations after each attempt.
- Lab checkers run client-side in the simulator but the **completion record is written server-side** (API route) to prevent trivial localStorage forgery.
- Dashboard shows per-path progress bars and the exact next step ("Next: Module 4 quiz").

---

## 9. CERTIFICATES

Awarded automatically when **all modules of a path** are complete. Six possible certificates (one per path).

**Certificate contents:**

- Title: "Certificate of Completion"
- Path name (e.g. "Beginner — Penetration Testing"), level, issue date
- Student's full name (from profile)
- Founder signature block: "Shayan Ahmad, Founder — Tech Sol" with the signature rendered in a **handwriting style** (SVG asset at `assets/signature.svg`; the founder replaces this file with his own scanned signature at any time — the layout must not depend on its exact shape)
- Tech Sol logo (`assets/techsol-logo.png`), top-center
- **Unique verification code**, format `CYH-2026-XXXXXX` (6 chars, unambiguous alphabet: no 0/O, 1/I/L). Generated server-side with `crypto.randomBytes`, unique-indexed in the database.
- **QR code** encoding the verification URL `https://<domain>/verify/CYH-2026-XXXXXX`
- Certificate ID doubles as the LinkedIn credential ID.

**Verification (public, no login):**

- `/verify/[code]` shows: student name, path, issue date, code, and a clear VALID / NOT FOUND verdict. This is the page anyone (including employers) uses to check authenticity.
- Codes are unguessable (72+ bits of entropy); the verify endpoint is rate-limited.

**LinkedIn integration:**

- On each earned certificate: an **"Add to LinkedIn profile"** button linking to LinkedIn's certification share URL prefilled with:
  - Name: `Can you Hack? — <Path Name>`
  - Issuing organization: `Tech Sol`
  - Credential ID: the verification code
  - Credential URL: the `/verify/[code]` link
- Include Open Graph meta tags on the verify page so shared links render a rich preview.

**Anti-forgery notes:** certificate PDFs are generated server-side from database truth (never from client input); the verify page is the single source of truth stated on the certificate itself ("Verify at <domain>/verify").

---

## 10. PRACTICAL-KNOWLEDGE EMPHASIS

- Every module lists **"You will be able to…"** outcomes up front.
- Labs are checked by the simulator (flags, correct answers, correct filter strings), not by self-declaration.
- Each path ends with a **capstone**: an unguided exercise + written findings, reviewed against a model answer.
- "Field notes" habit: the terminal has a built-in `notes` command saving to the student's journal (server-side), and the report builder from the HackLab prototype is included as `/report`.

---

## 11. FOUNDER CAN CHANGE ANYTHING, ANYTIME **[EDITABLE]**

- **Content as data:** all lessons (Markdown), quizzes (JSON), lab definitions, and path metadata live in `content/` with a validated schema (`content/schema.ts`). The admin panel (`/admin`, founder-only) edits the same files through a web UI with live preview.
- **Brand assets:** logo, signature SVG, colors, and site name are config in `config/site.ts` — changing the logo or signature is a file swap, not a code change.
- **Documented:** `README.md` explains local dev, content editing, deployment, and backup. `CONTRIBUTING.md` explains how open-source contributors add modules.
- **Migrations:** Prisma migrations checked in; content changes never require migrations.

---

## 12. LEGAL & ETHICS (baked in, not bolted on)

- Persistent, dismissible-per-session ethics banner on all lab pages: *"Only test systems you own or have written permission to test. Everything here is simulated."*
- Signup ethics checkbox (Section 7), a dedicated `/ethics` page, and footer disclaimer.
- No real attack tooling, no payload downloads, no instructions targeting real systems.

---

## 13. OPEN SOURCE

- **MIT License**, `LICENSE` file with `Copyright (c) 2026 Shayan Ahmad — Tech Sol`.
- README badges: build status, license, "built for education".
- `CONTRIBUTING.md`, code of conduct, and issue templates for new modules/labs.

---

## 14. BUILD PHASES (deliver in this order)

1. **Phase 1 — Foundation:** stack, auth with password policy, design system, landing, ethics.
2. **Phase 2 — Lab engine:** terminal + pentesting sim (ports the HackLab engine, extends it), forensics tools, pcap viewer.
3. **Phase 3 — Curriculum player:** paths, no-skip logic, quizzes, progress API, dashboard.
4. **Phase 4 — Certificates:** generation, QR, verify page, LinkedIn share, printable layout.
5. **Phase 5 — Founder controls:** admin editor, content schema docs, README/CONTRIBUTING, MIT license.

## 15. DEFINITION OF DONE

- `npm install && npm run dev` works on a fresh clone; `npm run build` passes with zero TypeScript errors.
- A new student can sign up (strong password enforced), complete Beginner·Pentesting module 1 end-to-end (lesson → lab → quiz → unlock module 2), with no way to skip ahead (test by URL-guessing a locked module).
- **UI acceptance:** test the full student journey on a real phone (terminal usable, no horizontal scroll, tap targets ≥ 44px); navigate the whole app keyboard-only with visible focus; run Lighthouse and score ≥ 90 in all four categories; verify with a screen reader that terminal output and quiz results are announced.
- Completing all modules of a path issues a certificate with a working verification code + QR; `/verify/[code]` confirms it publicly; LinkedIn button prefills correctly.
- All lab content renders from `content/` — rename a lesson via admin and the site reflects it with no code change.
- Repository is MIT-licensed with README and CONTRIBUTING.

---

Build it completely. When done, summarize what was built, how to run it, and how the founder edits content.
