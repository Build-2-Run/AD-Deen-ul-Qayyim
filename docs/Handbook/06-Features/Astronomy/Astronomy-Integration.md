# ADQ Astronomy Module Knowledge Graph Integration Specification

**Phase**: 10B.7 — Astronomy Knowledge Domain Expansion  
**Status**: Production Module Integration Specification  
**Date**: 2026-07-22  
**Target Path**: `src/platform/knowledge/integrations/AstronomyGraphIntegration.ts`

---

## 1. Registered Canonical Nodes

| Canonical Node ID | Category | Domain | Multilingual Name | Description |
|-------------------|----------|--------|-------------------|-------------|
| `adq:astronomy:sun` | `CelestialBody` | `Astronomy` | The Sun (الشمس) | Central star governing daily Islamic prayer times. |
| `adq:astronomy:moon` | `CelestialBody` | `Astronomy` | The Moon (القمر) | Earth's satellite governing the Hijri lunar calendar. |
| `adq:astronomy:earth` | `CelestialBody` | `Astronomy` | The Earth (الأرض) | Terrestrial observer reference globe. |
| `adq:astronomy:horizon` | `CelestialBody` | `Astronomy` | The Horizon (الأفق) | Great circle dividing sky from earth. |
| `adq:astronomy:zenith` | `CelestialBody` | `Astronomy` | The Zenith (سمت الرأس) | Overhead point on celestial sphere. |
| `adq:astronomy:meridian` | `CelestialBody` | `Astronomy` | The Meridian (خط الزوال) | North-south zenith meridian line. |
| `adq:astronomy:sunrise` | `SolarEvent` | `Astronomy` | Sunrise (شروق الشمس) | Upper solar rim crossing eastern horizon. |
| `adq:astronomy:zawal` | `SolarEvent` | `Astronomy` | Solar Noon / Zawal (الزوال) | Solar meridian transit triggering Dhuhr entry. |
| `adq:astronomy:sunset` | `SolarEvent` | `Astronomy` | Sunset (غروب الشمس) | Upper solar rim vanishing below western horizon. |
| `adq:astronomy:twilight-civil` | `SolarEvent` | `Astronomy` | Civil Twilight (الشفق المدني) | 0° to 6° solar depression angle. |
| `adq:astronomy:twilight-nautical` | `SolarEvent` | `Astronomy` | Nautical Twilight (الشفق البحري) | 6° to 12° solar depression angle. |
| `adq:astronomy:twilight-astronomical` | `SolarEvent` | `Astronomy` | Astronomical Twilight (الشفق الفلكي) | 12° to 18° solar depression angle. |
| `adq:astronomy:new-moon` | `LunarEvent` | `Astronomy` | Conjunction (المحاق / الاقتران) | Dark new moon phase. |
| `adq:astronomy:hilal` | `LunarEvent` | `Astronomy` | Hilal Crescent (الهلال) | Waxing crescent moon triggering Hijri month start. |
| `adq:astronomy:first-quarter` | `LunarEvent` | `Astronomy` | First Quarter (التربيع الأول) | Half-illuminated waxing moon. |
| `adq:astronomy:full-moon` | `LunarEvent` | `Astronomy` | Full Moon / Badr (البدر) | Fully illuminated moon (Ayyam al-Beed). |
| `adq:astronomy:last-quarter` | `LunarEvent` | `Astronomy` | Last Quarter (التربيع الثاني) | Half-illuminated waning moon. |
| `adq:astronomy:lunar-month` | `LunarEvent` | `Astronomy` | Lunar Month (الشهر القمري) | Synodic month of 29 or 30 days (~29.53d). |
| `adq:astronomy:hijri-month` | `TimeConcept` | `Astronomy` | Hijri Month (الشهر الهجري) | Calendar month starting with Hilal observation. |
| `adq:astronomy:hijri-year` | `TimeConcept` | `Astronomy` | Hijri Year (السنة الهجرية) | Islamic lunar year of 12 synodic months (~354d). |
| `adq:astronomy:day` | `TimeConcept` | `Astronomy` | Daylight Period (النهار) | Dawn to sunset fasting hours. |
| `adq:astronomy:night` | `TimeConcept` | `Astronomy` | Night Period (الليل) | Sunset to dawn night prayer hours. |
| `adq:astronomy:dawn` | `TimeConcept` | `Astronomy` | True Dawn (الفجر الصادق) | Horizontal white twilight line at -18° depression. |
| `adq:astronomy:dusk` | `TimeConcept` | `Astronomy` | Twilight Dusk (الشفق) | Post-sunset twilight glow. |
