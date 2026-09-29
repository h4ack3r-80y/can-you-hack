# Can you Hack? 🎯

A **free, open-source cybersecurity lab** for students — from absolute zero to intermediate.
Learn **penetration testing**, **digital forensics**, and **network analysis** in your browser.
No VMs. No installs. Earn verifiable certificates.

Built by **Shayan Ahmad**, founder of **Tech Sol**. MIT licensed.

## Quick start

```bash
npm install
npm run dev          # SQLite database (dev.db) is created automatically
```

Open http://localhost:3000. Sign up — the email in `ADMIN_EMAIL` (`.env`) becomes the founder/admin account.

## How it works

- **6 learning paths** — Beginner/Intermediate × Pentesting, Forensics, Network Analysis
- **Simulated Kali terminal** in the browser (`lib/sim/`): Nmap, netcat, telnet, forensics tools (`strings`, `exiftool`, `carve`), packet analysis (`tshark`) — all against fictional targets. Zero backend calls during labs.
- **No skipping**: modules unlock in order — lesson → hands-on lab → 80% quiz.
- **Certificates**: unique verifiable codes (`CYH-2026-XXXXXXXXXXXXXXX`), QR codes, public `/verify/[code]` page, LinkedIn "Add to profile" support.
- **Strong passwords enforced**: 12+ chars, strength meter, common-password blocklist, bcrypt-12 hashing.

## Editing content (founder)

- **Web UI**: log in as admin → `/admin` — edit any lesson (Markdown), quiz or lab (JSON). Live instantly.
- **Files**: `content/paths/*.ts` follow the schema in `content/types.ts`.
- **Brand**: `config/site.ts`, `public/logo.png`, `public/signature.svg` (swap the signature with your scanned one anytime).

## What's new

- **Dark/light theme** with a one-tap toggle (remembers your choice).
- **Category-separated paths** — Penetration Testing, Digital Forensics, and Network Analysis each have their own visual identity, with **per-path progress bars** and category progress on `/paths` and `/dashboard`.
- **Points & leaderboard** — 100 pts per module, up to 50 quiz bonus, 150 per certificate. See `/leaderboard`.
- **Rich profiles** — photo avatar upload, editable display name, points, rank, per-path progress, certificates, password change.
- **TryHackMe-style challenge rooms** — six original, story-driven capstone rooms (one per path, e.g. *Night Shift — The Exposed Server*, *Double Tap*, *The Insider*), built on the fictional in-browser simulator. All content is original — nothing copied from TryHackMe.
- **Founder section** on the home page with a motivational message from Shayan Ahmad.
- Animated hero with a live simulated exploit walkthrough, scroll reveals, and a skills marquee.

## Production

For production you can keep the built-in SQLite file (simple, zero-config) or point
`DATABASE_URL` at any SQLite path. The schema is created automatically on first boot —
no migrations to run.

**Honest limitations — read before deploying:**
- The built-in SQLite database is a single local file. On serverless hosts (e.g. Vercel)
  the filesystem is ephemeral, so user accounts, progress, and certificates **will be lost
  on redeploy/scale**. For a real deployment, use a persistent host (VPS, Fly.io volume,
  Railway, etc.) or swap in a hosted database.
- Avatar uploads are written to `public/avatars/` on the local disk — same persistence
  caveat applies.
- Certificate QR codes and LinkedIn links use `NEXT_PUBLIC_SITE_URL` — set it to your
  real domain or verification links will point at the wrong place.

Set `NEXT_PUBLIC_SITE_URL=https://your-domain` so certificate QR codes point at the right place.

## Project structure

```
app/            pages + API routes
components/     Terminal, QuizPlayer, PacketViewer, ModulePlayer, …
content/        curriculum data (paths/*.ts) + schema (types.ts)
lib/sim/        the virtual lab engine (terminal, evidence, captures)
lib/            auth, sessions, db (SQLite), certificates, content loading
scripts/        helper scripts (make-admin)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). New modules and labs welcome!

## Ethics

Education only. Only test systems you own or have written permission to test. See `/ethics`.
