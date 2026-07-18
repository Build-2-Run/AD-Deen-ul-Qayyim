# ADQ Product Roadmap v1

This document outlines the long-term product strategy for AD-Deen-ul-Qayyim, organized into five parallel workstreams. The platform has officially transitioned from architecture-driven development to product-driven development.

## 1. Platform Maintenance

**Objectives:**
- Guarantee the long-term stability, performance, and scaling of the frozen Platform API.
- Ensure cross-platform reliability for web, progressive web app (PWA), and mobile environments.

**Scope:**
- Performance optimization (lazy loading, worker-based search, IndexedDB index scaling).
- Bug fixes and technical debt resolution for the reader layout and offline caching.
- Security and dependency updates.

**Dependencies:**
- Immutable Platform APIs (DatasetRegistry, RelationService, CacheProvider).
- Zero feature-to-feature dependencies.

**Quality Standards:**
- Strict TypeScript compilation with zero errors.
- Automated architectural dependency tests passing.

**Success Metrics:**
- Zero regression bugs on core Platform APIs.
- Sub-50ms node load times regardless of corpus size.
- 100% offline availability of cached datasets.

**Items Intentionally Postponed:**
- User accounts and cloud syncing (focus remains on local-first PWA for now).
- Collaborative study features.

---

## 2. Content Acquisition & Verification

**Objectives:**
- Systematically acquire, normalize, and validate core textual knowledge (Hadith, Tafsir, Seerah).
- Build the most authentic and cryptographically verifiable Islamic dataset in the world.

**Scope:**
- Importers and Normalizers for primary texts.
- Translation pipelines for English, Urdu, and other regional languages.
- Generation of detailed metadata registries for version control.

**Dependencies:**
- Requires strict adherence to `Knowledge-Quality-Standards.md` and `Content-Priority.md`.

**Quality Standards:**
- 100% accurate Canonical IDs.
- Zero orphaned relations (Target node must exist).
- Zero duplicated entries.

**Success Metrics:**
- Ingestion pipelines run flawlessly without manual data wrangling.
- Number of nodes available in the dataset registry (scaling to millions).
- 100% of imported data passes the ContentValidator script.

**Items Intentionally Postponed:**
- Unverified, community-sourced content. All datasets must be heavily vetted first-party datasets.
- Weak/Da'if hadith variants unless explicitly required for academic Tafsir relationships.

---

## 3. Knowledge Graph Expansion

**Objectives:**
- Map the intricate, multifaceted relationships between texts to form a unified graph.
- Create an ontology of concepts, themes, places, and people.

**Scope:**
- Linking Ayahs to Hadiths (Tafsir bil-Mathur).
- Linking texts to taxonomy domains (`topic:`, `place:`, `person:`, `concept:`).
- Generating visual knowledge exploration paths.

**Dependencies:**
- Depends directly on the `RelationService` and normalized content from Workstream 2.

**Quality Standards:**
- Graph connections must be historically or academically verifiable.
- Relations must carry priority, relationType, and confidence metadata.

**Success Metrics:**
- Ratio of connected nodes vs isolated nodes.
- High average "depth" of graph traversal paths available to a user.

**Items Intentionally Postponed:**
- Automated relation generation without human review.

---

## 4. Learning Experience

**Objectives:**
- Deliver a deeply immersive, highly customizable, distraction-free reading and study experience.

**Scope:**
- Reader typography, layout, and localization (RTL).
- Personal study tools: Highlighting, note-taking, and bookmark collections.
- Interactive sidebars for relation exploration (Knowledge Explorer).

**Dependencies:**
- `StudyService` and `ReaderLayout` platforms.

**Quality Standards:**
- Fully accessible (ARIA) and WCAG compliant.
- Mobile-first responsiveness.
- Frictionless translation switching without page reloads.

**Success Metrics:**
- User session duration (time spent reading/exploring).
- Number of notes/bookmarks saved locally.

**Items Intentionally Postponed:**
- Gamification (badges, streaks, leaderboards) which detract from sincere study.

---

## 5. Research & AI

**Objectives:**
- Augment the student's capability to search and synthesize knowledge without hallucination risks.

**Scope:**
- Deterministic full-text and semantic search.
- "AI Tutor" tools that strictly operate on the ADQ canonical dataset using Retrieval-Augmented Generation (RAG).

**Dependencies:**
- `PlatformSearch` adapters (LocalIndex, Worker, SQLite).
- High-quality ontology and Knowledge Graph metadata for context ingestion.

**Quality Standards:**
- AI responses must provide exact citations to Canonical IDs.
- Zero generative hallucination of primary texts (Arabic must always be deterministic).

**Success Metrics:**
- Search query success rate (latency and relevance).
- AI citation accuracy percentage.

**Items Intentionally Postponed:**
- Unconstrained conversational AI. All AI must be strictly bounded by the curated ADQ dataset.
