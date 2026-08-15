import {
  ObserverLocation,
  GregorianDate,
  JulianDate,
  SolarCoordinates,
  LunarCoordinates,
  PrayerTimes,
  CalculationMethod,
  HijriDateResult,
  HijriCalendarType,
  QiblaResult,
  MoonVisibilityResult,
  AtmosphericConditions
} from '../models';

export type DeepReadonly<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export interface DailyAstronomyOptions {
  includeSun?: boolean;
  includeMoon?: boolean;
  includePrayerTimes?: boolean;
  includeHijri?: boolean;
  includeQibla?: boolean;
  includeVisibility?: boolean;
  calculationMethod?: CalculationMethod;
  hijriStrategy?: HijriCalendarType;
  /** Only consulted when hijriStrategy === 'ManualSighting'. See IHijriCalendarEngine. */
  hijriOffsetDays?: number;
  atmosphere?: AtmosphericConditions;
}

export interface VersionMetadata {
  engineVersion: string;
  algorithmVersion: string;
  datasetVersion: string;
}

export interface DailyAstronomyPayload {
  location: ObserverLocation;
  date: GregorianDate;
  julianDate: JulianDate;
  sun?: {
    coordinates: SolarCoordinates;
    events: Record<string, JulianDate | null>;
  };
  moon?: {
    coordinates: LunarCoordinates;
    phase: { phaseAngle: number; illuminatedFraction: number; ageDays: number };
  };
  prayerTimes?: PrayerTimes;
  hijri?: HijriDateResult;
  qibla?: QiblaResult;
  visibility?: MoonVisibilityResult;
  warnings: string[];
  version: VersionMetadata;
  computationTimeMs: number;
  traceId: string;
}

export type DailyAstronomyResult = DeepReadonly<DailyAstronomyPayload>;

export type PlatformEventType =
  | 'beforeCalculation'
  | 'afterCalculation'
  | 'warning'
  | 'error'
  | 'cacheHit'
  | 'cacheMiss';

export interface PlatformEvent {
  type: PlatformEventType;
  timestamp: number;
  engineName?: string;
  message?: string;
  data?: unknown;
}

export type PlatformEventListener = (event: PlatformEvent) => void;
