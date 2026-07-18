# ADQ Product Roadmap v1

This document outlines the long-term product strategy for AD-Deen-ul-Qayyim, shifting from architecture-driven development to a **Product-First Strategy**. The platform is organized into six interconnected product pillars designed to serve the practical, intellectual, and daily needs of Muslims.

## 1. Primary Sources (Quran, Hadith)
**Objectives:** Build the most authentic, cryptographically verifiable, and accessible dataset of core Islamic texts.
**Scope:** 
- Complete Quranic text with translations and recitations.
- Full indexing of the remaining Hadith collections (Kutub al-Sittah and beyond).
- Granular mapping of chapters, books, and references using Canonical IDs.
**Dependencies:** `DatasetRegistry`, `RelationService`, and strict `Knowledge-Quality-Standards`.
**Items Intentionally Postponed:** Tafsir is deprioritized in the immediate term to ensure the foundational Arabic texts and translations of Hadith are perfectly mapped first.

## 2. Daily Practice (Salah, Adhkar, Ramadan, Prayer Tools)
**Objectives:** Provide frictionless tools for daily worship and remembrance.
**Scope:**
- Contextual Adhkar (Morning/Evening supplications) linked to their source Hadiths.
- Ramadan tracking and fasting guidelines.
- Dynamic Salah trackers and daily worship checklists.
**Dependencies:** Local device storage (IndexedDB) for privacy-preserving user data.
**Items Intentionally Postponed:** Social accountability or public leaderboards; worship tracking remains strictly private.

## 3. Islamic Calculators (Zakat, Mirath, Fidya, Kaffarah)
**Objectives:** Automate complex Islamic financial and legal calculations with precision and transparency.
**Scope:**
- **Zakat:** Multi-asset calculators (gold, silver, fiat, stocks, agriculture).
- **Mirath (Inheritance):** Advanced family tree calculation engine resolving exact fractional shares according to Fiqh.
- **Fidya & Kaffarah:** Dynamic calculators for missed fasts or broken oaths based on local fiat values.
**Dependencies:** Real-time (or cached) gold/silver pricing APIs; standalone deterministic Fiqh logic engines.

## 4. Knowledge & Understanding (Islam and Science, Misconceptions, FAQs)
**Objectives:** Address contemporary questions and provide thematic knowledge exploration.
**Scope:**
- Curated responses to common misconceptions with direct citations to Primary Sources.
- Thematic grouping of verses and Hadiths concerning Science, Ethics, and Society.
- FAQ knowledge bases for new Muslims or researchers.
**Dependencies:** `RelationService` to map thematic nodes (`concept:`) to source texts.

## 5. Astronomy & Time (Hijri Calendar, Moon Phases, Prayer Time Calculations, Qibla, Eclipses)
**Objectives:** Provide hyper-accurate astronomical tools deeply integrated with Islamic jurisprudence.
**Scope:**
- Advanced algorithmic prayer time calculation supporting major global conventions (MWL, ISNA, Umm al-Qura, etc.).
- Offline-capable Qibla compass using device geolocation and magnetometer.
- Hijri calendar conversion and moon phase tracking.
**Dependencies:** Device sensor APIs (Geolocation, DeviceOrientation); astronomical calculation libraries.

## 6. Visual Learning (Illustrations, Timelines, Maps, Diagrams, Interactive Explorers)
**Objectives:** Make complex historical and legal knowledge visually intuitive.
**Scope:**
- **Timelines:** Interactive Seerah timelines showing Revelation (Asbab al-Nuzul) against historical events.
- **Maps:** Geographical plotting of Hijrah, battles, and historical sites (`place:`).
- **Diagrams:** Visual family trees for Mirath, or chain of transmission (Isnad) graphs for Hadith.
- **Interactive Explorers:** The "Knowledge Explorer" UI for browsing the Relation Engine graph visually.
**Dependencies:** Specialized Canvas/SVG rendering libraries; `RelationService` for feeding graph data.
