# Universal Knowledge Model v1

This design document defines the universal ADQ Knowledge Node model. Every piece of content ingested into the platform—whether a Quranic verse, a Hadith, a Fiqh ruling, a historical event, or an astronomical concept—must conform to this structural blueprint. This model ensures that all domains across the platform can seamlessly interoperate, be indexed by the same Search Adapters, and be traversed by the single Relation Engine.

---

## 1. Purpose of the Model
The ADQ Knowledge Model is designed to:
- Standardize the representation of truth across vastly different domains (Textual, Scientific, Historical, Legal).
- Eliminate domain-specific silos (e.g., preventing a "Quran API" that looks entirely different from a "Seerah API").
- Enable frictionless rendering across the uniform `ReaderLayout` components.
- Support deep academic research (Level 3) without overwhelming general users (Level 1), by strictly separating primary text from derived context.

---

## 2. Canonical ID Specification
Every node in the ADQ graph must possess a globally distinct semantic ID. The ID serves as the primary key for the DatasetRegistry and the Relation Engine.

- **Structure:** `domain:collection:book:identifier`
- **Immutability:** Once established, a Canonical ID must never change. If a node is merged or split, its legacy ID must redirect, or the node is deprecated.
- **Examples:**
  - Quran: `quran:surah:2:ayah:255`
  - Hadith: `hadith:bukhari:book:1:hadith:1`
  - Science/Concept: `concept:embryology`
  - History/Seerah: `event:hijrah`
  - Fiqh Ruling: `fiqh:zakat-al-fitr`

---

## 3. Required and Optional Content Fields

### Required Fields
- `nodeId` (String): The Canonical ID.
- `type` (String): The domain type (e.g., `quran`, `hadith`, `concept`, `event`).
- `primaryContent` (Object): The core payload. This must contain the original source language if applicable (e.g., `arabic`).

### Optional Fields
- `english`, `urdu`, etc. (Strings): Localized translations (though preferred to be lazy-loaded).
- `title` (String): Human-readable title (e.g., "The Verse of the Throne").
- `summary` (String): A brief Level 1 (Beginner) explanation.
- `searchTokens` (Array<String>): Pre-computed stems for offline fuzzy search indexing.

---

## 4. Source and Evidence References
A node must explicitly cite its origin. ADQ values authenticity above all else.
- `sourceMetadata` (Object):
  - `origin` (String): The database or manuscript source (e.g., "Tanzil.net", "Shamela").
  - `chainOfTransmission` / `isnad` (String): The raw chain of narrators (crucial for Hadith).
  - `grading` (String): Academic authenticity grading (e.g., "Sahih", "Hasan", "Da'if").
  - `url` (String): A link to the original digital archive, if applicable.

---

## 5. Relations and Cross-References
Nodes do not embed their connections directly inside their static payloads; they rely on the external Relation Engine graph to prevent infinite nesting. However, the model mandates that relations possess deep typing.

A relation object tracked in the Relation Engine comprises:
- `sourceNodeId` (String)
- `targetNodeId` (String)
- `relationType` (Enum): `supports`, `explains`, `contradicts` (for abrogations), `mentions`, `chronological_next`.
- `priority` (Integer): Defines visual sorting order in the Explorer UI.
- `confidence` (Float 0.0 - 1.0): Indicates the strength of the scholarly consensus on this link.

---

## 6. Taxonomy and Thematic Grouping
Taxonomy nodes act as aggregation hubs. They do not contain primary text, but rather serve as index subjects.
- **Domains:** `concept:`, `place:`, `person:`, `time:`
- When a primary text mentions "Makkah", a relation is drawn from the text to `place:makkah`. The `place:makkah` node itself contains metadata (coordinates, historical significance) conforming to this same Universal Model.

---

## 7. Illustrations and Media Attachments
Knowledge nodes can securely reference external media assets.
- `media` (Array<Object>):
  - `url` (String): Local path or CDN link.
  - `type` (Enum): `image`, `audio`, `interactive-canvas`, `svg-diagram`.
  - `caption` (String): Descriptive text for accessibility (WCAG).
  - *Example use-case:* Attaching a D3.js timeline component to `event:battle-of-badr`.

---

## 8. Localization Support
- The model treats localization as a layer, not a core structural component.
- The primary node retains the authentic source language (typically Arabic).
- Translations and localizations are mapped via ID (e.g., `quran:surah:1:ayah:1` loads its English equivalent asynchronously based on User Preferences).

---

## 9. Research Metadata (Knowledge Levels)
To support the three distinct depths of the platform, the model includes:
- `level1Content`: Simplified takeaways.
- `level2Content`: Standard contextual background (Asbab al-Nuzul).
- `level3Content`: Deep scholarly disputes, exact linguistic breakdowns, and historical ikhtilaf (Differences of Opinion).

---

## 10. Extensibility Principles
Future modules (e.g., Zakat calculators or Moon Phase trackers) might require custom logic, but their definitions and explanations must still map to this node model.
- **Rule:** If a feature computes a ruling (e.g., "You owe $500 in Zakat"), the explanation of *why* must be a Canonical Node (`fiqh:zakat-nisab-rules`) rendered by the standard Reader, not a hardcoded tooltip inside the calculator UI.
