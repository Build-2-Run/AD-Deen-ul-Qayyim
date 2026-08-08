# ADQ Worship Module Graph Integration Specification

**Phase**: 10B.4 — Prayer & Daily Worship Integration  
**Status**: Production Module Integration Specification  
**Date**: 2026-07-22  
**Target Path**: `src/platform/knowledge/integrations/WorshipGraphIntegration.ts`

---

## 1. Registered Canonical Nodes

| Canonical Node ID | Category | Domain | Multilingual Name | Description |
|-------------------|----------|--------|-------------------|-------------|
| `adq:worship:salah` | `WorshipConcept` | `Worship` | Salah (الصلاة) | Universal ritual prayer concept. |
| `adq:worship:wudu` | `Purification` | `Worship` | Wudu (الوضوء) | Ritual ablution required before prayer. |
| `adq:worship:tayammum` | `Purification` | `Worship` | Tayammum (التيمم) | Dry soil purification substitute. |
| `adq:worship:adhan` | `WorshipConcept` | `Worship` | Adhan (الأذان) | Public call to prayer. |
| `adq:worship:iqamah` | `WorshipConcept` | `Worship` | Iqamah (الإقامة) | Call to stand for prayer. |
| `adq:worship:qiblah` | `SacredDirection` | `Worship` | Qiblah (القبلة) | Direction of Makkah / Kaaba. |
| `adq:worship:ruku` | `PosturePillar` | `Worship` | Ruku (الركوع) | Bowing posture pillar. |
| `adq:worship:sujood` | `PosturePillar` | `Worship` | Sujood (السجود) | Prostration posture pillar. |
| `adq:worship:jamaah` | `WorshipConcept` | `Worship` | Jama'ah (صلاة الجماعة) | Congregational prayer. |
| `adq:worship:athkar-morning` | `Remembrance` | `Worship` | Morning Athkar (أذكار الصباح) | Morning remembrances. |
| `adq:worship:athkar-evening` | `Remembrance` | `Worship` | Evening Athkar (أذكار المساء) | Evening remembrances. |
| `adq:worship:sawm` | `FastingPillar` | `Worship` | Sawm (الصيام) | Ramadan obligatory fasting. |

---

## 2. Key Relationship Topography

- `adq:worship:sawm -> prerequisite of -> adq:prayer:fajr` (Fasting starts at dawn with Fajr)
- `adq:worship:sawm -> consequence of -> adq:prayer:maghrib` (Fasting ends at sunset with Maghrib)
- `adq:worship:sawm -> legal ruling for -> adq:astronomy:hilal` (Ramadan month start tied to crescent moon)
- `adq:worship:wudu -> references -> adq:quran:verse:5:6` (Wudu divine ordinance in Qur'an 5:6)
- `adq:worship:tayammum -> part of -> adq:worship:wudu` (Dry purification fallback)
