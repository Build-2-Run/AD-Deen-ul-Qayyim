# ADQ Product Backlog

This document serves as the single source of truth for future feature development under the Problem-First strategy. It replaces milestone-driven planning, ensuring that all engineering efforts are strictly prioritized against real-world utility and problem-solving value.

---

## 1. Daily Worship

### 1.1 Contextual Adhkar (Morning/Evening Supplications)
- **Problem Solved:** Muslims need a reliable, academically sourced list of daily supplications without carrying physical books.
- **Target User:** Every practicing Muslim (Level 1 - Beginner).
- **Priority:** P0
- **Dependencies:** Complete Hadith dataset (for citation linking).
- **Complexity:** Low (UI layer over static JSON data).
- **Status:** Planned

### 1.2 Ramadan Fasting Tracker & Guidelines
- **Problem Solved:** Difficulty tracking missed fasts, fidya owed, and accessing instant Fiqh rules for breaking the fast.
- **Target User:** Every practicing Muslim.
- **Priority:** P1
- **Dependencies:** Local device storage (IndexedDB).
- **Complexity:** Medium (State management + Fiqh rule engine).
- **Status:** Planned

### 1.3 Dynamic Salah Tracker
- **Problem Solved:** Maintaining consistency in daily prayers and tracking Qada (make-up) prayers over long periods.
- **Target User:** Practicing Muslims struggling with consistency.
- **Priority:** P2
- **Dependencies:** Local device storage.
- **Complexity:** Medium
- **Status:** Planned

---

## 2. Islamic Decision Tools

### 2.1 Multi-Asset Zakat Calculator
- **Problem Solved:** Calculating Zakat accurately across complex modern portfolios (gold, silver, fiat, stocks, crypto, agriculture) is overwhelming for laymen.
- **Target User:** Working professionals, heads of households.
- **Priority:** P0
- **Dependencies:** Live Nisab API (Gold/Silver prices), Fiqh logic engine.
- **Complexity:** High (Complex math, conditional branching based on Madhab).
- **Status:** Planned

### 2.2 Mirath (Inheritance) Calculator
- **Problem Solved:** Islamic inheritance math is exceptionally complex and causes severe family disputes due to ignorance of the exact fractional shares.
- **Target User:** Families, lawyers, students of knowledge.
- **Priority:** P0
- **Dependencies:** Fiqh logic engine.
- **Complexity:** Very High (Fractional math, blocking rules (Hajb), awl/radd).
- **Status:** Planned

### 2.3 Fidya & Kaffarah Calculator
- **Problem Solved:** Unsure how much money is owed for a broken oath or missed fast based on local economic fiat values.
- **Target User:** General Muslims.
- **Priority:** P2
- **Dependencies:** Zakat Calculator infrastructure.
- **Complexity:** Low
- **Status:** Planned

---

## 3. Quran

### 3.1 Base Quran Reader
- **Problem Solved:** Accessing the Quran digitally with guaranteed authenticity and clean typography.
- **Target User:** Everyone.
- **Priority:** P0
- **Dependencies:** None.
- **Complexity:** Medium
- **Status:** Complete

### 3.2 Offline Audio Recitation
- **Problem Solved:** Memorization (Hifz) requires repetitive listening without relying on cellular data.
- **Target User:** Hifz students, general Muslims.
- **Priority:** P1
- **Dependencies:** IndexedDB audio caching, Audio API player.
- **Complexity:** Medium
- **Status:** Planned

---

## 4. Hadith

### 4.1 Kutub al-Sittah Integration
- **Problem Solved:** Accessing the primary explanations and rulings derived from the Prophet (PBUH) without sifting through unstructured PDFs.
- **Target User:** Students, Researchers, general Muslims.
- **Priority:** P0
- **Dependencies:** Content ingestion pipelines.
- **Complexity:** Medium
- **Status:** In Progress (Sahih al-Bukhari foundation established)

### 4.2 Isnad (Chain of Transmission) Visualizer
- **Problem Solved:** Understanding the reliability and historical chain of a hadith is impossible for laymen reading raw text.
- **Target User:** Students (Level 2), Researchers (Level 3).
- **Priority:** P2
- **Dependencies:** Taxonomy of narrators (`person:`), D3.js / Canvas rendering.
- **Complexity:** High
- **Status:** Planned

---

## 5. Knowledge & Research

### 5.1 "Common Misconceptions" Knowledge Base
- **Problem Solved:** Muslims face intellectual doubts and external challenges but lack immediate, scholarly responses backed by primary evidence.
- **Target User:** Youth, Da'ees, researchers.
- **Priority:** P1
- **Dependencies:** Quran & Hadith compiled graph, RelationService.
- **Complexity:** Medium (Heavy editorial effort required).
- **Status:** Planned

### 5.2 Thematic Exploration (Topics)
- **Problem Solved:** Finding every verse and Hadith related to "Patience", "Marriage", or "Usury" instantly.
- **Target User:** Students, Khateebs, Researchers.
- **Priority:** P1
- **Dependencies:** Ontology mapping (`concept:`).
- **Complexity:** Medium
- **Status:** Planned

---

## 6. Astronomy & Time

### 6.1 Advanced Prayer Time Engine
- **Problem Solved:** Unreliable third-party apps with invasive ads; needing accurate offline times globally.
- **Target User:** Every practicing Muslim.
- **Priority:** P0
- **Dependencies:** Geolocation API, Adhan calculation library.
- **Complexity:** Medium
- **Status:** Planned

### 6.2 Offline Qibla Compass
- **Problem Solved:** Finding the direction of prayer while traveling without internet access.
- **Target User:** Travelers.
- **Priority:** P1
- **Dependencies:** Device Magnetometer/Orientation API, Geolocation API.
- **Complexity:** High (Browser API inconsistencies).
- **Status:** Planned

---

## 7. Visual Learning

### 7.1 Interactive Seerah Timeline
- **Problem Solved:** Reading the Seerah chronologically is difficult; mapping verses to the exact year of revelation (Asbab al-Nuzul) gives massive context.
- **Target User:** Students, general readers.
- **Priority:** P1
- **Dependencies:** Timeline UI component, Seerah event dataset.
- **Complexity:** High (Data mapping and visual rendering).
- **Status:** Planned

### 7.2 Historical Maps
- **Problem Solved:** Contextualizing battles, migrations, and scholarly journeys geographically.
- **Target User:** Students, Researchers.
- **Priority:** P3
- **Dependencies:** Mapping library (Leaflet/Mapbox), GeoJSON datasets.
- **Complexity:** High
- **Status:** Planned
