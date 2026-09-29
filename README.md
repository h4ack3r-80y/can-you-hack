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

## Production

For production you can keep the built-in SQLite file (simple, zero-config) or point
`DATABASE_URL` at any SQLite path. The schema is created automatically on first boot —
no migrations to run.

Set `NEXT_PUBLIC_SITE_URL=https://your-domain` so certificate QR codes point at the right place. Deploys free on Vercel.

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
