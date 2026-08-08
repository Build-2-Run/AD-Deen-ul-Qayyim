# ADQ Seerah Chronology Specification

**Phase**: 10B.8 — Seerah Knowledge Domain Integration (Experience-Oriented)  
**Status**: Timeline & Chronology Specification  
**Date**: 2026-07-22  
**Target Path**: `docs/Seerah-Chronology.md`

---

## 1. Chronological Timeline Traversal Matrix

```
570 CE (-53 BH)  ──> Birth of Prophet Muhammad ﷺ in Makkah
610 CE (-13 BH)  ──> First Revelation at Cave of Hira (Surah Al-Alaq 96:1-5)
622 CE (1 AH)    ──> The Great Hijrah Migration to Madinah
624 CE (2 AH)    ──> Battle of Badr الكبرى (17 Ramadan 2 AH)
625 CE (3 AH)    ──> Battle of Uhud (3 Shawwal 3 AH)
627 CE (5 AH)    ──> Battle of the Trench / Khandaq (Shawwal 5 AH)
628 CE (6 AH)    ──> Treaty of Hudaybiyyah (Dhu al-Qi'dah 6 AH)
630 CE (8 AH)    ──> Conquest of Makkah (20 Ramadan 8 AH)
632 CE (10 AH)   ──> Farewell Pilgrimage & Sermon at Arafat (9 Dhu al-Hijjah 10 AH)
```

### Graph Traversal Path for Chronology
The chronological timeline is encoded in the graph via `prerequisite of` relationships:
`adq:seerah:event:hijrah` $\rightarrow$ `badr` $\rightarrow$ `uhud` $\rightarrow$ `khandaq` $\rightarrow$ `hudaybiyyah` $\rightarrow$ `fath-makkah` $\rightarrow$ `farewell-pilgrimage`.
