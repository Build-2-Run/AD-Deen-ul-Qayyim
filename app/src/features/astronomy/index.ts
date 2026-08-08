// ============================================================================
// Astronomy module — public API ("The Islamic Sky")
// The calculation layer behind Muslim worship: prayer times, sun events,
// moon phases & crescent (hilal), the Hijri calendar and Qibla.
// Consumers (e.g. the Salat Tracker) should import from here, not deep paths.
// ============================================================================

// Entry point: the singleton facade + its class.
export { astronomyService, AstronomyPlatform } from './service/AstronomyPlatform';

// Prayer-time conventions (default: 'method:karachi' — South Asia / Kashmir).
export { calculationMethods } from './mock/calculation-methods';

// Result + option shapes returned by astronomyService.getDailyAstronomy(...).
export type { DailyAstronomyResult, DailyAstronomyOptions } from './service/types';

// Commonly-needed domain types.
export type {
  ObserverLocation,
  CalculationMethod,
  PrayerTimes,
  QiblaResult,
  HijriDateResult,
  MoonVisibilityResult,
} from './models';
