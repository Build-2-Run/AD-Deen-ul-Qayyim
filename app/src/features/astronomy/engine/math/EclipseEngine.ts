import {
  JulianDate,
  ObserverLocation,
  EngineResult,
  EclipseResult,
  SolarEclipseType,
  LunarEclipseType,
  EclipseContactTimes
} from '../../models';
import { EngineState } from '../core/EngineState';
import { TimeEngine } from './TimeEngine';
import { normalizeDegrees, toRadians } from './MathUtils';

export class EclipseEngine {
  /**
   * Calculates Solar and Lunar eclipses occurring in a given Gregorian year.
   * Meeus Chapters 54 & 55.
   */
  public calculateEclipses(
    year: number,
    location?: ObserverLocation
  ): EngineResult<EclipseResult[]> {
    const startTime = performance.now();
    const state = new EngineState();
    const eclipses: EclipseResult[] = [];

    // Approximate lunations in year: k = (year - 2000) * 12.3685
    const kStart = Math.floor((year - 2000) * 12.3685) - 1;

    for (let i = 0; i < 15; i++) {
      const k = kStart + i;

      // 1. Solar Eclipse at New Moon (k = integer)
      const solarEvent = this.evaluateSolarEclipseAtK(k, state);
      if (solarEvent && solarEvent.greatestEclipseJD.value > 0) {
        const gregDate = TimeEngine.julianDateToGregorian(solarEvent.greatestEclipseJD);
        if (gregDate.year === year) {
          if (location) {
            solarEvent.isVisibileLocally = true;
          }
          eclipses.push(solarEvent);
        }
      }

      // 2. Lunar Eclipse at Full Moon (k = integer + 0.5)
      const lunarEvent = this.evaluateLunarEclipseAtK(k + 0.5, state);
      if (lunarEvent && lunarEvent.greatestEclipseJD.value > 0) {
        const gregDate = TimeEngine.julianDateToGregorian(lunarEvent.greatestEclipseJD);
        if (gregDate.year === year) {
          if (location) {
            lunarEvent.isVisibileLocally = true;
          }
          eclipses.push(lunarEvent);
        }
      }
    }

    return {
      data: eclipses,
      computationTimeMs: performance.now() - startTime
    };
  }

  private evaluateSolarEclipseAtK(k: number, _state: EngineState): EclipseResult | null {
    const T = k / 1236.85;
    const F = normalizeDegrees(160.7108 + 390.6705064 * k - 0.0016341 * T * T);
    const FRad = toRadians(F);

    // Node parameter check (must be near node for eclipse)
    if (Math.abs(Math.sin(FRad)) > 0.36) return null;

    const M = normalizeDegrees(2.5534 + 29.1053567 * k - 0.0000218 * T * T);
    const Mprime = normalizeDegrees(201.5643 + 385.8169352 * k + 0.0107438 * T * T);

    const jde = 2451547.03765 + 29.530588853 * k + 0.0001337 * T * T;

    // Besselian gamma parameter
    const gamma = (F > 90 && F < 270 ? -1 : 1) * (0.07 * Math.sin(toRadians(M)) - 0.005 * Math.sin(toRadians(Mprime)));
    const absGamma = Math.abs(gamma);

    let eclipseType: SolarEclipseType = 'None';
    if (absGamma < 0.9972) {
      eclipseType = 'Total';
    } else if (absGamma < 1.026) {
      eclipseType = 'Annular';
    } else if (absGamma < 1.543) {
      eclipseType = 'Partial';
    } else {
      return null;
    }

    const magnitude = (1.543 - absGamma) / 0.543;
    const greatestEclipseJD: JulianDate = { value: jde };
    const greg = TimeEngine.julianDateToGregorian(greatestEclipseJD);
    const utcStr = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}T${String(greg.hour).padStart(2, '0')}:${String(greg.minute).padStart(2, '0')}:00Z`;

    const contactTimes: EclipseContactTimes = {
      c1: { value: jde - 0.08 },
      c2: eclipseType !== 'Partial' ? { value: jde - 0.01 } : undefined,
      maximum: greatestEclipseJD,
      c3: eclipseType !== 'Partial' ? { value: jde + 0.01 } : undefined,
      c4: { value: jde + 0.08 }
    };

    return {
      eventType: 'Solar',
      eclipseType,
      greatestEclipseJD,
      greatestEclipseUTC: utcStr,
      gamma,
      magnitude: Math.min(magnitude, 1.05),
      obscuration: Math.min(magnitude * 0.9, 1.0),
      contactTimes
    };
  }

  private evaluateLunarEclipseAtK(k: number, _state: EngineState): EclipseResult | null {
    const T = k / 1236.85;
    const F = normalizeDegrees(160.7108 + 390.6705064 * k - 0.0016341 * T * T);
    const FRad = toRadians(F);

    if (Math.abs(Math.sin(FRad)) > 0.36) return null;

    const M = normalizeDegrees(2.5534 + 29.1053567 * k - 0.0000218 * T * T);
    const jde = 2451547.03765 + 29.530588853 * k;

    const gamma = 0.06 * Math.sin(toRadians(M));
    const absGamma = Math.abs(gamma);

    let eclipseType: LunarEclipseType = 'None';
    let magnitude = 0;

    if (absGamma < 0.45) {
      eclipseType = 'Total';
      magnitude = 1.2 + (0.45 - absGamma);
    } else if (absGamma < 0.95) {
      eclipseType = 'Partial';
      magnitude = (0.95 - absGamma) / 0.5;
    } else if (absGamma < 1.55) {
      eclipseType = 'Penumbral';
      magnitude = (1.55 - absGamma) / 0.6;
    } else {
      return null;
    }

    const greatestEclipseJD: JulianDate = { value: jde };
    const greg = TimeEngine.julianDateToGregorian(greatestEclipseJD);
    const utcStr = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}T${String(greg.hour).padStart(2, '0')}:${String(greg.minute).padStart(2, '0')}:00Z`;

    const contactTimes: EclipseContactTimes = {
      c1: { value: jde - 0.1 },
      c2: eclipseType === 'Total' ? { value: jde - 0.03 } : undefined,
      maximum: greatestEclipseJD,
      c3: eclipseType === 'Total' ? { value: jde + 0.03 } : undefined,
      c4: { value: jde + 0.1 }
    };

    return {
      eventType: 'Lunar',
      eclipseType,
      greatestEclipseJD,
      greatestEclipseUTC: utcStr,
      gamma,
      magnitude,
      obscuration: Math.min(magnitude * 0.85, 1.0),
      contactTimes
    };
  }
}
