# ADQ Module Integration Architectural Standards

**Phase**: 10B.2B — Integration Standards Specification  
**Status**: Mandatory Platform Standard  
**Date**: 2026-07-22  
**Target Subsystem**: Platform Knowledge Framework

---

## 1. Priority Tier Allocation Matrix

To prevent edge endpoint errors during bootstrapping, module graph integrations **must** declare priority integers within assigned tiers. Lower priority modules execute node registration earlier.

| Priority Tier | Domain Category | Modules | Priority Integers |
|---------------|-----------------|---------|-------------------|
| **100–199** | **Core Revelation** | `quran`, `hadith`, `tafsir` | `quran` = 100, `hadith` = 110, `tafsir` = 120 |
| **200–299** | **Jurisprudence & Worship** | `fiqh`, `prayer`, `mirath`, `zakat`, `worship` | `prayer` = 200, `worship` = 210, `mirath` = 220, `zakat` = 230 |
| **300–399** | **Humanities & History** | `scholars`, `seerah`, `history`, `geography`, `places` | `scholars` = 300, `seerah` = 310, `history` = 320, `places` = 330 |
| **400–499** | **Natural & Physical Sciences** | `astronomy`, `biology`, `medicine`, `physics`, `chemistry` | `astronomy` = 400, `biology` = 410, `medicine` = 420 |
| **500+** | **Presentation & Extensions** | `knowledge-explorer`, `reader`, `ai-learning` | `knowledge` = 500, `reader` = 510, `ai` = 520 |

---

## 2. Canonical Stable Node ID Syntax Rules

1. All canonical node IDs **must** follow the format:  
   `adq:<module_or_domain>:<entity_type>:<identifier>`
2. All segments **must** be lowercase ASCII alphanumeric characters, hyphens, or colons.
3. Node IDs are **permanent primary keys**. Once defined, they **must never change**.

### Standard Identifier Patterns

```
Qur'an Surahs:      adq:quran:surah:<number>         (e.g. adq:quran:surah:1)
Qur'an Verses:      adq:quran:verse:<surah>:<ayah>   (e.g. adq:quran:verse:36:38)
Hadith Collections: adq:hadith:collection:<name>     (e.g. adq:hadith:collection:bukhari)
Hadith Narrations:  adq:hadith:bukhari:<number>      (e.g. adq:hadith:bukhari:1907)
Scholars:           adq:scholar:<identifier>         (e.g. adq:scholar:bukhari, adq:scholar:al-battani)
Prayers:            adq:prayer:<name>                (e.g. adq:prayer:fajr, adq:prayer:dhuhr)
Mirath Concepts:    adq:mirath:<concept>             (e.g. adq:mirath:heir:son, adq:mirath:kalalah)
Zakat Thresholds:   adq:zakat:<concept>              (e.g. adq:zakat:nisab, adq:zakat:gold)
Astronomy Bodies:   adq:astronomy:<body_id>          (e.g. adq:astronomy:sun, adq:astronomy:moon)
Biological Species: adq:biology:<species>            (e.g. adq:biology:bee)
Geographic Places:  adq:place:<city_or_site>         (e.g. adq:place:makkah)
```

---

## 3. Two-Phase Registration Contract

Every integration provider must strictly split node registration from edge registration:
- **Phase 1 (`registerNodes`)**: Create and register all node objects owned by the module. Do NOT register relationships in Phase 1.
- **Phase 2 (`registerRelationships`)**: Create and register all directed and bidirectional relationship edges. All endpoint node IDs referenced MUST already exist in `CanonicalNodeRegistry`.
