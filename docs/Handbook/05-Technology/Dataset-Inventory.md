# ADQ Dataset Inventory

**Phase**: 10B.0.1 — Documentation & Architecture Intelligence  
**Status**: Analysis Only — Zero code modified  
**Date**: 2026-07-22

> All datasets live inside `src/features/` — confirmed by direct filesystem inspection. No external `/datasets/` directory exists.

---

## 1. Astronomy Knowledge Datasets (`src/features/astronomy/knowledge/content/`)

### 1.1 `quran-astronomy-map.json` (2,926 B)
| Field | Value |
|-------|-------|
| **Owner** | `astronomy/knowledge` |
| **Consumers** | `KnowledgeEngine`, `RelationshipEngine`, `UniversalRelationshipEngine`, `educational-modules.json` |
| **Purpose** | Maps Qur'anic verses referencing astronomical phenomena |
| **Records** | 3 — Surah 36:38 (Solar motion), 36:39 (Lunar phases), 2:189 (Ahillah/timekeeping) |
| **Authenticity** | `Mutawatir` for all 3 |
| **Update Strategy** | Manual — add new verse-astronomy cross-links |

```json
{
  "id": "string",
  "source": "Quran",
  "reference": "string (Surah:Ayah)",
  "arabicText": "string",
  "translations": { "en": "string", "ur": "string", "id": "string", "fr": "string" },
  "authenticity": "Mutawatir | Sahih | Hasan",
  "keywords": ["string"]
}
```

### 1.2 `hadith-astronomy-map.json` (1,817 B)
| Field | Value |
|-------|-------|
| **Owner** | `astronomy/knowledge` |
| **Consumers** | `KnowledgeEngine`, `RelationshipEngine`, `educational-modules.json` |
| **Purpose** | Maps Hadith narrations connected to astronomical observations |
| **Records** | 2 — Bukhari 1907 (Moonsighting/Ramadan), Bukhari 521 (Dhuhr/Solar Meridian) |
| **Update Strategy** | Manual |

### 1.3 `islamic-astronomers.json` (4,608 B)
| Field | Value |
|-------|-------|
| **Owner** | `astronomy/knowledge` |
| **Consumers** | `KnowledgeEngine`, `educational-modules.json`, `TopicExplorer` |
| **Purpose** | Biographical + scientific contribution records for 7 major Islamic astronomers |
| **Records** | 7 — Al-Battani, Al-Biruni, Ibn al-Shatir, Ibn Yunus, Nasir al-Din al-Tusi, Al-Farghani, Ulugh Beg |

```json
{ "id": "string", "name": "string", "arabicName": "string", "eraYears": "string",
  "location": "string", "biography": { "en": "string" },
  "contributions": [{ "en": "string" }], "discoveries": [{ "en": "string" }],
  "majorWorks": ["string"] }
```

### 1.4 `educational-modules.json` (1,897 B)
| Field | Value |
|-------|-------|
| **Owner** | `astronomy/knowledge` |
| **Consumers** | `EducationalModuleEngine`, `LearningPathEngine`, `LearningJourneyEngine` |
| **Purpose** | 3-level (Beginner/Intermediate/Advanced) educational modules |
| **Records** | 2 — "Prayer & Solar Motion", "Moon Phases & The Hijri Calendar" |
| **Cross-References** | `relatedCitations[]` (→ quran/hadith map IDs), `relatedAstronomers[]` (→ astronomer IDs) |

### 1.5 `scientific-glossary.json` (1,669 B)
| Field | Value |
|-------|-------|
| **Owner** | `astronomy/knowledge` |
| **Consumers** | `GlossaryEngine` |
| **Purpose** | Bilingual scientific glossary with Islamic context for each term |
| **Records** | 3 — Hilal (Crescent), Zawal (Solar Transit), Shafaq (Twilight) |

### 1.6 `fiqh-references.json` (948 B)
| Field | Value |
|-------|-------|
| **Records** | 2 — Imam Al-Nawawi (Al-Majmu'), Ibn Taymiyyah (Majmu' al-Fatawa) |
| **Purpose** | Scholarly Fiqh citations linking astronomy to Islamic law |

### 1.7 `timeline.json` (888 B)
| Field | Value |
|-------|-------|
| **Records** | 6 events — 830 CE to 1420 CE |
| **Purpose** | Historical timeline of Islamic astronomical achievements |

---

## 2. Qur'an Mock Dataset (`src/features/quran/mock/data.ts`) — 7,529 B

| Field | Value |
|-------|-------|
| **Owner** | `quran` |
| **Consumers** | `QuranRepository`, `useQuran`, `SurahReader`, `QuranHome`, `QuranCollectionView` |
| **Purpose** | Dev/demo data — 4 full Surahs with Ayah text + metadata |
| **Records** | 4 Surahs: Al-Fatiha (7 ayahs), Al-Baqarah (5/286), Al-Imran (2/200), Ya-Sin (2/83) |
| **Format** | TypeScript `Surah[]` (fully typed via `quran/models/index.ts`) |
| **Gap** | ⚠ Only 4 of 114 Surahs. Full Quran data layer not yet connected |

```typescript
interface Surah { id, number, name { arabic, english, transliteration },
                  revelation { type: 'Meccan'|'Medinan', order }, ayahCount, ayahs?: Ayah[] }
interface Ayah  { id, surahNumber, ayahNumber, text { arabic }, translation?,
                  metadata { juz, hizbQuarter, page, ruku, manzil } }
```

---

## 3. Hadith Datasets

> ⚠ **CONFIRMED ABSENT**: `src/features/hadith/mock/` directory does **not exist**.  
> Hadith data is embedded inline in `CollectionPage.tsx` and `HadithPage.tsx`.  
> No structured dataset file exists for the Hadith module.

---

## 4. Prayer Dataset (`src/features/prayer/mock/data.ts`) — 1,508 B

| Field | Value |
|-------|-------|
| **Owner** | `prayer` |
| **Consumers** | `PrayerHome` |
| **Records** | 1 `PrayerTimelineDay` (6 prayer slots) + 4 `PrayerGuide` entries |
| **Note** | Times are static strings (04:15, 05:45, 13:00, etc.) — actual times come from `AstronomyPlatform` |

---

## 5. Mirath (Inheritance) Datasets (`src/features/mirath/mock/`)

### 5.1 `data.ts` — Guide & Encyclopedia Records (4,353 B)
- 10 `MirathGuide` entries (categories: Fundamentals, Distribution, Encyclopedia, Furud, Hajb, Asabah, Special Cases, Examples)
- 4 mock `Heir` objects
- 1 mock `DistributionResult` (£100,000 estate example)

### 5.2 `mock/rules/` — Fara'id Rule Definitions (~36 KB total)
| File | Size | Content |
|------|------|---------|
| `heirs.ts` | 10,159 B | All Islamic heir types with eligibility conditions |
| `fixed-shares.ts` | 9,247 B | Furud rules: 1/2, 1/4, 1/8, 2/3, 1/3, 1/6 |
| `blocking.ts` | 9,265 B | All Hajb (blocking) rules — total and partial |
| `asabah.ts` | 6,521 B | All Asabah (residuary) rules by priority class |
| `special-cases.ts` | 895 B | Awl, Radd, Umariyyatayn, Akdariyyah, etc. |
| `glossary.ts` | 614 B | Arabic Fara'id glossary terms |
| `faq.ts` | 592 B | Inheritance FAQ entries |

### 5.3 `mock/rules/scenarios/` — Test Scenario Database (~204 KB total)
| File | Size | Content |
|------|------|---------|
| `auto-generated.ts` | **161,761 B** | Auto-generated exhaustive scenario matrix (largest file in repo) |
| `extended-awl.ts` | 6,841 B | Awl proportional reduction scenarios |
| `more-scenarios.ts` | 6,984 B | Complex multi-heir scenarios |
| `blocking-cases.ts` | 5,813 B | Hajb (blocking) test scenarios |
| `extended-radd.ts` | 3,995 B | Radd (surplus) scenarios |
| `extended-basic.ts` | 3,142 B | Extended multi-heir basics |
| `golden.ts` | 3,135 B | Golden-reference validated scenarios |
| `distant-kindred-scenarios.ts` | 2,172 B | Dhawul Arham edge cases |
| `special-cases.ts` | 2,153 B | Special Fara'id cases |
| `basic.ts` | 1,217 B | Basic single/double heir cases |
| `parents.ts` | 978 B | Parent-only scenarios |
| `golden-references/` | 0 B | **Empty** — placeholder |

### 5.4 `mock/rulesets/` — Madhhab Rulesets (2,738 B total)
| Path | Size | Content |
|------|------|---------|
| `jumhur/index.ts` | 2,100 B | Jumhur consensus ruleset |
| `hanafi/index.ts` | 638 B | Hanafi divergence ruleset |

---

## 6. Zakat Dataset (`src/features/zakat/mock/data.ts`) — 2,001 B

| Field | Value |
|-------|-------|
| **Records** | 5 `ZakatGuide` entries + 1 Nisab object |
| **Mock Nisab** | Gold: $6,500 USD/87.48g; Silver: $450 USD/612.36g; Active: `silver` |
| **Categories** | Fard, Nisab, Assets, Mistakes |

---

## 7. Celestial Datasets (Embedded in Provider Code)

| Provider | Size | Dataset |
|----------|------|---------|
| `BrightStarProvider.ts` | 15,692 B | BSC5 Bright Stars (~300 stars, inline) |
| `ConstellationProvider.ts` | 13,103 B | 88 IAU Constellation boundaries |
| `MessierProvider.ts` | 9,009 B | Messier M1–M110 deep sky objects |
| `satellites/TLEProvider.ts` | — | TLE orbital elements (ISS, Hubble, Tiangong) |

---

## 8. Complete Dataset Summary

| Dataset | Location | Size | Records | KG Connected |
|---------|----------|------|---------|-------------|
| quran-astronomy-map.json | astronomy/knowledge/content | 2.9 KB | 3 | ⚠ Partial |
| hadith-astronomy-map.json | astronomy/knowledge/content | 1.8 KB | 2 | ⚠ Partial |
| islamic-astronomers.json | astronomy/knowledge/content | 4.6 KB | 7 scholars | ⚠ Partial |
| educational-modules.json | astronomy/knowledge/content | 1.9 KB | 2 modules | ⚠ Partial |
| scientific-glossary.json | astronomy/knowledge/content | 1.7 KB | 3 terms | ⚠ Partial |
| fiqh-references.json | astronomy/knowledge/content | 948 B | 2 refs | ⚠ Partial |
| timeline.json | astronomy/knowledge/content | 888 B | 6 events | ⚠ Partial |
| quran/mock/data.ts | quran/mock | 7.5 KB | 4 Surahs | ❌ None |
| mirath/mock/data.ts | mirath/mock | 4.4 KB | 10 guides | ❌ None |
| mirath/mock/rules/ | mirath/mock/rules | ~36 KB | Full ruleset | ❌ None |
| mirath/mock/rules/scenarios/ | mirath/mock/rules/scenarios | ~204 KB | Hundreds | ❌ None |
| mirath/mock/rulesets/ | mirath/mock/rulesets | 2.7 KB | 2 madhabs | ❌ None |
| zakat/mock/data.ts | zakat/mock | 2.0 KB | 5 guides | ❌ None |
| prayer/mock/data.ts | prayer/mock | 1.5 KB | 4 guides | ❌ None |
| BSC5 Bright Stars | astronomy/celestial/providers | 15.7 KB | ~300 stars | ⚠ Partial |
| IAU Constellations | astronomy/celestial/providers | 13.1 KB | 88 | ⚠ Partial |
| Messier Objects | astronomy/celestial/providers | 9.0 KB | 110 | ⚠ Partial |
| **Hadith mock** | **hadith/** | **ABSENT** | **0** | **❌ Missing** |
| **Tafsir data** | **(anywhere)** | **ABSENT** | **0** | **❌ Missing** |
| **Daily Worship Athkar** | **daily-worship/** | **Inline only** | **Unknown** | **❌ Missing** |
