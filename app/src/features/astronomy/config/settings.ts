import { calculationMethods } from '../mock/calculation-methods';
import type { CalculationMethod, ObserverLocation, HijriCalendarType } from '../models';
import { readJSON } from './location';

export const METHOD_KEY = 'adq.astronomy.method';
export const SETTINGS_KEY = 'adq.astronomy.settings';
export const DEFAULT_METHOD_ID = 'method:karachi';

export const HIJRI_STRATEGY_KEY = 'adq.astronomy.hijriStrategy';
export const HIJRI_OFFSET_KEY = 'adq.astronomy.hijriOffset';

/** The three Hijri date methods the user can choose between (see settings UI). */
export type HijriStrategyChoice = Extract<HijriCalendarType, 'Astronomical' | 'UmmAlQura' | 'ManualSighting'>;
const HIJRI_STRATEGIES: HijriStrategyChoice[] = ['Astronomical', 'UmmAlQura', 'ManualSighting'];
export const DEFAULT_HIJRI_STRATEGY: HijriStrategyChoice = 'Astronomical';
const HIJRI_OFFSET_LIMIT = 5;

/** The user's chosen Hijri calculation method (from localStorage), or the default. */
export function readHijriStrategy(): HijriStrategyChoice {
  const v = readJSON<HijriStrategyChoice>(HIJRI_STRATEGY_KEY, DEFAULT_HIJRI_STRATEGY);
  return (HIJRI_STRATEGIES as string[]).includes(v) ? v : DEFAULT_HIJRI_STRATEGY;
}
export function writeHijriStrategy(s: HijriStrategyChoice): void {
  try { localStorage.setItem(HIJRI_STRATEGY_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

/**
 * Manual sighting offset in whole days (+/-), only used when the strategy is
 * 'ManualSighting'. Lets the user align the displayed Hijri date to their
 * local moon-sighting committee's announcement. Clamped to +/-5 days.
 */
export function readHijriOffset(): number {
  const v = readJSON<number>(HIJRI_OFFSET_KEY, 0);
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(-HIJRI_OFFSET_LIMIT, Math.min(HIJRI_OFFSET_LIMIT, Math.round(n))) : 0;
}
export function writeHijriOffset(days: number): void {
  const clamped = Math.max(-HIJRI_OFFSET_LIMIT, Math.min(HIJRI_OFFSET_LIMIT, Math.round(days) || 0));
  try { localStorage.setItem(HIJRI_OFFSET_KEY, JSON.stringify(clamped)); } catch { /* ignore */ }
}

/** Full list of calculation methods offered in the selector. */
export const METHODS: CalculationMethod[] = calculationMethods;

export interface MethodOverride {
  fajrAngle?: number;
  ishaAngle?: number;
  elevation?: number;
}
/** Per-method overrides, keyed by method id. */
export type SettingsMap = Record<string, MethodOverride>;

export function getMethod(id: string): CalculationMethod {
  return METHODS.find((m) => m.id === id) ?? METHODS.find((m) => m.id === DEFAULT_METHOD_ID)!;
}

export function readMethodId(): string {
  const id = readJSON<string>(METHOD_KEY, DEFAULT_METHOD_ID);
  return METHODS.some((m) => m.id === id) ? id : DEFAULT_METHOD_ID;
}
export function writeMethodId(id: string): void {
  try { localStorage.setItem(METHOD_KEY, JSON.stringify(id)); } catch { /* ignore */ }
}

export function readSettings(): SettingsMap {
  return readJSON<SettingsMap>(SETTINGS_KEY, {});
}
export function writeSettings(s: SettingsMap): void {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

/** The selected method with any Fajr/Isha angle overrides applied. */
export function effectiveMethod(id: string, settings: SettingsMap): CalculationMethod {
  const base = getMethod(id);
  const o = settings[id] ?? {};
  return {
    ...base,
    fajr: base.fajr.type === 'SunAngle' && o.fajrAngle != null ? { ...base.fajr, angle: o.fajrAngle } : base.fajr,
    isha: base.isha.type === 'SunAngle' && o.ishaAngle != null ? { ...base.isha, angle: o.ishaAngle } : base.isha,
  };
}

/**
 * The location used for calculation. Standard timetables compute sunrise/sunset at
 * the SEA-LEVEL horizon, so we default the elevation (horizon dip) to 0 and only
 * apply a value when the user explicitly sets an elevation override. This keeps the
 * app's times in line with published almanacs; the location's true geographic
 * elevation is still available on `loc` for display/education.
 */
export function effectiveLocation(loc: ObserverLocation, id: string, settings: SettingsMap): ObserverLocation {
  const o = settings[id] ?? {};
  const elevation = o.elevation ?? 0;
  return { ...loc, elevation, coordinates: { ...loc.coordinates, elevation } };
}
