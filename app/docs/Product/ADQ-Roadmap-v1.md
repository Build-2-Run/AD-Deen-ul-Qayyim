# ADQ Product Roadmap v1

This document outlines the long-term product strategy for AD-Deen-ul-Qayyim, adopting a **Problem-First Strategy**. AD-Deen-ul-Qayyim is a structured Islamic knowledge platform whose primary goal is to solve real problems faced by Muslims in everyday life. Our goal is not simply to digitize ancient texts, but to provide actionable tools and deeply contextualized knowledge. 

The platform is organized into seven interconnected product pillars:

## 1. Daily Worship
**Objectives:** Provide frictionless tools to assist Muslims in maintaining and perfecting their daily obligations.
**Scope:**
- Contextual Adhkar (Morning/Evening supplications).
- Dynamic Salah trackers and daily worship checklists.
- Ramadan tracking and fasting guidelines.
**Dependencies:** Local device storage (IndexedDB) for privacy-preserving user data.

## 2. Islamic Decision Tools
**Objectives:** Automate complex Islamic financial and legal calculations to solve practical everyday problems with precision and transparency.
**Scope:**
- **Zakat:** Multi-asset calculators (gold, silver, fiat, stocks, agriculture).
- **Mirath (Inheritance):** Advanced family tree calculation engine resolving exact fractional shares according to Fiqh.
- **Fidya & Kaffarah:** Dynamic calculators for missed fasts or broken oaths based on local fiat values.
**Dependencies:** Real-time (or cached) gold/silver pricing APIs; standalone deterministic Fiqh logic engines.

## 3. Quran
**Objectives:** Build the most accessible and seamlessly cross-referenced dataset of the Quran.
**Scope:** 
- Complete Quranic text with translations and recitations.
- Granular mapping of chapters and verses using Canonical IDs.
**Dependencies:** `DatasetRegistry` and strict `Knowledge-Quality-Standards`.

## 4. Hadith
**Objectives:** Ensure the prophetic tradition is accurately preserved, cited, and mapped to daily life.
**Scope:** 
- Full indexing of the Hadith collections (Kutub al-Sittah and beyond).
- Granular mapping of chapters, books, and references using Canonical IDs.
**Dependencies:** `DatasetRegistry`, `RelationService`.

## 5. Knowledge & Understanding
**Objectives:** Address contemporary questions and provide thematic knowledge exploration to resolve doubts and increase certainty (Yaqeen).
**Scope:**
- Curated responses to common misconceptions with direct citations to Primary Sources.
- Thematic grouping of verses and Hadiths concerning Science, Ethics, and Society.
- FAQ knowledge bases for new Muslims or researchers.
**Dependencies:** `RelationService` to map thematic nodes (`concept:`) to source texts.

## 6. Astronomy & Time
**Objectives:** Provide hyper-accurate astronomical tools deeply integrated with Islamic jurisprudence.
**Scope:**
- Advanced algorithmic prayer time calculation supporting major global conventions.
- Offline-capable Qibla compass using device geolocation and magnetometer.
- Hijri calendar conversion and moon phase tracking.
**Dependencies:** Device sensor APIs (Geolocation, DeviceOrientation); astronomical calculation libraries.

## 7. Visual Learning
**Objectives:** Make complex historical and legal knowledge visually intuitive to solve comprehension barriers.
**Scope:**
- **Timelines:** Interactive Seerah timelines showing Revelation (Asbab al-Nuzul) against historical events.
- **Maps:** Geographical plotting of Hijrah, battles, and historical sites (`place:`).
- **Diagrams:** Visual family trees for Mirath, or chain of transmission (Isnad) graphs for Hadith.
- **Interactive Explorers:** The "Knowledge Explorer" UI for browsing the Relation Engine graph visually.
**Dependencies:** Specialized Canvas/SVG rendering libraries; `RelationService` for feeding graph data.
