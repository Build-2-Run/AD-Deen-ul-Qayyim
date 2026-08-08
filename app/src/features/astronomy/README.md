# Astronomy Module — "The Islamic Sky"

The astronomical **calculation layer** for ADQ: the science behind Muslim
worship — prayer times, sunrise/sunset, moon phases & crescent (hilal), the
Hijri calendar, and Qibla — presented as *signs in creation* connected to the
Qur'an.

> **Scope boundary (decided 2026-07-26):** this module is the *calculation
> engine + educational sky view*. The worship-facing application — prayer
> tracking, Ramadan/Eid hilal decisions, forbidden/recommended prayer times —
> lives in the **Salat Tracker** module, which *consumes* this engine. See
> "For the Salat Tracker" below.

## Public API

Import from `@/features/astronomy` (the barrel in `index.ts`):

```ts
import { astronomyService, calculationMethods } from '@/features/astronomy';

const result = astronomyService.getDailyAstronomy(
  location,                                   // ObserverLocation
  { year, month, day },                       // GregorianDate (time optional)
  { calculationMethod, hijriStrategy: 'Astronomical' },
);
// → { sun, moon, prayerTimes, hijri, qibla, visibility, warnings, ... }
```

Types: `DailyAstronomyResult`, `ObserverLocation`, `PrayerTimes`,
`QiblaResult`, `HijriDateResult`, `MoonVisibilityResult`, `CalculationMethod`.

## Folder map

| Folder | What it holds |
|--------|---------------|
| `service/` | **Entry point** — `AstronomyPlatform` facade + `astronomyService` singleton, cache, batch prediction |
| `engine/math/` | Meeus algorithms: Solar/Lunar ephemeris, PrayerTime, Asr, Qibla, Hijri, Eclipse, MoonVisibility, NewMoon, Geodesy, Coordinate, Atmospheric |
| `engine/{core,time,nutation,atmosphere,tracing}/` | Engine support (JD/ΔT, tracing) |
| `fiqh/` | 6 moon-sighting strategies (Umm al-Qura, ISNA, Diyanet, Moonsighting Committee, Local Observation, Astronomical) + registry |
| `visualization/` | Render adapters (prayer timeline, crescent, qibla arc, solar/lunar path, horizon) — for future charts |
| `knowledge/` | Astronomy ↔ Qur'an concept graph & explanations |
| `infrastructure/` | Datasets, observatory profiles, validation, reporting |
| `models/` | `types.ts` (shared types) + `contracts.ts` (engine interfaces) |
| `pages/` | `AstronomyHome.tsx` — the "Islamic Sky" page |
| `mock/` | Calculation methods + sample concept data |

## Current defaults

- **Location:** Srinagar, Kashmir (nearest major city to Pulwama).
- **Prayer method:** University of Islamic Sciences, Karachi — the regional
  standard for Kashmir/South Asia (not asserted as theologically superior).
- Both are easily changeable; a location/method **selector is a planned add**.

## History

The former `celestial/` subsystem (star catalogs, constellations, deep-sky
objects, satellite tracking, planetary ephemerides), the module-local `docs/`,
and the academic "encyclopedia" pages were **removed on 2026-07-26** — they
served general astronomy, not the Islamic-worship aim. All recoverable from git
history if ever needed.

## For the Salat Tracker (deferred here by design)

The engine already supports these — build the *UI* in the Salat Tracker:

1. **Hilal visibility** for Ramadan/Eid → `engine/math/MoonVisibilityEngine`
   (Yallop / Odeh / Danjon criteria) + `fiqh/` sighting strategies.
2. **Forbidden / recommended prayer times** (sunrise, zawal, sunset; Duha; last
   third of the night) → `SolarEventsEngine` + prayer/midnight times.
3. **Calculation-vs-sighting (ru'yah) framing** — a fiqh/authenticity decision
   for the user; never assert it as settled.

## Status

Compiles clean (0 TypeScript errors). **111 / 111 tests pass** (51 files).
