import {
  IHighLatitudeEngine,
  JulianDate,
  ObserverLocation,
  CalculationMethod,
  PrayerTimes,
  EngineResult
} from '../../models';
import { EngineState } from '../core/EngineState';
import { SolarEventsEngine } from './SolarEventsEngine';

export class HighLatitudeEngine implements IHighLatitudeEngine {
  private solarEvents: SolarEventsEngine;

  constructor() {
    this.solarEvents = new SolarEventsEngine();
  }

  public applyHighLatitudeRules(
    prayerTimes: PrayerTimes,
    jd: JulianDate,
    location: ObserverLocation,
    method: CalculationMethod
  ): EngineResult<PrayerTimes> {
    const startTime = performance.now();
    const state = new EngineState();

    // If High Latitude Method is None or there's no issue, return as-is
    if (!method.highLatitudeMethod || method.highLatitudeMethod === 'None') {
      return { data: prayerTimes, computationTimeMs: performance.now() - startTime };
    }

    // We only apply high latitude rules if Fajr or Isha are null (did not occur) 
    // OR if they are unreasonably close to Sunrise/Sunset (the standard implementation often checks if the time exceeds a proportion).
    // For this engine, we use it as a fallback when astronomical events fail, 
    // or we can proactively apply it if the calculated time breaks the rule.
    // The prompt asks to apply the rules if "impossible" (status = NOT_AVAILABLE).
    
    let fajr = prayerTimes.fajr;
    let isha = prayerTimes.isha;

    if (fajr !== null && isha !== null) {
       // Both exist astronomically. But we should check if they violate the proportion rule in extreme latitudes.
       // For Phase 3A, the core instruction is: "If impossible status = NOT_AVAILABLE Then HighLatitudeEngine applies".
       // We will strictly use it as a fallback for missing values as requested by the architecture outline.
    }

    if (fajr === null || isha === null) {
      // Calculate Sunset of previous day for Fajr night duration
      const jdPrev = { value: jd.value - 1 };
      const sunsetPrevResult = this.solarEvents.calculateEvent(jdPrev, location, 'Sunset');
      const sunsetPrev = sunsetPrevResult.data;

      const sunriseResult = this.solarEvents.calculateEvent(jd, location, 'Sunrise');
      const sunrise = sunriseResult.data;

      const sunsetResult = this.solarEvents.calculateEvent(jd, location, 'Sunset');
      const sunset = sunsetResult.data;

      // Calculate Sunrise of next day for Isha night duration
      const jdNext = { value: jd.value + 1 };
      const sunriseNextResult = this.solarEvents.calculateEvent(jdNext, location, 'Sunrise');
      const sunriseNext = sunriseNextResult.data;

      // Calculate Fajr if missing
      if (fajr === null && sunsetPrev && sunrise) {
        const nightDurationFajr = sunrise.value - sunsetPrev.value;
        const proportion = this.getProportion(method.highLatitudeMethod, method.fajr.angle || 18);
        fajr = { value: sunrise.value - nightDurationFajr * proportion };
        state.addTrace('HIGH_LAT_FAJR', `Applied ${method.highLatitudeMethod} for Fajr`, { nightDurationFajr, proportion }, fajr, 'Fajr = Sunrise - Night * Proportion');
      }

      // Calculate Isha if missing
      if (isha === null && sunset && sunriseNext) {
        const nightDurationIsha = sunriseNext.value - sunset.value;
        const proportion = this.getProportion(method.highLatitudeMethod, method.isha.angle || 18);
        isha = { value: sunset.value + nightDurationIsha * proportion };
        state.addTrace('HIGH_LAT_ISHA', `Applied ${method.highLatitudeMethod} for Isha`, { nightDurationIsha, proportion }, isha, 'Isha = Sunset + Night * Proportion');
      }
    }

    const newTimes: PrayerTimes = {
      ...prayerTimes,
      fajr,
      isha
    };

    return {
      data: newTimes,
      computationTimeMs: performance.now() - startTime
    };
  }

  private getProportion(method: 'AngleBased' | 'Midnight' | 'OneSeventh', angle: number): number {
    switch (method) {
      case 'Midnight':
        return 1 / 2.0;
      case 'OneSeventh':
        return 1 / 7.0;
      case 'AngleBased':
        return angle / 60.0;
      default:
        return 1 / 2.0;
    }
  }
}
