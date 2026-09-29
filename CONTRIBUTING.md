# Contributing to "Can you Hack?"

Thanks for helping students learn cybersecurity! A few ground rules:

## What we welcome

- **New modules/labs** for existing paths (follow `content/types.ts` exactly)
- **New packet captures** (`lib/sim/captures.ts`) and **evidence files** (`lib/sim/evidence.ts`)
- Bug fixes, accessibility improvements, translations

## Adding a module

1. Open the path file in `content/paths/` (e.g. `beginner-forensics.ts`).
2. Add a `Module` object: `id` (kebab-case), `title`, `minutes`, `outcomes` (3), `lesson` (Markdown), `labIntro`, `objectives` (2–4), `labKind`, `quiz` (4–5 questions).
3. Lab checks must reference **real simulator behavior**:
   - `flag` — only flags the engine actually sets (see `lib/sim/engine.ts`)
   - `answer` — 1–3 accepted answers (matched case-insensitively)
   - `manual` — only for capstones/documentation
4. Test the full flow: lesson → lab → quiz → next module unlocks.

## Code style

- TypeScript strict, no `any` without reason
- Mobile-first, keyboard-navigable, `prefers-reduced-motion` respected
- `npm run build` must pass with zero errors

## Ethics

Never add content that targets real systems, real payloads, or real-world attack infrastructure. This project is education-only by design.
