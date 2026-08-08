/**
 * Salaat tracker persistence. Real user data only — logged in localStorage,
 * never seeded with fake history. Pure helpers; the UI reads/writes through these.
 */

export type PrayerStatus = 'prayed' | 'jamaah' | 'delayed' | 'missed';
export type Place = 'home' | 'mosque';
export type PrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerEntry { status: PrayerStatus; place?: Place }
export type DayLog = Partial<Record<PrayerId, PrayerEntry>>;
export type TrackerLog = Record<string, DayLog>;

export const PRAYER_IDS: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const KEY = 'adq.salaat.tracker';

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function readLog(): TrackerLog {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TrackerLog) : {};
  } catch { return {}; }
}
export function writeLog(log: TrackerLog): void {
  try { localStorage.setItem(KEY, JSON.stringify(log)); } catch { /* ignore */ }
}

/** Toggle/replace one prayer's entry for a day; passing null clears it. */
export function setEntry(log: TrackerLog, day: Date, id: PrayerId, entry: PrayerEntry | null): TrackerLog {
  const k = dateKey(day);
  const dayLog: DayLog = { ...(log[k] ?? {}) };
  if (entry) dayLog[id] = entry;
  else delete dayLog[id];
  const next = { ...log, [k]: dayLog };
  if (Object.keys(dayLog).length === 0) delete next[k];
  return next;
}

const isObserved = (e?: PrayerEntry) => !!e && e.status !== 'missed';

export interface DayCounts { prayed: number; jamaah: number; delayed: number; missed: number; observed: number; logged: number; total: number }

export function dayCounts(log: TrackerLog, day: Date): DayCounts {
  const d = log[dateKey(day)] ?? {};
  let prayed = 0, jamaah = 0, delayed = 0, missed = 0;
  for (const id of PRAYER_IDS) {
    const s = d[id]?.status;
    if (s === 'prayed') prayed++;
    else if (s === 'jamaah') jamaah++;
    else if (s === 'delayed') delayed++;
    else if (s === 'missed') missed++;
  }
  const observed = prayed + jamaah + delayed;
  return { prayed, jamaah, delayed, missed, observed, logged: observed + missed, total: 5 };
}

/** Consecutive days (ending today) that a given prayer was observed. Today unset does not break it; today missed does. */
export function streak(log: TrackerLog, id: PrayerId, today: Date): number {
  let count = 0;
  for (let i = 0; i < 730; i++) {
    const d = addDays(today, -i);
    const entry = log[dateKey(d)]?.[id];
    if (isObserved(entry)) { count++; continue; }
    if (i === 0 && !entry) continue; // today not logged yet — day is ongoing
    break;
  }
  return count;
}

/** All-five streak: consecutive fully-observed days ending today (today counts only if complete). */
export function fullDayStreak(log: TrackerLog, today: Date): number {
  let count = 0;
  for (let i = 0; i < 730; i++) {
    const d = addDays(today, -i);
    const c = dayCounts(log, d);
    if (c.observed === 5) { count++; continue; }
    if (i === 0) continue; // today may be incomplete
    break;
  }
  return count;
}

export interface RangeStats { observed: number; missed: number; possible: number; days: number }

/** Observed vs missed over the last `days` days (including today). */
export function rangeStats(log: TrackerLog, today: Date, days: number): RangeStats {
  let observed = 0, missed = 0;
  for (let i = 0; i < days; i++) {
    const c = dayCounts(log, addDays(today, -i));
    observed += c.observed;
    missed += c.missed;
  }
  return { observed, missed, possible: days * 5, days };
}
