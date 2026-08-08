import { PrayerTimeEngine } from '../../astronomy/engine/math/PrayerTimeEngine';
import { SolarEventsEngine } from '../../astronomy/engine/math/SolarEventsEngine';
import { TimeEngine } from '../../astronomy/engine/math/TimeEngine';
import type { CalculationMethod, JulianDate, ObserverLocation } from '../../astronomy/models';
import type { Madhhab } from '../../astronomy/config/location';

/**
 * Salaat schedule — the Salaat Tracker's read of the Astronomy engine.
 * Pure functions: the UI performs NO time arithmetic, it renders this.
 * Times are astronomically exact; window spans and nafl bounds use widely
 * accepted conventions and are labelled as such (never presented as the only
 * valid opinion). Evidence carries a verification status for the UI badge.
 */

const engine = new PrayerTimeEngine();
const solarEvents = new SolarEventsEngine();

/**
 * Evening twilight bands for a given date, computed from the engine (NOT fixed):
 * civil (0°→−6°), nautical (−6°→−12°), astronomical (−12°→−18°). Durations vary
 * with the date/latitude/season; at high latitudes in summer a deeper angle may
 * never be reached (durationMin = null → twilight does not end that night).
 */
export interface TwilightBand {
  key: 'civil' | 'nautical' | 'astronomical';
  label: string;
  range: string;              // e.g. "0° to −6°"
  morningMin: number | null;  // dawn side (before sunrise)
  eveningMin: number | null;  // dusk side (after sunset); null = sun never reaches the deeper angle
}

export function computeTwilightBands(base: Date, location: ObserverLocation): TwilightBand[] {
  const g = { year: base.getFullYear(), month: base.getMonth() + 1, day: base.getDate() };
  const j = TimeEngine.calculateJulianDate(g);
  const evAt = (deg: number) => jd(solarEvents.calculateAltitudeEvent(j, location, -Math.abs(deg), false).data); // dusk
  const mAt = (deg: number) => jd(solarEvents.calculateAltitudeEvent(j, location, -Math.abs(deg), true).data);   // dawn
  const e0 = evAt(0.833), e6 = evAt(6), e12 = evAt(12), e18 = evAt(18);
  const m0 = mAt(0.833), m6 = mAt(6), m12 = mAt(12), m18 = mAt(18);
  const dur = (a: Date | null, b: Date | null) => (a && b ? Math.round((b.getTime() - a.getTime()) / MIN) : null);
  return [
    // dawn goes deep→shallow (…−6→sunrise); dusk goes shallow→deep (sunset→−6…).
    { key: 'civil', label: 'Civil twilight', range: '0° to −6°', morningMin: dur(m6, m0), eveningMin: dur(e0, e6) },
    { key: 'nautical', label: 'Nautical twilight', range: '−6° to −12°', morningMin: dur(m12, m6), eveningMin: dur(e6, e12) },
    { key: 'astronomical', label: 'Astronomical twilight', range: '−12° to −18°', morningMin: dur(m18, m12), eveningMin: dur(e12, e18) },
  ];
}

/** Canonical Makrūh (disliked-time) offsets, shared with the sun-path diagram. */
export const MAKRUH_POST_SUNRISE_MIN = 15;
export const MAKRUH_PRE_ZAWAL_MIN = 5;
export const MAKRUH_PRE_SUNSET_MIN = 15;

export type FiqhStatus = 'consensus' | 'scholarly-difference';

export interface PrayerKey { key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; label: string }

export interface PrayerWindow {
  key: string;
  label: string;
  start: Date | null;
  end: Date | null;
  endLabel?: string;        // e.g. "Islamic midnight (preferred)"
  preferred?: string;       // short guidance, e.g. "Pray early"
}

export interface ForbiddenWindow {
  key: string;
  label: string;
  start: Date | null;
  end: Date | null;
  reason: string;
}

export interface NaflWindow {
  key: string;
  label: string;
  start: Date | null;
  end: Date | null;
  note: string;
}

export interface Assumptions {
  methodName: string;
  methodAuthority: string;
  madhhab: Madhhab;
  fajrAngle: number | null;
  ishaAngle: number | null;
  ishaMinutes: number | null;
  elevation: number;
  locationName: string;
  timezone: string;
}

export interface DaySchedule {
  times: Record<'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', Date | null>;
  windows: PrayerWindow[];
  forbidden: ForbiddenWindow[];
  nafl: NaflWindow[];
  islamicMidnight: Date | null;
  lastThirdStart: Date | null;
  fajrNext: Date | null;
  /** Both Asr times, so the UI can show the madhhab difference. */
  asrTimes: { standard: Date | null; hanafi: Date | null };
  assumptions: Assumptions;
  /** Authentic evidence for the forbidden times (shown once, above the list). */
  forbiddenEvidence: { text: string; source: string; status: FiqhStatus };
}

function jd(j: JulianDate | null | undefined): Date | null {
  return j ? new Date((j.value - 2440587.5) * 86400000) : null;
}
const MIN = 60000;
const addMin = (d: Date | null, m: number): Date | null => (d ? new Date(d.getTime() + m * MIN) : null);

export function computeDaySchedule(
  base: Date,
  location: ObserverLocation,
  method: CalculationMethod,
  madhhab: Madhhab,
): DaySchedule {
  const g = { year: base.getFullYear(), month: base.getMonth() + 1, day: base.getDate() };
  const t = engine.calculatePrayerTimes(TimeEngine.calculateJulianDate(g), location, method).data;

  const fajr = jd(t.fajr);
  const sunrise = jd(t.sunrise);
  const dhuhr = jd(t.dhuhr);
  const asrStandard = jd(t.asrStandard);
  const asrHanafi = jd(t.asrHanafi);
  const asr = madhhab === 'hanafi' ? asrHanafi : asrStandard;
  const maghrib = jd(t.maghrib);
  const isha = jd(t.isha);

  // Tomorrow's Fajr for the night split (Islamic midnight, last third).
  const tomorrow = new Date(base.getTime() + 24 * 60 * MIN);
  const tg = { year: tomorrow.getFullYear(), month: tomorrow.getMonth() + 1, day: tomorrow.getDate() };
  const fajrNext = jd(engine.calculatePrayerTimes(TimeEngine.calculateJulianDate(tg), location, method).data.fajr);

  let islamicMidnight: Date | null = null;
  let lastThirdStart: Date | null = null;
  if (maghrib && fajrNext) {
    const nightMs = fajrNext.getTime() - maghrib.getTime();
    islamicMidnight = new Date(maghrib.getTime() + nightMs / 2);
    lastThirdStart = new Date(fajrNext.getTime() - nightMs / 3);
  }

  const windows: PrayerWindow[] = [
    { key: 'fajr', label: 'Fajr', start: fajr, end: sunrise, preferred: 'Pray early, before first light brightens' },
    { key: 'dhuhr', label: 'Dhuhr', start: dhuhr, end: asr, preferred: 'Any time in the window; earlier is better' },
    { key: 'asr', label: 'Asr', start: asr, end: maghrib, preferred: 'Pray before the sun yellows' },
    { key: 'maghrib', label: 'Maghrib', start: maghrib, end: isha, preferred: 'Pray soon after sunset' },
    { key: 'isha', label: 'Isha', start: isha, end: fajrNext, endLabel: 'Ends at the start of Fajr', preferred: 'Best offered before Islamic midnight' },
  ];

  const forbidden: ForbiddenWindow[] = [
    { key: 'sunrise', label: 'At sunrise', start: sunrise, end: addMin(sunrise, MAKRUH_POST_SUNRISE_MIN), reason: 'While the sun is rising, until it has fully risen (~15 min).' },
    { key: 'zawal', label: 'At Zawāl (solar noon)', start: addMin(dhuhr, -MAKRUH_PRE_ZAWAL_MIN), end: dhuhr, reason: 'When the sun is at its zenith, until it passes the meridian (a few minutes).' },
    { key: 'sunset', label: 'At sunset', start: addMin(maghrib, -MAKRUH_PRE_SUNSET_MIN), end: maghrib, reason: 'While the sun is setting, until it has fully set (~15 min).' },
  ];

  // Forenoon split: from sunrise to zawāl (solar transit = Dhuhr), the first half
  // is Ishrāq, the second half is Chāsht (Ḍuḥā). Ishrāq opens ~20 min after sunrise,
  // once the post-sunrise forbidden time has passed.
  const midMorning = sunrise && dhuhr ? new Date(sunrise.getTime() + (dhuhr.getTime() - sunrise.getTime()) / 2) : null;

  const nafl: NaflWindow[] = [
    { key: 'ishraq', label: 'Ishrāq', start: addMin(sunrise, 20), end: midMorning, note: 'From ~20 minutes after sunrise (once the forbidden time has passed) until the midpoint between sunrise and zawāl.' },
    { key: 'duha', label: 'Chāsht (Ḍuḥā)', start: midMorning, end: addMin(dhuhr, -5), note: 'The later forenoon — from mid-morning until just before zawāl (midday).' },
    { key: 'awwabin', label: 'Awwābīn', start: maghrib, end: isha, note: 'Voluntary prayer between Maghrib and Isha.' },
    { key: 'tahajjud', label: 'Tahajjud · last third', start: lastThirdStart, end: fajrNext, note: 'The night prayer; the last third of the night is the most virtuous.' },
  ];

  const fajrAngle = method.fajr.type === 'SunAngle' ? (method.fajr.angle ?? null) : null;
  const ishaAngle = method.isha.type === 'SunAngle' ? (method.isha.angle ?? null) : null;
  const ishaMinutes = method.isha.type === 'MinutesAfterSunset' ? (method.isha.minutes ?? null) : null;

  return {
    times: { fajr, sunrise, dhuhr, asr, maghrib, isha },
    windows,
    forbidden,
    nafl,
    islamicMidnight,
    lastThirdStart,
    fajrNext,
    asrTimes: { standard: asrStandard, hanafi: asrHanafi },
    assumptions: {
      methodName: method.name,
      methodAuthority: method.authority,
      madhhab,
      fajrAngle,
      ishaAngle,
      ishaMinutes,
      elevation: Math.round(location.elevation ?? location.coordinates.elevation ?? location.coordinates.altitude ?? 0),
      locationName: location.name,
      timezone: location.timezone,
    },
    forbiddenEvidence: {
      text: 'There are three times at which the Messenger of Allah ﷺ forbade us to pray or to bury our dead: when the sun begins to rise until it is fully up, when the sun is at its zenith until it passes, and when the sun draws near to setting until it has set.',
      source: 'ʿUqbah ibn ʿĀmir — Sahih Muslim 831',
      status: 'consensus',
    },
  };
}

/** The five obligatory prayers in order, with the current/next resolved against `now`. */
export interface CurrentNext {
  currentKey: string | null;
  /** true when currentKey is Isha but its actual start time is in `windows` from the PREVIOUS day (before today's Fajr, still within last night's Isha window). */
  currentIsFromYesterday: boolean;
  nextKey: string;
  nextLabel: string;
  nextStart: Date;
  nextIsTomorrow: boolean;
}

export function resolveCurrentNext(windows: PrayerWindow[], fajrNext: Date | null, now: Date): CurrentNext | null {
  const five = windows.filter((w) => w.start);
  if (five.length < 5) return null;
  const nowMs = now.getTime();
  const idx = five.findIndex((w) => w.start!.getTime() > nowMs);
  if (idx === -1) {
    // After Isha start → next is tomorrow's Fajr.
    const nextStart = fajrNext ?? new Date((five[0].start!.getTime()) + 24 * 60 * MIN);
    return { currentKey: five[4].key, currentIsFromYesterday: false, nextKey: 'fajr', nextLabel: 'Fajr', nextStart, nextIsTomorrow: true };
  }
  const next = five[idx];
  // idx === 0 means `now` is before today's Fajr — last night's Isha window is
  // still open (Isha's valid time extends until Fajr begins), not "no prayer".
  // Its start time lives in YESTERDAY's windows, not today's (today's Isha is
  // still hours away), so callers must look it up in the previous day's schedule.
  if (idx === 0) {
    return { currentKey: five[4].key, currentIsFromYesterday: true, nextKey: next.key, nextLabel: next.label, nextStart: next.start!, nextIsTomorrow: false };
  }
  return { currentKey: five[idx - 1].key, currentIsFromYesterday: false, nextKey: next.key, nextLabel: next.label, nextStart: next.start!, nextIsTomorrow: false };
}
