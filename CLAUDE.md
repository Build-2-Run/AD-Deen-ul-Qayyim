# PROJECT BRIEF — AD-Deen ul-Qayyim (ADQ)

> **RECONCILIATION NOTE (updated 2026-08-04, do not delete).**
> This file is a stable foundation doc: what ADQ is, how the repo is
> structured, and standing working rules. It intentionally does **not**
> track module-by-module status — that changes too fast to keep here
> without going stale. **Live progress, decisions, and what's done vs.
> pending lives in the assistant's persistent memory
> (`adq-work-plan-and-status`), not in this file.** Before assuming
> anything is complete, broken, or pending, check that memory and then
> verify against the actual code — do not trust either source blindly.
>
> Repo state as of this update: `main` HEAD is `9532ef9`, but there is a
> **large, intentionally uncommitted working tree** — a module-plugin
> rebuild of `app/` plus a docs consolidation, both done directly on top
> of HEAD with no other branches involved. This is the user's explicit
> choice: **work stays local-only; syncing to GitHub is deferred until
> the user says otherwise.** Do not commit or push without being asked.

Read this fully before touching any code. Verify every claim below
against the actual filesystem/code before relying on it — this file
gets edited by hand and can drift.

## What ADQ is

An Islamic knowledge platform. Not just prayer times and calculators —
the founding thesis (`docs/Handbook/00-Foundation/`, at the **repo
root**, not `app/docs/`) is that Islamic knowledge domains are
interconnected and should be presented that way: Prayer↔Astronomy,
Quran↔Tafsir, Zakat↔Mathematics, etc. Read the four files in
`docs/Handbook/00-Foundation/` (`00-Declaration.md`, `01-Manifesto.md`,
`02-Vision.md`, `03-Principles.md`) — they are the best-written, most
sincere part of this repository and should guide every product
decision. Non-negotiable principles from them: authenticity before
aesthetics, evidence before assumption, complexity hidden behind the
interface not in front of the user.

## Current architecture (verified against the working tree)

The React app under `app/` is a **module-plugin architecture**, not a
flat page tree:

- `app/src/bootstrap.ts` async-registers feature modules before render.
- `app/src/platform/registry/` — `PlatformRegistry`, `ModuleRegistry`,
  `RouteRegistry`, `NavigationRegistry`, `FeatureFlagRegistry`,
  `SearchRegistry`, `ExtensionRegistry`, `DatasetRegistry`.
- Each domain owns `app/src/features/<name>/` with its own `module.tsx`,
  `engine/` or `logic/`, `pages/`, and (where present) `README.md`.
  Current features: `astronomy`, `daily-worship`, `hadith`, `knowledge`,
  `knowledge-services`, `mirath`, `prayer`, `quran`, `reader`, `zakat`.
- `app/src/app/shell/` is the app shell — `MainLayout`, `TopNavigation`,
  `DesktopSidebar`, `MobileNavigation`, `SearchOverlay`,
  `SettingsDrawer` — plus `app/src/app/home/HomeExperience`. `App.tsx`
  renders `RouteRegistry.getRoutes()` dynamically.
- `app/src/design/` is the design layer (components, icons, layout,
  motion, primitives, typography) — build UI on these primitives, not
  raw Tailwind classes.
- `app/src/platform/` beyond the registry also holds shared subsystems:
  `study`, `reader`, `relations`, `fiqh`, `bookmarks`, `search`,
  `translation`, `settings`, `statistics`, `caching`, `knowledge`.

This replaced an older flat structure (`components/layout/*`,
`features/modules/ModuleProvider`/old `ModuleRegistry`, `pages/*`) which
has already been deleted from the working tree. If you find references
to that old structure anywhere, they are stale.

## Two codebases coexist in this repo

1. Legacy static site at root (`index.html`, `css/main.css`, `js/app.js`,
   confirmed still present) — deployed and live on GitHub Pages. Dark
   glassmorphism, gold/magenta/purple accents, emoji-based nav icons,
   scrolling marquee banner, hardcoded to Srinagar location. Contains
   the Mirath (inheritance) calculator supporting all four madhahib —
   the most substantial original domain logic outside the rewrite;
   compare against `app/src/features/mirath/` rather than assuming
   either is authoritative.
2. React/TypeScript/Vite rewrite in `app/` — not deployed, sits isolated
   in a subfolder. Migrating it to repo root to replace the legacy site
   is the long-term direction (`docs/ADR/ADR-001.md`) but has not been
   done, and is not scheduled ahead of finishing the module rebuild.

## Documentation map

- `docs/Handbook/` (repo root) — the single consolidated docs tree:
  `00-Foundation`, `01-Design-System`, `02-Experience`,
  `03-Knowledge-Engine`, `04-Architecture`, `05-Technology`,
  `06-Features`, `07-Development`, `08-Quality`, `09-Future`. This
  replaced ~80 scattered files previously under `app/docs/` (now
  deleted) plus a separate `docs/Architecture|Product|Brand|...` set
  (also deleted/merged in). If you're looking for a spec, it's under
  `docs/Handbook/`, not `app/docs/`.
- `docs/ADR/` — architecture decision records (`ADR-001`, `ADR-002`,
  `ADR-005-Knowledge-Platform`, etc.), kept separate from the Handbook.
- Per-feature specs live under `docs/Handbook/06-Features/<Domain>/`
  when they exist (e.g. Zakat has one) — write new ones there, not as
  loose root-level files.
- Do **not** write new audit/status/phase-report documents. The
  project's own historical status docs (old `PROJECT-STATUS.md`,
  `Repository-Audit-v1.md`, phase reports) were self-assigned, not
  computed from anything measurable, and have been removed. Progress
  tracking now happens in the assistant's memory file, not as markdown
  in the repo.

## Solid foundations to build on

- `docs/Handbook/03-Knowledge-Engine/` — a real, well-thought-out
  knowledge graph model: Knowledge Nodes, semantic Connection types
  (Supports/Explains/Causes/Mentions/etc.), a citation tier system
  (Primary/Classical/Modern sources), an evidence/confidence metadata
  standard (Mutawatir/Sahih/Hasan grading, Draft→Verified→Published
  lifecycle), and disciplined AI-assistant rules (never invent facts,
  every claim traces to a node ID, never claim an unregistered
  connection exists). Do not throw this out.
- `app/src/platform/study/` — notes, highlights, bookmarks, collections
  engines; real infrastructure.
- `app/src/platform/reader/` — reader layout with keyboard shortcuts,
  content-agnostic so any module can reuse the same reading UI.
- `app/src/platform/fiqh/verificationStatus.ts` — the shared status
  vocabulary (consensus / scholarly-difference / local-authority /
  needs-review) meant to be used across every fiqh-bearing surface in
  the app, not just one module. Reuse it rather than inventing a new
  status scheme per feature.
- The engine/UI split pattern used by Mirath and Zakat — UI components
  contain **zero calculation logic**; everything routes through a
  dedicated engine/calculator object per feature. Follow this pattern
  for any new fiqh-adjacent feature (e.g. Salaat) rather than inlining
  math in components.

## Known standing issues (verified true at time of writing)

1. `app/src/platform/relations/components/RelationCard.tsx` renders raw
   node-ID slugs as titles via `targetId.replace(/^[^-]+-/, '')`, prints
   a hardcoded `Conf: {confidence*100}%`, and uses hardcoded Tailwind
   (`emerald-500`, `gray-*`) instead of design tokens. Fix: human-readable
   titles, drop the fake confidence number unless it traces to a real
   source, use design-system primitives instead of raw Tailwind.
2. `app/src/platform/relations/RelationService.ts` still seeds fake
   relations on module load (colon-namespaced target IDs like
   `topic:prayer`, `place:makkah`, `hadith:bukhari:book:1:hadith:1`,
   `concept:guidance`, `concept:worship`) that do not correspond to real
   nodes elsewhere. Either write the real nodes or remove the seed data.
   A good first real demonstrator (per `Knowledge-Engine.md`): Asr
   Prayer → Sun Position → Earth's Rotation → Astronomy → Surah Al-Asr.
3. `data/history.json` has era-level entries (label, period, color,
   summary, key figures/events) but no discrete dated-event array,
   despite the README promoting an "interactive 1400-year Islamic
   history timeline." Low priority relative to the module rebuild.

## Working rules for this project

- Do NOT write more audits, phase reports, or status summaries unless
  asked. Write code and content instead — progress belongs in the
  assistant's memory, not in new markdown files.
- Never invent a fiqh ruling, hadith grading, evidence level, verse
  text, or confidence score. If such a value is needed and not sourced,
  flag it for the user rather than filling it in. If a source can't be
  verified, drop it rather than keep it with a caveat.
- Keep madhhab differences presented neutrally — show them, don't rank
  them.
- Before marking anything "complete" or "verified," check it against
  the actual running build/output, not against what a doc file or
  memory entry says was done.
- Work stays **local-only** until the user explicitly says to push/sync
  to GitHub. Never assume a prior approval carries forward to a new
  push.
- The user remains the decision-maker on product direction and
  content/authenticity calls. Propose and explain; don't silently
  decide fiqh, sourcing, or scope questions — ask.

## External Resources & Assets Policy
- You are PERMITTED to use ANY external resource (including CDNs,
  high-resolution textures, web assets, SVG maps, media, icons, fonts,
  and reliable APIs) AT ANY TIME during website design, provided it
  comes from a reliable source (e.g. Google Fonts, unpkg, cdnjs,
  Wikimedia, NASA open assets, official CDNs).

## Strict Execution & Accuracy Directives
- **Obey Commands Strictly**: Always follow all user directives and instructions strictly without deviation, unauthorized scope changes, or unrequested alterations.
- **100% Reliable & Authentic Data**: Fetch, compute, or integrate ONLY real, accurate, and mathematically sound data from authoritative sources. Never use fake placeholders, dummy approximations, or arbitrary random numbers.
- **World-Class Aesthetics & Architecture**: Deliver highly interactive, state-of-the-art UI designs with rich visual excellence, glassmorphism, responsive layouts, and clean modular code structures. Whatever the user requests must be built exactly as asked.

