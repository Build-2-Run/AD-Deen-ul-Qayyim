import {
  IHijriCalendarEngine,
  GregorianDate,
  HijriDate,
  HijriDateResult,
  HijriCalendarType,
  ObserverLocation,
  EngineResult
} from '../../models';
import { EngineState } from '../core/EngineState';
import { NewMoonEngine } from './NewMoonEngine';
import { TimeEngine } from './TimeEngine';
import { strategyRegistry } from '../../fiqh/StrategyRegistry';

// Umm al-Qura's rule is evaluated relative to Makkah's local sunset/moonset,
// regardless of where the user actually is (this mirrors UmmAlQuraStrategy,
// which hardcodes Makkah internally and ignores the location it's passed).
const MAKKAH: ObserverLocation = {
  name: 'Makkah Al-Mukarramah',
  coordinates: { latitude: 21.422487, longitude: 39.826206 },
  timezone: 'Asia/Riyadh'
};

const MONTH_NAMES = [
  '', 'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaaban',
  'Ramadan', 'Shawwal', 'Dhul-Qi’dah', 'Dhul-Hijjah'
];

export class HijriCalendarEngine implements IHijriCalendarEngine {
  private newMoonEngine = new NewMoonEngine();

  // Standard Hijri Epoch (1 Muharram 1 AH)
  // Usually considered July 16, 622 CE (Julian calendar), which is JD 1948439.5
  private readonly HIJRI_EPOCH_JD = 1948439.5;

  public gregorianToHijri(
    date: GregorianDate,
    strategy: HijriCalendarType = 'Astronomical',
    offsetDays: number = 0
  ): EngineResult<HijriDateResult> {
    const startTime = performance.now();
    const state = new EngineState();

    const jd = TimeEngine.calculateJulianDate(date);

    state.addTrace('HIJRI_CONVERSION_START', 'Starting Gregorian to Hijri conversion', {
      gregorian: date,
      jd: jd.value,
      strategy
    });

    // Every strategy starts from the same true astronomical conjunction —
    // strategies differ only in which civil day they declare as "day 1".
    // 1. Find the most recent conjunction before this date.
    const prevConjunction = this.newMoonEngine.calculatePreviousConjunction(jd).data;

    // Calculate elapsed lunations since Epoch (mean synodic month = 29.530588 days)
    // to determine the Hijri month/year. This is strategy-independent: it is
    // about which lunation cycle we're in, not which civil day starts it.
    const elapsedDays = prevConjunction.trueConjunctionJD - this.HIJRI_EPOCH_JD;
    const lunationsSinceEpoch = Math.round(elapsedDays / 29.530588);
    const totalMonths = lunationsSinceEpoch + 1; // 1-indexed month globally

    let hijriYear = Math.floor(totalMonths / 12) + 1;
    let hijriMonth = totalMonths % 12;
    if (hijriMonth === 0) hijriMonth = 12;

    // Day of the month is the number of days elapsed since the month's start JD.
    // For calendar purposes, we look at midnight.
    const currentJDAtMidnight = Math.floor(jd.value - 0.5) + 0.5;
    const conjunctionJDAtMidnight = Math.floor(prevConjunction.trueConjunctionJD - 0.5) + 0.5;

    // Astronomical default: the new month starts the civil day after conjunction.
    let monthStartJD = conjunctionJDAtMidnight + 1;

    if (strategy === 'UmmAlQura') {
      // Evaluate the Umm al-Qura rule (conjunction before Makkah sunset AND
      // moonset after Makkah sunset) on the evaluation day, i.e. the day the
      // conjunction actually occurs. Sampling at conjunctionJD + 0.5 keeps
      // the strategy's own `calculatePreviousConjunction` call resolving back
      // to this same conjunction rather than one lunation earlier.
      const decision = strategyRegistry
        .getStrategy('UmmAlQura')
        .evaluateMonthStart({ value: prevConjunction.trueConjunctionJD + 0.5 }, MAKKAH).data;
      monthStartJD = Math.floor(decision.startJD.value - 0.5) + 0.5;

      state.addTrace('HIJRI_UMM_AL_QURA_DECISION', 'Applied Umm al-Qura month-start rule', {
        monthStarts: decision.monthStarts,
        confidence: decision.confidence,
        startUTC: decision.startUTC
      });
    }

    let hijriDay = Math.floor(currentJDAtMidnight - monthStartJD) + 1;

    if (strategy === 'ManualSighting' && offsetDays) {
      // Shift the displayed day by the user's local-committee offset
      // (e.g. offsetDays = -3 to match an announcement 3 days earlier
      // than the pure astronomical calculation).
      hijriDay += offsetDays;
      state.addTrace('HIJRI_MANUAL_OFFSET_APPLIED', 'Applied manual sighting offset', { offsetDays });
    }

    // Roll day-of-month over into the neighbouring month when a strategy's
    // civil start (or a manual offset) pushes it out of [1, 30]. Islamic
    // months are 29 or 30 days; 30 is used here as a display approximation
    // rather than re-deriving the exact length of the adjacent month.
    while (hijriDay < 1) {
      hijriMonth -= 1;
      if (hijriMonth < 1) { hijriMonth = 12; hijriYear -= 1; }
      hijriDay += 30;
    }
    while (hijriDay > 30) {
      hijriDay -= 30;
      hijriMonth += 1;
      if (hijriMonth > 12) { hijriMonth = 1; hijriYear += 1; }
    }

    state.addTrace('HIJRI_MONTH_DETERMINED', 'Calculated elapsed lunations and Hijri Date', {
      lunationsSinceEpoch,
      hijriYear,
      hijriMonth,
      hijriDay
    });

    const result: HijriDateResult = {
      year: hijriYear,
      month: hijriMonth,
      day: hijriDay,
      monthName: MONTH_NAMES[hijriMonth],
      weekday: (Math.floor(jd.value + 1.5) % 7), // 0=Sunday
      isLeapYear: this.isLeapYear(hijriYear),
      calendarStrategy: strategy,
      lunationNumber: prevConjunction.lunationNumber,
      monthStartJD,
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
