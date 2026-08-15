import {
  ObserverLocation,
  AtmosphericConditions,
  JulianDate,
  SolarCoordinates,
  LunarCoordinates,
  SolarEvent,
  LunarEvent,
  CalculationMethod,
  GregorianDate,
  HijriDate,
  NewMoonEvent,
  HijriDateResult,
  HijriCalendarType,
  MoonVisibilityResult,
  CrescentParameters,
  CriterionEvaluation,
  EngineResult
} from './types';

export type { EngineResult };

export interface ISolarEphemerisEngine {
  calculateSolarCoordinates(
    jd: JulianDate,
    location?: ObserverLocation,
    atmosphere?: AtmosphericConditions
  ): EngineResult<SolarCoordinates>;

  calculateSolarEvent(
    event: SolarEvent,
    date: JulianDate,
    location: ObserverLocation,
    atmosphere?: AtmosphericConditions,
    method?: CalculationMethod
  ): EngineResult<JulianDate | null>;
}

export interface ISolarEventsEngine {
  calculateEvent(
    jd: JulianDate,
    location: ObserverLocation,
    event: SolarEvent,
    atmosphere?: AtmosphericConditions
  ): EngineResult<JulianDate | null>;

  calculateAltitudeEvent(
    jd: JulianDate,
    location: ObserverLocation,
    targetAltitude: number,
    isMorning: boolean
  ): EngineResult<JulianDate | null>;
}

export interface IAsrEngine {
  calculateAsr(
    jd: JulianDate, // Midnight of the day
    location: ObserverLocation,
    shadowFactor: 1 | 2,
    atmosphere?: AtmosphericConditions
  ): EngineResult<JulianDate | null>;
}

export interface IHighLatitudeEngine {
  applyHighLatitudeRules(
    prayerTimes: PrayerTimes,
    jd: JulianDate,
    location: ObserverLocation,
    method: CalculationMethod
  ): EngineResult<PrayerTimes>;
}

export interface ILunarEphemerisEngine {
  /**
   * Calculates the highly accurate Geocentric and Equatorial coordinates of the Moon.
   * Based on Jean Meeus Astronomical Algorithms, Chapter 47.
   */
  calculateLunarCoordinates(jd: JulianDate, location?: ObserverLocation, atmosphere?: AtmosphericConditions): EngineResult<LunarCoordinates>;
}

export interface IMoonRiseSetEngine {
  calculateRiseSet(jd: JulianDate, location: ObserverLocation, atmosphere?: AtmosphericConditions): EngineResult<{ rise: JulianDate | null, set: JulianDate | null }>;
}

export interface IMoonTransitEngine {
  calculateTransit(jd: JulianDate, location: ObserverLocation): EngineResult<JulianDate | null>;
}

export interface ILunarPhaseEngine {
  calculatePhase(jd: JulianDate): EngineResult<{ phaseAngle: number, illuminatedFraction: number, ageDays: number }>;
}

export interface ILunarEventEngine {
  calculateLunarEvent(
    event: LunarEvent,
    date: JulianDate,
    location: ObserverLocation
  ): EngineResult<JulianDate | null>;
}

export interface PrayerTimes {
  fajr: JulianDate | null;
  sunrise: JulianDate | null;
  dhuhr: JulianDate | null;
  asrStandard: JulianDate | null; // Shafi'i, Maliki, Hanbali
  asrHanafi: JulianDate | null;   // Hanafi
  maghrib: JulianDate | null;
  isha: JulianDate | null;
  midnight: JulianDate | null;
}

export interface IPrayerTimeEngine {
  calculatePrayerTimes(
    date: GregorianDate | JulianDate,
    location: ObserverLocation,
    method: CalculationMethod,
    atmosphere?: AtmosphericConditions
  ): EngineResult<PrayerTimes>;
}

export interface QiblaResult {
  azimuthDegrees: number;
  reverseBearingDegrees: number;
  distanceKm: number;
  greatCircleArcDegrees?: number;
  methodUsed: 'Vincenty' | 'Karney' | 'Spherical';
}

export interface IQiblaEngine {
  calculateQibla(
    location: ObserverLocation
  ): EngineResult<QiblaResult>;
}

export interface INewMoonEngine {
  calculateConjunction(jd: JulianDate): EngineResult<NewMoonEvent>;
  calculateLunation(k: number): EngineResult<NewMoonEvent>;
  calculateNearestConjunction(jd: JulianDate): EngineResult<NewMoonEvent>;
  calculateNextConjunction(jd: JulianDate): EngineResult<NewMoonEvent>;
  calculatePreviousConjunction(jd: JulianDate): EngineResult<NewMoonEvent>;
}

export interface IHijriCalendarEngine {
  /**
   * @param offsetDays Only consulted when `strategy === 'ManualSighting'`. Whole-day
   * adjustment (+/-) applied on top of the astronomical date so the displayed date can
   * be aligned to a local moon-sighting committee's announcement.
   */
  gregorianToHijri(date: GregorianDate, strategy?: HijriCalendarType, offsetDays?: number): EngineResult<HijriDateResult>;
  hijriToGregorian(date: HijriDate, strategy?: HijriCalendarType): EngineResult<GregorianDate>;
}

export interface VisibilityResult {
  isVisible: boolean;
  category: string; // e.g., 'Easily Visible', 'Need Optical Aid'
  bestTime: JulianDate;
  elongation: number;
  illumination: number;
  altitudeAtSunset: number;
  lagTimeMinutes: number;
}

export interface IMoonVisibilityEngine {
  calculateCrescentParameters(
    jd: JulianDate, // Target date (e.g. 29th of Hijri month at Sunset)
    location: ObserverLocation,
    atmosphere?: AtmosphericConditions
  ): EngineResult<CrescentParameters>;

  evaluateVisibility(
    jd: JulianDate,
    location: ObserverLocation,
    atmosphere?: AtmosphericConditions
  ): EngineResult<MoonVisibilityResult>;
}

export interface IObservationEngine {
  evaluateAllCriteria(params: CrescentParameters): {
    danjon: CriterionEvaluation;
    yallop: CriterionEvaluation;
    odeh: CriterionEvaluation;
    ilyas: CriterionEvaluation;
    bruin: CriterionEvaluation;
  };
}

export interface IAtmosphericCorrectionEngine {
  calculateRefraction(
    trueAltitude: number,
    conditions: AtmosphericConditions
  ): EngineResult<number>;
}
