import {
  IHijriCalendarEngine,
  GregorianDate,
  HijriDate,
  HijriDateResult,
  HijriCalendarType,
  EngineResult
} from '../../models';
import { EngineState } from '../core/EngineState';
import { NewMoonEngine } from './NewMoonEngine';
import { TimeEngine } from './TimeEngine';

export class HijriCalendarEngine implements IHijriCalendarEngine {
  private newMoonEngine = new NewMoonEngine();

  // Standard Hijri Epoch (1 Muharram 1 AH)
  // Usually considered July 16, 622 CE (Julian calendar), which is JD 1948439.5
  private readonly HIJRI_EPOCH_JD = 1948439.5;

  public gregorianToHijri(
    date: GregorianDate,
    strategy: HijriCalendarType = 'Astronomical'
  ): EngineResult<HijriDateResult> {
    const startTime = performance.now();
    const state = new EngineState();

    const jd = TimeEngine.calculateJulianDate(date);
    
    state.addTrace('HIJRI_CONVERSION_START', 'Starting Gregorian to Hijri conversion', { 
      gregorian: date, 
      jd: jd.value,
      strategy 
    });

    // Astronomical strategy relies on true conjunction.
    // 1. Find the most recent conjunction before this date.
    let prevConjunction = this.newMoonEngine.calculatePreviousConjunction(jd).data;
    
    // We determine the first day of the Islamic month.
    // In a pure Astronomical calendar, the month begins at sunset on the day of the conjunction,
    // or the day after. Let's use the simple Astronomical rule: 
    // The new month starts on the Julian day following the conjunction.
    // We'll calculate the exact Hijri month by determining how many lunations have passed since the Epoch.

    // Calculate elapsed lunations since Epoch
    // Mean synodic month = 29.530588 days
    const elapsedDays = prevConjunction.trueConjunctionJD - this.HIJRI_EPOCH_JD;
    const lunationsSinceEpoch = Math.round(elapsedDays / 29.530588);

    const totalMonths = lunationsSinceEpoch + 1; // 1-indexed month globally
    
    const hijriYear = Math.floor(totalMonths / 12) + 1;
    let hijriMonth = totalMonths % 12;
    if (hijriMonth === 0) hijriMonth = 12;

    // Day of the month is the number of days elapsed since the true conjunction JD
    // For calendar purposes, we look at midnight.
    const currentJDAtMidnight = Math.floor(jd.value - 0.5) + 0.5;
    const conjunctionJDAtMidnight = Math.floor(prevConjunction.trueConjunctionJD - 0.5) + 0.5;

    // Add 1 because the day of conjunction is day 29/30 of previous month usually,
    // and the new month starts the next day.
    let hijriDay = Math.floor(currentJDAtMidnight - conjunctionJDAtMidnight) + 1;

    // Adjust if conjunction happened late in the day (basic astronomical adjustment)
    // If conjunction happens after midnight UTC, we might shift the month start.
    // This is a basic implementation of the astronomical calendar.

    // Just standardizing day 1 as the day after conjunction.
    if (hijriDay <= 0) {
      // It means the date is actually before the astronomical start of the month,
      // fallback one month.
      hijriDay = 30; // Approximation for fallback
    }

    state.addTrace('HIJRI_MONTH_DETERMINED', 'Calculated elapsed lunations and Hijri Date', {
      lunationsSinceEpoch,
      hijriYear,
      hijriMonth,
      hijriDay
    });

    const monthNames = [
      '', 'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaaban',
      'Ramadan', 'Shawwal', 'Dhul-Qi’dah', 'Dhul-Hijjah'
    ];

    const result: HijriDateResult = {
      year: hijriYear,
      month: hijriMonth,
      day: hijriDay,
      monthName: monthNames[hijriMonth],
      weekday: (Math.floor(jd.value + 1.5) % 7), // 0=Sunday
      isLeapYear: this.isLeapYear(hijriYear),
      calendarStrategy: strategy,
      lunationNumber: prevConjunction.lunationNumber,
      monthStartJD: conjunctionJDAtMidnight + 1,
      monthStartUTC: prevConjunction.utcDate,
      basedOnConjunction: true,
      traceId: 'trace-' + Date.now()
    };

    return {
      data: result,
      computationTimeMs: performance.now() - startTime
    };
  }

  public hijriToGregorian(
    date: HijriDate,
    _strategy: HijriCalendarType = 'Astronomical'
  ): EngineResult<GregorianDate> {
    // Basic approximation to reverse
    const totalMonths = (date.year - 1) * 12 + (date.month - 1);
    
    // Average days per month is 29.530588
    const elapsedDays = totalMonths * 29.530588;
    const approximateJD = this.HIJRI_EPOCH_JD + elapsedDays;
    
    // Find the conjunction near this JD
    const conjunction = this.newMoonEngine.calculateNearestConjunction({ value: approximateJD }).data;
    
    const monthStartJD = Math.floor(conjunction.trueConjunctionJD - 0.5) + 0.5 + 1;
    const targetJD = monthStartJD + (date.day - 1);

    const gregorian = TimeEngine.julianDateToGregorian({ value: targetJD });

    return {
      data: {
        year: gregorian.year,
        month: gregorian.month,
        day: gregorian.day,
        hour: 12,
        minute: 0,
        second: 0
      },
      computationTimeMs: 0
    };
  }

  private isLeapYear(year: number): boolean {
    return (year * 11 + 14) % 30 < 11;
  }
}
