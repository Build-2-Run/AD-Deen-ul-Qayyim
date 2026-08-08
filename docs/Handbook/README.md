# AD-Deen ul-Qayyim Handbook

> *The single source of truth for the project — why it exists, how it is designed, and how it is built.*

This Handbook is the consolidated home for **all** ADQ documentation. It was unified on 2026-07-25 from ~166 scattered files (across the old root `docs/` and `app/docs/`) into one organized tree. Stale audits, coverage reports, phase logs, and generated "intelligence" snapshots were removed — their durable findings live here, in the code, or in git history.

Technology changes. Design trends change. Frameworks change. **The mission does not:** authenticity before aesthetics, evidence before assumption, understanding as the objective, complexity hidden behind the interface.

---

## Structure

| Section | What lives here |
|---|---|
| **[00-Foundation](00-Foundation/)** | Declaration, Manifesto, Vision, and the 10 **Principles** (the constitution) |
| **[01-Design-System](01-Design-System/)** | Design philosophy, design tokens, motion |
| **[02-Experience](02-Experience/)** | Visual language, navigation, components, UX principles, gateway concepts, `UX/` details |
| **[03-Knowledge-Engine](03-Knowledge-Engine/)** | Node/edge model, canonical IDs, data architecture, graph traversal/query/explainability, governance |
| **[04-Architecture](04-Architecture/)** | System architecture, architecture diagrams, module registry, risk register |
| **[05-Technology](05-Technology/)** | Platform API, API catalogue, dataset inventory, framework choices |
| **[06-Features](06-Features/)** | One folder per module: Quran, Hadith, Astronomy, Prayer, Zakat, Mirath, Tafsir, Worship, Seerah, Fiqh, Science, Library, Search |
| **[07-Development](07-Development/)** | Contributor guide, module dev/integration standards, migration plan, feature template |
| **[08-Quality](08-Quality/)** | Knowledge quality standards, QA pipeline, testing standard, content lifecycle, question benchmark |
| **[09-Future](09-Future/)** | Roadmaps, backlog, AI-search plans, future compatibility |
| **[../ADR](../ADR/)** | Architecture Decision Records (001 migration, 002 stack, 005 knowledge platform) |

---

## Known consolidation TODOs (refine over time)

These were **co-located** during the unification but not yet merged into single documents:

- **09-Future** holds four overlapping roadmaps (`Product-Roadmap`, `Product-Backlog`, `Content-Priority`, `Master-Roadmap`) → merge into one.
- **07-Development** has two migration docs (`Migration-Plan`, `Migration-Strategy`) → merge into one.
- **01-Design-System** philosophy + token docs describe *intent*; the **real** token values live in `app/src/styles/index.css` → the design doc should be updated to document the actual values.
- **Canonical node ID format** is inconsistent across older docs (`quran:...` vs `adq:quran:...`). The implemented `UniversalNode` standard is **`adq:<domain>:<type>:<id>`** — treat that as canonical; older non-prefixed forms are legacy.
- The 1-line placeholder `README.md` in each section folder can be replaced with a real section index.

---

## Guiding principle

> Technology exists to serve knowledge. Knowledge exists to strengthen faith.

Version 1.0 · Unified 2026-07-25
