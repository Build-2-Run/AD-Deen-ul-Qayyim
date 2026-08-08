import { GregorianDate, JulianDate } from '../../models';
import { astronomicalConstants } from '../../mock/scientific-data';
import { EngineState } from '../core/EngineState';

export class TimeEngine {
  /**
   * Converts a Gregorian Date to a Julian Date (JD).
   * Ref: Meeus, Astronomical Algorithms (2nd Ed), Chapter 7.
   */
  public static calculateJulianDate(date: GregorianDate, state?: EngineState): JulianDate {
    let { year, month, day } = date;
    const hour = date.hour ?? 0;
    const minute = date.minute ?? 0;
    const second = date.second ?? 0;

    if (month <= 2) {
      year -= 1;
      month += 12;
    }

    const isGregorian = year > 1582 || (year === 1582 && (month > 10 || (month === 10 && day >= 15)));
    
    let B = 0;
    if (isGregorian) {
      const A = Math.floor(year / 100);
      B = 2 - A + Math.floor(A / 4);
    }

    const fractionalDay = day + hour / astronomicalConstants.hoursInDay + minute / (astronomicalConstants.hoursInDay * astronomicalConstants.minutesInHour) + second / (astronomicalConstants.hoursInDay * astronomicalConstants.minutesInHour * astronomicalConstants.secondsInMinute);

    const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + fractionalDay + B - 1524.5;

    if (state) {
      state.addTrace(
        'JULIAN_DATE',
        'Convert Gregorian to Julian Date',
        { year: date.year, month: date.month, day: date.day, hour, minute, second },
        jd,
        'JD = INT(365.25*(Y+4716)) + INT(30.6001*(M+1)) + D + B - 1524.5'
      );
    }

    return { value: jd };
  }

  /**
   * Converts a Julian Date to a Gregorian Date.
   * Ref: Meeus, Astronomical Algorithms (2nd Ed), Chapter 7.
   */
  public static julianDateToGregorian(jd: JulianDate, state?: EngineState): GregorianDate {
    const value = jd.value + 0.5;
    const Z = Math.floor(value);
    const F = value - Z;

    let A = Z;
    if (Z >= 2299161) {
      const alpha = Math.floor((Z - 1867216.25) / 36524.25);
      A = Z + 1 + alpha - Math.floor(alpha / 4);
    }

    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);

    const fractionalDay = B - D - Math.floor(30.6001 * E) + F;
    const day = Math.floor(fractionalDay);

    const month = E < 14 ? E - 1 : E - 13;
    const year = month > 2 ? C - 4716 : C - 4715;

    // Convert fractional day to time
    const dayFraction = fractionalDay - day;
    const totalSeconds = Math.round(dayFraction * 24 * 3600);
    const hour = Math.floor(totalSeconds / 3600);
    const minute = Math.floor((totalSeconds % 3600) / 60);
    const second = totalSeconds % 60;

    const gregorian = { year, month, day, hour, minute, second };

    if (state) {
      state.addTrace(
        'GREGORIAN_DATE',
        'Convert Julian Date to Gregorian Date',
        { jd: jd.value },
        gregorian,
        'Meeus Chapter 7 Reverse Algorithm'
      );
    }

    return gregorian;
  }

  /**
   * Calculates Julian Century (T) since J2000.0.
   */
  public static calculateJulianCentury(jd: JulianDate, state?: EngineState): number {
    const t = (jd.value - astronomicalConstants.j2000JulianDate) / astronomicalConstants.daysInJulianCentury;
    
    if (state) {
      state.addTrace(
        'JULIAN_CENTURY',
        'Calculate Julian Century (T) since J2000.0',
        { jd: jd.value },
        t,
        'T = (JD - 2451545.0) / 36525'
      );
    }
    
    return t;
  }

  /**
   * Delta T estimation using Espenak-Meeus polynomials.
   * Approximates the difference between TT (Terrestrial Time) and UT (Universal Time).
   * Range supported: Modern times (1900 - 2150).
   * Values from Eclipse Predictions by Fred Espenak and Jean Meeus (NASA TP-2006-214141).
   */
  public static calculateDeltaT(year: number, month: number, state?: EngineState): number {
    const y = year + (month - 0.5) / 12;
    let deltaT = 0;

    if (year >= 1900 && year < 1920) {
      const t = y - 1900;
      deltaT = -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t * t * t - 0.000197 * t * t * t * t;
    } else if (year >= 1920 && year < 1941) {
      const t = y - 1920;
      deltaT = 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * t * t * t;
    } else if (year >= 1941 && year < 1961) {
      const t = y - 1950;
      deltaT = 29.07 + 0.407 * t - Math.pow(t, 2) / 233 + Math.pow(t, 3) / 2547;
    } else if (year >= 1961 && year < 1986) {
      const t = y - 1975;
      deltaT = 45.45 + 1.067 * t - Math.pow(t, 2) / 260 - Math.pow(t, 3) / 718;
    } else if (year >= 1986 && year < 2005) {
      const t = y - 2000;
      deltaT = 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t + 0.000651814 * t * t * t * t + 0.00002373599 * Math.pow(t, 5);
    } else if (year >= 2005 && year < 2050) {
      const t = y - 2000;
      deltaT = 62.92 + 0.32217 * t + 0.005589 * t * t;
    } else if (year >= 2050 && year < 2150) {
      deltaT = -20 + 32 * Math.pow(((y - 1820) / 100), 2) - 0.5628 * (2150 - y);
    } else {
      // Very rough approximation for anything else (should not really hit this in modern apps)
      const t = (y - 2000) / 100;
      deltaT = 62.92 + 32.5 * t * t;
    }

    if (state) {
      state.addTrace(
        'DELTA_T',
        'Delta T (TT - UT) estimation using Espenak-Meeus polynomials',
        { year, month, decimalYear: y },
        deltaT,
        'Polynomial approximation (Espenak-Meeus)'
      );
    }

    return deltaT; // in seconds
  }

  /**
   * Converts UTC Julian Date to Terrestrial Time (TT) Julian Date.
   */
  public static utcToTT(jdUTC: JulianDate, year: number, month: number, state?: EngineState): JulianDate {
    const deltaTSeconds = this.calculateDeltaT(year, month, state);
    const deltaTDays = deltaTSeconds / (astronomicalConstants.hoursInDay * astronomicalConstants.minutesInHour * astronomicalConstants.secondsInMinute);
    const jdTT = jdUTC.value + deltaTDays;

    if (state) {
      state.addTrace(
        'TT_CONVERSION',
        'Convert UTC Julian Date to TT Julian Date',
        { jdUTC: jdUTC.value, deltaTSeconds, deltaTDays },
        jdTT,
        'JD(TT) = JD(UTC) + DeltaT/86400'
      );
    }

    return { value: jdTT };
  }
}
