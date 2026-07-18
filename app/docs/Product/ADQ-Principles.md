# AD-Deen-ul-Qayyim Principles

This document serves as the project constitution. Every future feature, architecture decision, and content ingestion pipeline must satisfy these principles before being accepted into the platform.

## Mission

To provide an authentic, structured, interconnected Islamic knowledge platform that helps people learn, understand, and practice Islam correctly.

---

## Core Principles

### 1. Authenticity over popularity
Every piece of knowledge must come from reliable, verifiable, and academically accepted sources. We never compromise historical or academic integrity for engagement.

### 2. Quality over quantity
We do not add content simply to increase platform size or feature count. Every addition—whether a dataset or a UI component—must measurably improve a user's understanding.

### 3. Solve real problems
Every feature should answer a genuine question or practically assist in daily Islamic life. ADQ is a tool for practicing Muslims, not just an academic archive.

### 4. Evidence before opinion
Whenever possible, present the Quran, authentic Hadith, scholarly consensus (Ijma), and source references before interpretations or derived opinions.

### 5. Teach, don't just tell
The platform must explain:
- *Why* a ruling exists.
- *How* it is practiced.
- The *Evidence* behind it.
- Known *Exceptions*.
- *Practical examples*.

### 6. Everything is connected
Knowledge should never exist in isolation. Every concept must be linked through the Relation Engine to related Ayat, Hadith, People, Places, History, Astronomy, Science, and Themes.

### 7. Beauty serves learning
Animations, typography, illustrations, and visual graph explorations should strictly serve to improve comprehension. Design must never exist merely for decoration.

### 8. Local-first
The application must remain highly usable offline whenever practical. Core datasets, user annotations, and daily practice tools should function without a network connection.

### 9. Platform first
New functionality must extend the existing Platform APIs (DatasetRegistry, RelationService, CacheProvider) rather than creating fragmented, duplicated feature implementations.

### 10. Build for decades
Every design, architectural, and editorial decision should favor long-term maintainability over short-term convenience.

---

## Knowledge Levels

ADQ recognizes that not every user requires the same depth of information. To maintain a unified interface without overwhelming the user or diluting academic rigor, knowledge is structured across three distinct depths. This ensures the same authenticated node can serve all audiences simply by adjusting the presentation layer.

### Level 1 — Beginner
- Simple, plain-language explanation.
- Key points and takeaways.
- Immediate practical guidance.

### Level 2 — Student
- Direct Quranic references.
- Relevant Hadiths.
- Contextual background (Asbab al-Nuzul).
- Related topics and concepts.

### Level 3 — Research
- Original Arabic texts and syntax.
- Full chains of narration (Isnad).
- Classical scholarly opinions (Tafsir/Fiqh).
- Cross-references across collections.
- Historical and socio-political context.
- Differences of academic opinion (Ikhtilaf).
- Raw source citations and metadata.
