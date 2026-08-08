export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number; // Elevation in meters
  elevation?: number; // Elevation in meters (alias used across engines/registries)
}

export interface ObserverLocation {
  id?: string;
  name: string;
  coordinates: Coordinates;
  timezone: string; // IANA timezone string e.g., 'America/New_York'
  elevation?: number; // meters above sea level (optional convenience accessor)
}

export interface Elevation {
  altitude: number; // meters above sea level
  pressure?: number; // millibars
  temperature?: number; // celsius
}

export interface HorizonProfile {
  azimuthStart: number;
  azimuthEnd: number;
  altitudeOffset: number; // For mountain blocking or dip
}

export interface AtmosphericConditions {
  temperature: number; // Celsius
  pressure: number; // millibars
  humidity?: number; // Percentage
  lapseRate?: number; // Temperature lapse rate
}

export interface RefractionModel {
  type: 'Standard' | 'Saemundsson' | 'Bennett' | 'Garfinkel';
  description: string;
}

export interface EarthEllipsoid {
  name: string;
  equatorialRadius: number;
  polarRadius: number;
  flattening: number;
}

// =======================
// Time Models
// =======================
export type TimeScale = 'UTC' | 'TT' | 'UT1' | 'TAI' | 'TDB';
export type Epoch = 'J2000.0' | 'B1950.0' | 'J1900.0';

export interface JulianDate {
  value: number; // The Julian Date
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  timezoneOffset?: number; // Offset in hours
}

export interface HijriDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export enum HijriMonth {
  Muharram = 1,
  Safar = 2,
  RabiAlAwwal = 3,
  RabiAlThani = 4,
  JumadaAlAwwal = 5,
  JumadaAlThani = 6,
  Rajab = 7,
  Shaaban = 8,
  Ramadan = 9,
  Shawwal = 10,
  DhulQiDah = 11,
  DhulHijjah = 12
}

export type SolarEclipseType = 'None' | 'Partial' | 'Annular' | 'Total' | 'Hybrid';
export type LunarEclipseType = 'None' | 'Penumbral' | 'Partial' | 'Total';

export interface EclipseContactTimes {
  c1?: JulianDate;
  c2?: JulianDate;
  maximum: JulianDate;
  c3?: JulianDate;
  c4?: JulianDate;
}

export interface EclipseResult {
  eventType: 'Solar' | 'Lunar';
  eclipseType: SolarEclipseType | LunarEclipseType;
  greatestEclipseJD: JulianDate;
  greatestEclipseUTC: string;
  gamma: number;
  magnitude: number;
  obscuration: number;
  contactTimes: EclipseContactTimes;
  isVisibileLocally?: boolean;
}

export type AstronomicalEventType =
  | 'MarchEquinox'
  | 'JuneSolstice'
  | 'SeptemberEquinox'
  | 'DecemberSolstice'
  | 'Perihelion'
  | 'Aphelion'
  | 'LunarPerigee'
  | 'LunarApogee'
  | 'Supermoon'
  | 'Micromoon'
  | 'BlueMoon'
  | 'BlackMoon';

export interface AstronomicalEventResult {
  eventType: AstronomicalEventType;
  date: JulianDate;
  utcDate: string;
  description: string;
  distanceKm?: number;
}

export interface VisibilityGridCell {
  latitude: number;
  longitude: number;
  danjonCode: string;
  yallopCode: string;
  odehCode: string;
  bruinCode: string;
}

export interface VisibilityGridResult {
  julianDate: JulianDate;
  utcDate: string;
  resolutionDegrees: number;
  cells: VisibilityGridCell[];
}

export interface ObservationScheduleResult {
  date: GregorianDate;
  astronomicalNightStart: JulianDate | null;
  astronomicalNightEnd: JulianDate | null;
  civilNightStart: JulianDate | null;
  civilNightEnd: JulianDate | null;
  bestObservationWindow: { start: JulianDate | null; end: JulianDate | null };
  moonlessWindow: { start: JulianDate | null; end: JulianDate | null };
  milkyWayVisibilityWindow: { start: JulianDate | null; end: JulianDate | null };
}

export type HijriCalendarType =
  | 'Astronomical'
  | 'UmmAlQura'
  | 'Diyanet'
  | 'ISNA'
  | 'MoonsightingCommittee'
  | 'LocalObservation'
  | 'Custom';

export interface ScientificMetadata {
  references: string[];
  algorithms: string[];
  datasets: string[];
  assumptions: string[];
  uncertainty: Record<string, number>;
}

export interface EngineResult<T> {
  data: T;
  computationTimeMs: number;
  warnings?: string[];
  trace?: Array<Record<string, unknown>>;
  scientificMetadata?: ScientificMetadata;
}

export interface HijriDateResult {
  year: number;
  month: number;
  day: number;
  monthName: string;
  weekday: number;
  isLeapYear: boolean;
  calendarStrategy: string;
  lunationNumber: number;
  monthStartJD: number;
  monthStartUTC: string;
  basedOnConjunction: boolean;
  traceId: string;
}

export interface Lunation {
  k: number;
  meanConjunctionJD: number;
  trueConjunctionJD: number;
}

export interface NewMoonEvent {
  lunationNumber: number;
  meanConjunctionJD: number;
  trueConjunctionJD: number;
  utcDate: string;
}

export interface HijriEpoch {
  julianDay: number;
  gregorianEquivalent: string;
  hijriEquivalent: string;
  reference: string;
  source: string;
}

export interface DeltaT {
  value: number; // Delta T in seconds
  method: string;
}

// =======================
// Coordinate Systems
// =======================
export interface EquatorialCoordinates {
  rightAscension: number; // Hours or Degrees
  declination: number; // Degrees
  distance?: number; // AU or km
}

export interface HorizontalCoordinates {
  azimuth: number; // Degrees
  altitude: number; // Degrees
}

export interface EclipticCoordinates {
  eclipticLongitude: number; // Degrees
  eclipticLatitude: number; // Degrees
  distance?: number;
}

export interface SolarCoordinates {
  equatorial: EquatorialCoordinates;
  horizontal?: HorizontalCoordinates;
  ecliptic?: EclipticCoordinates;
  distanceAU: number;
  angularDiameter: number;
}

export interface LunarCoordinates {
  equatorial: EquatorialCoordinates;
  horizontal?: HorizontalCoordinates;
  ecliptic?: EclipticCoordinates;
  distanceKm: number;
  angularDiameter: number;
  phaseAngle?: number;
  illumination?: number; // 0 to 1
  parallax?: number; // horizontal parallax in degrees
}

export interface OrbitalElements {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  ascendingNode: number;
  argumentOfPeriapsis: number;
  meanAnomaly: number;
  epoch: Epoch;
}

// =======================
// Events & Methods
// =======================
export type CelestialObject = 'Sun' | 'Moon' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Star';

export type SolarEvent = 
  | 'AstronomicalDawn' 
  | 'NauticalDawn' 
  | 'CivilDawn' 
  | 'BlueHourMorning' 
  | 'GoldenHourMorning'
  | 'Sunrise' 
  | 'SolarNoon' 
  | 'GoldenHourEvening'
  | 'BlueHourEvening'
  | 'Sunset' 
  | 'CivilDusk' 
  | 'NauticalDusk' 
  | 'AstronomicalDusk' 
  | 'SolarMidnight';

export type LunarEvent = 'Moonrise' | 'Moonset' | 'Conjunction' | 'Opposition' | 'FirstCrescent' | 'LastCrescent';

export interface TwilightDefinition {
  type: 'SunAngle' | 'MinutesAfterSunset' | 'FixedTime';
  angle?: number;
  minutes?: number;
}

export interface CalculationMethod {
  id: string;
  name: string;
  region: string;
  authority: string;
  fajr: TwilightDefinition;
  isha: TwilightDefinition;
  maghrib?: TwilightDefinition;
  midnight: 'Standard' | 'Jafari';
  country?: string;
  highLatitudeMethod?: 'AngleBased' | 'Midnight' | 'OneSeventh' | 'None';
  historicalNotes?: string;
  references?: string[];
}

export interface AstronomyEvidence {
  source: 'Quran' | 'Hadith' | 'Fatawa' | 'Historical';
  text: string;
  reference: string;
}

export interface AstronomyConcept {
  id: string;
  title: string;
  explanation: string;
  importanceInIslam: string;
  relatedConceptIds: string[];
  evidence?: AstronomyEvidence[];
}

// =======================
// Moon Visibility Models (Phase 3D)
// =======================
export type VisibilityCriterion = 'Danjon' | 'Yallop' | 'Odeh' | 'Ilyas' | 'Bruin';

export type MoonVisibilityClassification =
  | 'Easily Visible'
  | 'Visible under Ideal Conditions'
  | 'Optical Aid Recommended'
  | 'Optical Aid Required'
  | 'Not Visible'
  | 'Below Danjon Limit';

export interface CrescentParameters {
  conjunctionTime: JulianDate;
  sunset: JulianDate;
  moonset: JulianDate | null;
  lagTimeMinutes: number;
  moonAgeHours: number;
  illuminationFraction: number; // 0..1
  elongation: number; // degrees (ARCL)
  arcOfLight: number; // degrees (ARCL)
  arcOfVision: number; // degrees (ARCV)
  relativeAzimuth: number; // degrees (DAZ)
  lunarAltitude: number; // degrees
  solarAltitude: number; // degrees
  lunarAzimuth: number; // degrees
  solarAzimuth: number; // degrees
  crescentWidth: number; // arcminutes (W)
  horizontalParallax: number; // degrees
  refractionCorrection: number; // degrees
}

export interface CriterionEvaluation {
  criterion: VisibilityCriterion;
  classification: MoonVisibilityClassification;
  code: string; // e.g., 'A', 'B', 'C', 'D', 'E', 'F'
  score?: number; // e.g., Yallop q value or Odeh V value
  description: string;
}

export interface MoonVisibilityResult {
  parameters: CrescentParameters;
  evaluations: {
    danjon: CriterionEvaluation;
    yallop: CriterionEvaluation;
    odeh: CriterionEvaluation;
    ilyas: CriterionEvaluation;
    bruin: CriterionEvaluation;
  };
  confidence: 'Low' | 'Medium' | 'High';
  traceId: string;
}
