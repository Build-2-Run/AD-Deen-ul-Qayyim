import type { ObserverLocation } from '../models';

/** Default location: Srinagar, Kashmir — nearest major city to Pulwama. */
export const DEFAULT_LOCATION: ObserverLocation = {
  id: 'srinagar',
  name: 'Srinagar, Kashmir',
  coordinates: { latitude: 34.0837, longitude: 74.7973, elevation: 1585 },
  timezone: 'Asia/Kolkata',
  elevation: 1585,
};

export const LOC_KEY = 'adq.astronomy.location';
export const SAVED_KEY = 'adq.astronomy.savedLocations';
export const MADHHAB_KEY = 'adq.astronomy.madhhab';

/** Asr shadow-length school: Hanafi (2×) vs the majority Standard (1×). */
export type Madhhab = 'hanafi' | 'standard';

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** The user's chosen location (from localStorage), or the default. */
export function readLocation(): ObserverLocation {
  return readJSON(LOC_KEY, DEFAULT_LOCATION);
}

export function writeLocation(loc: ObserverLocation): void {
  try { localStorage.setItem(LOC_KEY, JSON.stringify(loc)); } catch { /* ignore */ }
}

/** Asr school (persisted). Defaults to Standard (the majority position). */
export function readMadhhab(): Madhhab {
  return readJSON<Madhhab>(MADHHAB_KEY, 'standard') === 'hanafi' ? 'hanafi' : 'standard';
}

export function writeMadhhab(m: Madhhab): void {
  try { localStorage.setItem(MADHHAB_KEY, JSON.stringify(m)); } catch { /* ignore */ }
}

