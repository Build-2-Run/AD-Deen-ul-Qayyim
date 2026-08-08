# AD-Deen-ul-Qayyim

# Data Architecture v1.0

## Mission
The AD-Deen-ul-Qayyim Data Architecture defines the blueprint for how Islamic, historical, and scientific knowledge is stored, versioned, validated, searched, and expanded. Its mission is to transform historically isolated texts and concepts into a rigorously structured, highly relational, and evidence-first digital ecosystem.

---

## 1. Data Philosophy

Our data is built on the following core principles:
- **Single Source of Truth:** Data is normalized. A person or event is defined once and referenced everywhere.
- **Structured over unstructured:** Text blobs are broken down into discrete fields (e.g., separating translation, tafsir, and core text).
- **Human-readable:** Base data should be stored in formats (like JSON/Markdown) that are easily readable by contributors.
- **Machine-searchable:** Strongly typed schemas ensure APIs, Search, and AI can rapidly index and traverse the data.
- **Version controlled:** Knowledge evolves. All edits undergo Git-style versioning.
- **Easily expandable:** The schema supports adding new domains (e.g., Economics) without breaking the existing structure.
- **Citation-first:** No knowledge node is valid without a source.
- **Evidence-first:** The system grades knowledge based on the strength of its primary evidence.

---

## 2. Core Data Models (Schemas)

Every schema is designed for modularity and deep relationships.

### Knowledge Node
- **Purpose:** The base unit of the knowledge engine.
- **Required Fields:** `id`, `slug`, `title`, `category`, `status`
- **Optional Fields:** `description`, `learningStage`
- **Relationships:** Belongs to `Category`; has many `Tags`, `Connections`, `References`.
- **Future Expansion:** Embedding vectors for semantic AI search.

### Knowledge Collection
- **Purpose:** A curated group of nodes forming a learning path or series (e.g., "The Lives of the Prophets").
- **Required Fields:** `id`, `title`, `orderedNodeIds`
- **Optional Fields:** `prerequisites`, `estimatedCompletionTime`
- **Relationships:** Contains many `Knowledge Nodes`.

### Knowledge Connection
- **Purpose:** The semantic edge linking two nodes.
- **Required Fields:** `sourceNodeId`, `targetNodeId`, `connectionType`
- **Optional Fields:** `context`, `strengthWeight`
- **Relationships:** Links two `Knowledge Nodes`.

### Source & Reference
- **Purpose:** Origin tracking for data validation.
- **Required Fields:** `id`, `title`, `authorId`, `type`
- **Optional Fields:** `volume`, `page`, `url`, `isbn`
- **Relationships:** Belongs to `Author / Scholar`.

### Author / Scholar
- **Purpose:** Biographical and attribution data.
- **Required Fields:** `id`, `name`, `era`
- **Optional Fields:** `biography`, `madhab`, `notableWorks`
- **Relationships:** Has many `Sources`.

### Location & Timeline Event
- **Purpose:** Spatial and temporal anchoring.
- **Required Fields (Location):** `id`, `name`, `coordinates`
- **Required Fields (Event):** `id`, `name`, `date` (Hijri/Gregorian)
- **Relationships:** `Event` occurs at `Location`.

### Calculator
- **Purpose:** Define interactive algorithms (Zakat, Mirath).
- **Required Fields:** `id`, `formula`, `inputs`, `outputs`
- **Optional Fields:** `edgeCases`
- **Relationships:** Supported by `Fiqh` and `Quran` Nodes.

### Glossary Term, Tag, Category
- **Purpose:** Taxonomy and filtering.
- **Required Fields:** `id`, `label`
- **Relationships:** Applied across all domains.

### Media
- **Purpose:** Visual/Audio enrichment.
- **Required Fields:** `id`, `type`, `url`, `altText`, `license`
- **Optional Fields:** `attribution`, `caption`
- **Relationships:** Attached to `Knowledge Node`.

### Language, Translation, Revision
- **Purpose:** i18n and lifecycle management.
- **Relationships:** Linked to `Knowledge Node`.

---

## 3. Metadata Standard

Every knowledge object implements a universal metadata wrapper:
- `id`: (UUID or semantic string)
- `slug`: URL-friendly identifier
- `title`, `shortSummary`, `longDescription`
- `category`, `subcategory`, `tags`, `keywords`
- `difficulty`, `learningStage`
- `status` (Draft | Internal Review | Verified | Published | Needs Revision | Archived)
- `createdAt`, `updatedAt`
- `reviewedBy`, `verifiedBy`
- `evidenceLevel` (e.g., Mutawatir, Sahih, Hasan)
- `confidenceLevel` (e.g., Consensus, Majority)
- `primarySources`, `secondarySources`
- `relatedNodes`, `relatedCollections`
- `estimatedReadingTime`

---

## 4. Content Validation Workflow

Data integrity is maintained through a strict lifecycle:
1. **Draft:** Initial creation (usually JSON/Markdown).
2. **Internal Review:** Checked for structural completeness.
3. **Verified:** Vetted for theological and factual accuracy by a subject matter expert.
4. **Published:** Live on ADQ.
5. **Needs Revision:** Flagged for updates based on feedback.
6. **Archived:** Deprecated content.
*All changes log a `Revision` record preserving previous states.*

---

## 5. Citation System

Our tiered citation system ensures absolute transparency:
- **Primary Sources:** The unassailable foundations (Quran, Authentic Hadith).
- **Classical Sources:** Historical scholarly consensus (Tafsir, Fiqh manuals, Historical texts).
- **Modern References:** Academic papers, peer-reviewed journals, and contemporary books bridging science and theology.
*Every knowledge node must explicitly support multiple citations across these tiers.*

---

## 6. Media System

Rich media is abstracted to support multiple front-ends:
- **Supported Types:** Images, Illustrations, Maps, Diagrams, Audio, Video, Interactive Models, 3D Models (future).
- **Requirements:** Every media item enforces strict attribution and licensing metadata to uphold legal compliance and respect intellectual property.

---

## 7. Internationalization (i18n)

The architecture is global-first:
- **Languages:** Native support for Arabic, English, Urdu, Hindi, scaling to more.
- **Text Direction:** UI/UX supports bidirectional (LTR/RTL) rendering at the node level.
- **Translation Linking:** A master node links to `N` translation nodes.
- **Localized Metadata:** Titles, summaries, and tags exist per localized node.

---

## 8. Scalable Folder Structure (Data Repository)

```text
data/
├── taxonomy/             (Tags, Categories, Glossary)
├── schemas/              (JSON Schema validation files)
├── collections/          (Learning paths and curated lists)
├── connections/          (The edge definitions linking nodes)
├── translations/         (i18n mappings)
├── media/                (Images, diagrams, licensing)
│
├── quran/                (Ayat, Surahs, Tafsir mappings)
├── hadith/               (Narrations, Gradings, Chains)
├── history/              (Chronological narratives)
├── fiqh/                 (Jurisprudence, Rulings)
├── nature/               (Biology, Earth sciences)
├── science/              (Physics, Chemistry)
├── astronomy/            (Sun, Moon, Orbits)
├── people/               (Prophets, Companions, Scholars)
├── places/               (Mecca, Medina, Badr)
├── events/               (Battles, Revelations)
└── calculators/          (Algorithms for Zakat/Mirath)
```

---

## 9. Future Database Strategy

We must balance contributor accessibility with high-performance querying.

### Short-term: JSON (Static API)
- **Why:** Extremely fast to prototype. Human-readable for open-source contributors via GitHub. Handled beautifully by Vite/React as static imports. No server costs.

### Medium-term: SQLite / PostgreSQL
- **Why:** As the dataset grows, raw JSON becomes heavy for client-side filtering. A relational DB (managed via Prisma or Drizzle) enables complex search, user accounts, and streak tracking while remaining highly robust and standard.

### Long-term: Neo4j (Graph Database)
- **Why:** ADQ is fundamentally a Knowledge Graph. When we have 10,000+ nodes and 50,000+ connections, querying deep semantic relationships (e.g., "Find all Fiqh rulings related to Water mentioned in the Quran") is exponentially faster and more intuitive in a native Graph DB like Neo4j than with SQL JOINs.

---

## 10. Entity Relationship Diagram (ASCII)

```text
+-------------------+       +-------------------+       +-------------------+
|     Category      |       |      Source       |       |       Author      |
+-------------------+       +-------------------+       +-------------------+
          | 1                         | 1..*                      | 1
          |                           |                           |
          v *                         v *                         v *
+===================+       +===================+       +===================+
|  Knowledge Node   | <---- |   Reference Map   |       |       Media       |
+===================+       +===================+       +===================+
| - ID / Slug       |                 | *                         | *
| - Title           |                 |                           |
| - Description     |                 v                           |
| - Status          |       +===================+                 |
+===================+       |    Validation     |                 |
     | *       | 1          +===================+                 |
     |         |                                                  |
     v *       |            +===================+                 |
+---------+    +----------> |   Translation     | <---------------+
|   Tag   |                 +===================+
+---------+
     |
     | (Connected to)
     v
+===================+
| Knowledge Connect |
| - sourceNodeId    |
| - targetNodeId    |
| - connectionType  |
+===================+
```

---
End of Document
