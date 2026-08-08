# ADQ Prayer Module Graph Integration Specification

**Phase**: 10B.4 — Prayer & Daily Worship Integration  
**Status**: Production Module Integration Specification  
**Date**: 2026-07-22  
**Target Path**: `src/platform/knowledge/integrations/PrayerGraphIntegration.ts`

---

## 1. Registered Canonical Nodes

| Canonical Node ID | Category | Domain | Multilingual Name | Description |
|-------------------|----------|--------|-------------------|-------------|
| `adq:prayer:fajr` | `DailyPrayer` | `Worship` | Fajr (صلاة الفجر) | Dawn prayer before sunrise (-18° solar depression). |
| `adq:prayer:dhuhr` | `DailyPrayer` | `Worship` | Dhuhr (صلاة الظهر) | Noon prayer after solar meridian transit (Zawal). |
| `adq:prayer:asr` | `DailyPrayer` | `Worship` | Asr (صلاة العصر) | Afternoon prayer when shadow length equals object height. |
| `adq:prayer:maghrib` | `DailyPrayer` | `Worship` | Maghrib (صلاة المغرب) | Sunset prayer when solar disc vanishes below horizon. |
| `adq:prayer:isha` | `DailyPrayer` | `Worship` | Isha (صلاة العشاء) | Night prayer after red twilight disappears. |
| `adq:prayer:jumuah` | `SpecialPrayer` | `Worship` | Jumu'ah (صلاة الجمعة) | Weekly Friday congregational prayer. |
| `adq:prayer:tahajjud` | `SpecialPrayer` | `Worship` | Tahajjud (صلاة التهجد) | Voluntary night vigil prayer. |
| `adq:prayer:witr` | `SpecialPrayer` | `Worship` | Witr (صلاة الوتر) | Odd-numbered night prayer. |
| `adq:prayer:sunnah` | `SpecialPrayer` | `Worship` | Sunnah Rawatib (السنن الرواتب) | Emphasized voluntary prayers before/after daily prayers. |
| `adq:prayer:nafl` | `SpecialPrayer` | `Worship` | Nafl (صلاة النفل) | General voluntary prayers. |

---

## 2. Key Relationship Topography

- `prayer -> legal ruling for -> adq:worship:wudu` (Purification prerequisite)
- `prayer -> references -> adq:worship:qiblah` (Facing Kaaba direction)
- `prayer -> connected to -> adq:worship:adhan` (Public call to prayer)
- `prayer -> prerequisite of -> adq:worship:iqamah` (Commencement call)
- `prayer -> part of -> adq:worship:ruku` (Bowing posture pillar)
- `prayer -> part of -> adq:worship:sujood` (Prostration posture pillar)
- `adq:prayer:dhuhr -> scientific explanation of -> adq:astronomy:zawal` (Solar zenith trigger)
