# Universal Knowledge Model v1

This design document defines the universal ADQ Knowledge Node model. Every piece of content ingested into the platform—whether a Quranic verse, a Hadith, a Fiqh ruling, a historical event, or an astronomical concept—must conform to this structural blueprint. This model ensures that all domains across the platform can seamlessly interoperate, be indexed by the same Search Adapters, and be traversed by the single Relation Engine.

---

## 1. Identity vs. Content Metadata
To ensure strict separation of concerns, the fundamental identity of a node is structurally separated from its human-readable content and metadata.

### Identity Metadata
- `nodeId`: The globally distinct Canonical ID (e.g., `quran:surah:2:ayah:255`).
- `type`: The domain category (e.g., `quran`, `hadith`, `concept`, `event`).
- `status`: Editorial lifecycle state (`draft`, `reviewing`, `verified`, `deprecated`, `archived`).

### Content Metadata
- Human-readable properties such as `title`, `summary`, and localized translations.

---

## 2. Knowledge Hierarchy
Not all nodes exist flatly. To represent structured works, nodes may declare a strict parent-child hierarchy natively outside of the relation graph.
- `parentNodeId`: The Canonical ID of this node's direct parent (e.g., an Ayah points to its Surah).
- `children`: An array of Canonical IDs that belong to this node.
- `order`: An integer defining the exact sequential sorting of this node within its parent's collection.

---

## 3. Canonical Content vs. Presentation Metadata
To maintain absolute integrity, the knowledge model strictly separates immutable truth from presentation and regenerable metadata.

### Canonical Content (Immutable)
This represents the authenticated academic truth. It must never change once published unless correcting a historical error.
- Original source text (e.g., Raw Arabic `matn`).
- Core meaning or unchangeable historic fact.

### Presentation Metadata (Regenerable)
This represents data used strictly for rendering and UI decisions.
- Estimated reading time.
- Display logic or CSS hooks.
- Extracted keywords and search tokens for fuzzy matching.

---

## 4. Reusable Citation Object
Any node citing external works or classical texts must use a formalized Citation object instead of loose string references.
- `citationText`: The formatted academic citation.
- `volume` / `page` / `chapter`: Exact physical location markers.
- `digitalId`: A reference to external digital registries if applicable.
- `grading`: Academic authenticity grading (e.g., "Sahih", "Hasan", "Da'if").

---

## 5. Expanded Provenance & Licensing
A node must explicitly cite its origin. The `sourceMetadata` object provides a rich provenance model tracing the text back to its archival root:
- `sourceName`: Title of the archive or manuscript (e.g., "Sahih al-Bukhari").
- `edition`: Specific publication or print edition.
- `publisher`: The publishing house or digital archive (e.g., "Dar-us-Salam").
- `translator`: Name of the translator (if localized).
- `language`: Original language of the source.
- `publicationDate`: Historical or print date.
- `checksum`: Integrity hash of the raw source data.

### Licensing Metadata
Strictly separated from provenance, the `licensing` object dictates legal usage rights.
- `licenseType`: e.g., "Public Domain", "CC-BY-SA", "Proprietary".
- `attributionRequired`: Boolean flag determining UI rendering of copyright notices.

---

## 6. Authority & Evidence Classification
Every node must declare its `authorityClass` to help users understand the theological or academic weight of the information they are viewing.
- `Primary Revelation`: Immutable divine text (Quran).
- `Primary Sunnah`: Authenticated prophetic tradition (Hadith).
- `Scholarly Interpretation`: Human academic consensus or Ikhtilaf (Tafsir, Fiqh).
- `Historical Record`: Documented events and biographies (Seerah).
- `Scientific Observation`: Factual astronomical or geographical data.
- `Educational Material`: Summaries, diagrams, or curated lessons.
- `Platform Generated`: Computed tools, calculators, or AI-derived summaries.

### Evidence Classification
For derived or interpretive nodes (e.g., Fiqh rulings), the node can explicitly declare its evidence methodology:
- `primaryEvidence`: Links to direct Quran/Hadith nodes.
- `ijma`: Supported by scholarly consensus.
- `qiyas`: Derived by analogical deduction.

---

## 7. Applicability Metadata
For context-specific rulings (like Fiqh or localized astronomical phenomena), the node includes applicability bounds to prevent misapplication.
- `madhab`: School of thought (e.g., Hanafi, Shafi'i).
- `geography`: Regional limitations (e.g., "High Latitude" prayer time rulings).
- `condition`: Specific edge cases (e.g., "Traveler", "Sick").

---

## 8. Relations & Dependencies
Nodes do not embed their connections directly; they rely on the external Relation Engine.
A standard relation object comprises:
- `sourceNodeId`, `targetNodeId`, `priority`, `confidence`.
- `relationType`: `supports`, `explains`, `contradicts`, `mentions`, `chronological_next`.

### Dependency Relationships
To model strict theological or logical dependencies, specialized relations are used:
- `dependsOn`: This concept cannot be understood without the target node.
- `derivedFrom`: This ruling originates strictly from the target node.
- `supersedes`: Handles abrogation (Naskh) where one verse or ruling historically overrides another.

---

## 9. Semantic Tags & Purpose Metadata
- **Semantic Tags:** Human-readable categories supporting navigation, discovery, and Knowledge Graph clustering (e.g., `Prayer`, `Charity`, `Family`, `Faith`, `Patience`).
- **Purpose Metadata:** Describes *why* a node exists in the graph (e.g., `Teach`, `Explain`, `Clarify`, `Calculate`, `Preserve`, `Connect`).

---

## 10. Reading Level Metadata
This metadata dictates which UI components can appropriately render the node based on the user's selected learning level.
- `Beginner`: Accessible, plain-language summaries and practical takeaways.
- `Student`: Intermediate explanations requiring contextual background (Asbab al-Nuzul).
- `Researcher`: Deep academic exploration involving Isnad, original Arabic syntax, and scholarly dispute.

---

## 11. Validation Requirements
To strictly support the Knowledge QA Pipeline, nodes specify validation markers:
- `requiredChecks`: An array of tests this node must pass (e.g., `['schema', 'duplicate-check', 'semantic-relation']`).
- `validationStatus`: `pending`, `passed`, or `failed`.
- Only nodes with a `passed` validation status and a `verified` editorial status may enter the production compiled dataset.

---

## 12. Version & Machine Metadata
Versioning traces exactly how and when a node was generated:
- `schemaVersion`: The interface structure version.
- `contentVersion`: The version of the underlying text.
- `compilerVersion`: The version of the ADQ ingest script.

### Machine Metadata
A reserved `machineMetadata` object isolates data specifically generated for or by algorithms and AI, preventing it from mixing with Canonical content.
- `embeddings`: Vector embeddings for semantic AI search.
- `aiSummaries`: LLM-generated summaries or translated drafts not yet verified.
- `searchTokens`: Pre-computed stems for offline fuzzy search indexing.
