import type { DaySchedule } from './schedule';

/**
 * Adhkār progress & counter state — pure, localStorage-backed, per date.
 * No fabricated data: everything starts empty and the timed sets reset each day.
 * The UI renders this and calls the setters; it performs no logic of its own.
 */

const KEY = 'adq.adhkar.progress';

// { 'YYYY-MM-DD': { entryId: countReached } }
export type AdhkarProgress = Record<string, Record<string, number>>;

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function readProgress(): AdhkarProgress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AdhkarProgress) : {};
  } catch { return {}; }
}

export function writeProgress(p: AdhkarProgress): void {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

export function getCount(p: AdhkarProgress, date: Date, id: string): number {
  return p[dayKey(date)]?.[id] ?? 0;
}

/** Increment one dhikr, capping at `repeat`. Returns a new progress object. */
export function increment(p: AdhkarProgress, date: Date, id: string, repeat: number): AdhkarProgress {
  const k = dayKey(date);
  const cur = p[k]?.[id] ?? 0;
  const next = Math.min(repeat, cur + 1);
  return { ...p, [k]: { ...(p[k] ?? {}), [id]: next } };
}

/** Reset a single dhikr's count to 0. */
export function resetEntry(p: AdhkarProgress, date: Date, id: string): AdhkarProgress {
  const k = dayKey(date);
  const day = { ...(p[k] ?? {}) };
  delete day[id];
  return { ...p, [k]: day };
}

export const isComplete = (count: number, repeat: number): boolean => count >= repeat;

/** How many entries in a set are complete today (for the gentle progress indicator). */
export function setCompletion(
  p: AdhkarProgress, date: Date, entries: { id: string; repeat: number }[],
): { done: number; total: number } {
  const day = p[dayKey(date)] ?? {};
  let done = 0;
  for (const e of entries) if ((day[e.id] ?? 0) >= e.repeat) done += 1;
  return { done, total: entries.length };
}

/** Which timed set is "active now": morning (Fajr→sunrise) or evening (ʿAṣr→Maghrib). */
export type ActiveSet = 'morning' | 'evening' | null;

export function activeAdhkarSet(schedule: DaySchedule, now: Date): ActiveSet {
  const { fajr, sunrise, asr, maghrib } = schedule.times;
  const t = now.getTime();
  if (fajr && sunrise && t >= fajr.getTime() && t < sunrise.getTime()) return 'morning';
  if (asr && maghrib && t >= asr.getTime() && t < maghrib.getTime()) return 'evening';
  return null;
}
