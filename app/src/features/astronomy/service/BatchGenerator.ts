import { AstronomyPlatform } from './AstronomyPlatform';
import {
  ObserverLocation,
  CalculationMethod,
  HijriCalendarType,
  HijriDateResult,
  MoonVisibilityResult
} from '../models';
import { DailyAstronomyResult } from './types';

export class BatchGenerator {
  private platform: AstronomyPlatform;

  constructor(platform?: AstronomyPlatform) {
    this.platform = platform ?? new AstronomyPlatform();
  }

  /**
   * Generates a full monthly prayer calendar for a given location, year, and month.
   */
  public async generatePrayerCalendar(
    location: ObserverLocation,
    method: CalculationMethod,
    year: number,
    month: number
  ): Promise<DailyAstronomyResult[]> {
    const daysInMonth = new Date(year, month, 0).getDate();
    const tasks: Promise<DailyAstronomyResult>[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = { year, month, day, hour: 0, minute: 0, second: 0 };
      // Async wrapper allowing micro-task scheduling / batch parallelization
      tasks.push(
        Promise.resolve().then(() =>
          this.platform.getDailyAstronomy(location, date, {
            calculationMethod: method,
            includeSun: false,
            includeMoon: false,
            includeHijri: true,
            includeQibla: false,
            includeVisibility: false,
            includePrayerTimes: true
          })
        )
      );
    }

    return Promise.all(tasks);
  }

  /**
   * Generates a full 12-month Hijri calendar mapping for a given Gregorian year.
   */
  public async generateHijriCalendar(
    year: number,
    strategy: HijriCalendarType = 'Astronomical'
  ): Promise<HijriDateResult[]> {
    const location: ObserverLocation = {
      name: 'Makkah Baseline',
      coordinates: { latitude: 21.4225, longitude: 39.8262 },
      timezone: 'Asia/Riyadh'
    };

    const tasks: Promise<HijriDateResult>[] = [];

    // Sample 1st of each Gregorian month
    for (let month = 1; month <= 12; month++) {
      const date = { year, month, day: 1, hour: 12, minute: 0, second: 0 };
      tasks.push(
        Promise.resolve().then(() => {
          const res = this.platform.getDailyAstronomy(location, date, {
            hijriStrategy: strategy,
            includeSun: false,
            includeMoon: false,
            includePrayerTimes: false,
            includeQibla: false,
            includeVisibility: false,
            includeHijri: true
          });
          return res.hijri!;
        })
      );
    }

    return Promise.all(tasks);
  }

  /**
   * Generates annual moon visibility evaluations across all 12 months for a given location.
   */
  public async generateMoonVisibilityTable(
    location: ObserverLocation,
    year: number
  ): Promise<MoonVisibilityResult[]> {
    const tasks: Promise<MoonVisibilityResult>[] = [];

    // Evaluate visibility on the 29th of each Gregorian month
    for (let month = 1; month <= 12; month++) {
      const date = { year, month, day: 29, hour: 12, minute: 0, second: 0 };
      tasks.push(
        Promise.resolve().then(() => {
          const res = this.platform.getDailyAstronomy(location, date, {
            includeSun: false,
            includeMoon: false,
            includePrayerTimes: false,
            includeHijri: false,
            includeQibla: false,
            includeVisibility: true
          });
          return res.visibility!;
        })
      );
    }

    return Promise.all(tasks);
  }
}
