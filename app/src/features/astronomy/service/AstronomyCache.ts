import { DailyAstronomyOptions, DailyAstronomyResult } from './types';
import { ObserverLocation, GregorianDate } from '../models';

export class AstronomyCache {
  private cache = new Map<string, DailyAstronomyResult>();
  private maxEntries: number;

  constructor(maxEntries: number = 500) {
    this.maxEntries = maxEntries;
  }

  public generateKey(
    location: ObserverLocation,
    date: GregorianDate,
    options?: DailyAstronomyOptions
  ): string {
    const elevation = location.elevation ?? location.coordinates.elevation ?? location.coordinates.altitude ?? 0;
    const locKey = `${location.coordinates.latitude.toFixed(4)},${location.coordinates.longitude.toFixed(4)},${elevation}`;
    const dateKey = `${date.year}-${date.month}-${date.day}`;
    // Include the twilight parameters, not just the method id: custom Fajr/Isha
    // angles must produce distinct cache entries or overrides would be ignored.
    const cm = options?.calculationMethod;
    const twilight = (t?: { type?: string; angle?: number; minutes?: number }) =>
      t ? `${t.type ?? ''}${t.angle ?? ''}${t.minutes ?? ''}` : '';
    const methodKey = cm
      ? `${cm.id}[f:${twilight(cm.fajr)}|i:${twilight(cm.isha)}|mg:${twilight(cm.maghrib)}|mid:${cm.midnight ?? ''}]`
      : 'defaultMethod';
    const strategyKey = `${options?.hijriStrategy ?? 'Astronomical'}${options?.hijriStrategy === 'ManualSighting' ? `:${options?.hijriOffsetDays ?? 0}` : ''}`;
    const atmosphereKey = options?.atmosphere
      ? `${options.atmosphere.temperature},${options.atmosphere.pressure}`
      : 'standardAtmo';

    const optsKey = [
      options?.includeSun ?? true,
      options?.includeMoon ?? true,
      options?.includePrayerTimes ?? true,
      options?.includeHijri ?? true,
      options?.includeQibla ?? true,
      options?.includeVisibility ?? true
    ].join(',');

    return `${locKey}|${dateKey}|${methodKey}|${strategyKey}|${atmosphereKey}|${optsKey}`;
  }

  public get(key: string): DailyAstronomyResult | undefined {
    return this.cache.get(key);
  }

  public set(key: string, value: DailyAstronomyResult): void {
    if (this.cache.size >= this.maxEntries) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  public clear(): void {
    this.cache.clear();
  }

  public get size(): number {
    return this.cache.size;
  }
}
