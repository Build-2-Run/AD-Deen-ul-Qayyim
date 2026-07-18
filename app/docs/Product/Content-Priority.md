# Content Priority

ADQ prioritizes future work based on long-term value, platform utility, and academic foundation rather than implementation effort. Below is the recommended implementation order for all future datasets, structured to build layers of context sequentially.

## 1. Remaining Hadith Collections
**Reasoning:** Hadith represents the primary explanatory context for the Quran (Tafsir bil-Mathur). Without the Kutub al-Sittah (The Six Books) fully indexed, any subsequent Tafsir or Fiqh module lacks its foundational references. Completing Hadith immediately maximizes the Knowledge Graph's primary reference nodes.

## 2. Tafsir (Exegesis)
**Reasoning:** Once Quran and Hadith are established, Tafsir bridges the two. It provides the classical understanding of the text. By layering Tafsir over a complete Hadith corpus, the relation engine can directly link classical commentary to the specific Hadiths referenced by the Mufassir (author).

## 3. Seerah (Prophetic Biography)
**Reasoning:** The Seerah provides chronological and contextual (Asbab al-Nuzul) grounding for both the Quran and Hadith. It transforms abstract theological concepts into a timeline of events, allowing users to read revelation in the historical order of its occurrence.

## 4. Themes & Ontology (Concepts)
**Reasoning:** With the primary texts, commentary, and timeline established, thematic categorization (`concept:`) serves as the ultimate browsing index. Users can explore topics like "Patience" or "Prayer" and instantly see the intersecting Quranic verses, Hadiths, Tafsir excerpts, and Seerah events.

## 5. People & Places
**Reasoning:** Building out a rich taxonomy of individuals (Companions, Transmitters, Prophets) and geographical locations enriches the Seerah and Hadith Isnad (chains of transmission). This enables powerful features like visualizing the migration routes or analyzing narrator credibility.

## 6. Islamic History
**Reasoning:** Expanding beyond the Seerah into the eras of the Khulafa ar-Rashidun, Umayyad, and Abbasid caliphates provides broader context for Fiqh development and the compilation of the sciences.

## 7. Fiqh (Jurisprudence)
**Reasoning:** Fiqh is highly derived and heavily debated. It relies entirely on the preceding layers (Quran, Hadith, Tafsir, History). Attempting to index Fiqh rulings before establishing the primary evidences (Adillah) would break the platform's core architectural goal of tracing knowledge back to its source.

## 8. Scientific Topics
**Reasoning:** Modern scientific correlations or topics are supplemental and interpretive. They hold the lowest priority as they represent modern exploratory analysis rather than foundational classical knowledge. They should only be introduced once the classical corpus is undisputed and complete.
