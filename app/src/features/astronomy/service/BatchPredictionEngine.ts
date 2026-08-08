import {
  ObserverLocation,
  HijriCalendarType,
  EclipseResult,
  HijriDateResult
} from '../models';
import { EclipseEngine } from '../engine/math/EclipseEngine';
import { HijriCalendarEngine } from '../engine/math/HijriCalendarEngine';

export class BatchPredictionEngine {
  private eclipseEngine = new EclipseEngine();
  private hijriEngine = new HijriCalendarEngine();

  /**
   * Generates long-range century eclipse tables for a span of years (e.g. 2026 to 2125).
   */
  public async generateCenturyEclipseTable(
    startYear: number,
    numYears: number = 100,
    location?: ObserverLocation
  ): Promise<EclipseResult[]> {
    const allEclipses: EclipseResult[] = [];
    for (let yr = startYear; yr < startYear + numYears; yr++) {
      const res = this.eclipseEngine.calculateEclipses(yr, location);
      allEclipses.push(...res.data);
    }
    return allEclipses;
  }

  /**
   * Generates long-range Hijri year mapping tables.
   */
  public async generateCenturyHijriTable(
    startYear: number,
    numYears: number = 100,
    strategy: HijriCalendarType = 'Astronomical'
  ): Promise<HijriDateResult[]> {
    const results: HijriDateResult[] = [];
    for (let yr = startYear; yr < startYear + numYears; yr++) {
      const date = { year: yr, month: 1, day: 1, hour: 12, minute: 0, second: 0 };
      const res = this.hijriEngine.gregorianToHijri(date, strategy);
      if (res.data) results.push(res.data);
    }
    return results;
  }
}
