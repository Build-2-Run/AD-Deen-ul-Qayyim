import {
  IPrayerTimeEngine,
  JulianDate,
  GregorianDate,
  ObserverLocation,
  CalculationMethod,
  AtmosphericConditions,
  PrayerTimes,
  EngineResult
} from '../../models';
import { EngineState } from '../core/EngineState';
import { TimeEngine } from './TimeEngine';
import { SolarEventsEngine } from './SolarEventsEngine';
import { AsrEngine } from './AsrEngine';
import { HighLatitudeEngine } from './HighLatitudeEngine';

export class PrayerTimeEngine implements IPrayerTimeEngine {
  private solarEvents: SolarEventsEngine;
  private asrEngine: AsrEngine;
  private highLatitudeEngine: HighLatitudeEngine;

  constructor() {
    this.solarEvents = new SolarEventsEngine();
    this.asrEngine = new AsrEngine();
    this.highLatitudeEngine = new HighLatitudeEngine();
  }

  public calculatePrayerTimes(
    date: GregorianDate | JulianDate,
    location: ObserverLocation,
    method: CalculationMethod,
    atmosphere?: AtmosphericConditions
  ): EngineResult<PrayerTimes> {
    const startTime = performance.now();
    const state = new EngineState();

    let jd: JulianDate;
    if ('year' in date) {
      jd = TimeEngine.calculateJulianDate(date, state);
    } else {
      jd = date;
    }

    // 1. Dhuhr (Solar Transit)
    const transitResult = this.solarEvents.calculateEvent(jd, location, 'SolarNoon');
    const dhuhr = transitResult.data;

    // 2. Sunrise & Maghrib (Sunset)
    const sunriseResult = this.solarEvents.calculateEvent(jd, location, 'Sunrise', atmosphere);
    const sunrise = sunriseResult.data;

    const sunsetResult = this.solarEvents.calculateEvent(jd, location, 'Sunset', atmosphere);
    let maghrib = sunsetResult.data;

    // Check if Maghrib is overridden by MinutesAfterSunset
    if (method.maghrib && method.maghrib.type === 'MinutesAfterSunset' && maghrib !== null) {
       maghrib = { value: maghrib.value + (method.maghrib.minutes || 0) / 1440 };
    }

    // 3. Fajr
    let fajr: JulianDate | null = null;
    if (method.fajr.type === 'SunAngle' && method.fajr.angle) {
      const angle = -Math.abs(method.fajr.angle); // Ensure it's negative
      fajr = this.solarEvents.calculateAltitudeEvent(jd, location, angle, true).data;
    } else if (method.fajr.type === 'FixedTime' || method.fajr.type === 'MinutesAfterSunset') {
       // Typically Fajr is not MinutesAfterSunset, but handle if needed.
       // Usually it's SunAngle.
    }

    // 4. Isha
    let isha: JulianDate | null = null;
    if (method.isha.type === 'SunAngle' && method.isha.angle) {
      const angle = -Math.abs(method.isha.angle); // Ensure it's negative
      isha = this.solarEvents.calculateAltitudeEvent(jd, location, angle, false).data;
    } else if (method.isha.type === 'MinutesAfterSunset' && maghrib !== null) {
      isha = { value: maghrib.value + (method.isha.minutes || 0) / 1440 };
    }

    // 5. Asr (Both Standard and Hanafi)
    const asrStandard = this.asrEngine.calculateAsr(jd, location, 1, atmosphere).data;
    const asrHanafi = this.asrEngine.calculateAsr(jd, location, 2, atmosphere).data;

    // 6. Midnight
    let midnight: JulianDate | null = null;
    if (sunsetResult.data !== null) {
      let nextDayTarget: JulianDate | null = null;
      if (method.midnight === 'Jafari') {
        const jdNext = { value: jd.value + 1 };
        // Fajr next day
        if (method.fajr.type === 'SunAngle' && method.fajr.angle) {
          nextDayTarget = this.solarEvents.calculateAltitudeEvent(jdNext, location, -Math.abs(method.fajr.angle), true).data;
        }
      } else {
        const jdNext = { value: jd.value + 1 };
        nextDayTarget = this.solarEvents.calculateEvent(jdNext, location, 'Sunrise').data;
      }

      if (nextDayTarget !== null && sunsetResult.data !== null) {
        const diff = nextDayTarget.value - sunsetResult.data.value;
        midnight = { value: sunsetResult.data.value + diff / 2 };
      }
    }

    let prayerTimes: PrayerTimes = {
      fajr,
      sunrise,
      dhuhr,
      asrStandard,
      asrHanafi,
      maghrib,
      isha,
      midnight
    };

    // 7. Apply High Latitude Fallbacks
    prayerTimes = this.highLatitudeEngine.applyHighLatitudeRules(prayerTimes, jd, location, method).data;

    return {
      data: prayerTimes,
      computationTimeMs: performance.now() - startTime
    };
  }
}
