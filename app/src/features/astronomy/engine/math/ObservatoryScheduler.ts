import {
  GregorianDate,
  ObserverLocation,
  EngineResult,
  ObservationScheduleResult
} from '../../models';
import { SolarEventsEngine } from './SolarEventsEngine';
import { TimeEngine } from './TimeEngine';

export class ObservatoryScheduler {
  private solarEventsEngine = new SolarEventsEngine();

  /**
   * Generates an astronomical observation schedule for a given observer location and date.
   */
  public generateObservationSchedule(
    date: GregorianDate,
    location: ObserverLocation
  ): EngineResult<ObservationScheduleResult> {
    const startTime = performance.now();
    const jd = TimeEngine.calculateJulianDate(date);

    // Calculate Astronomical Twilight (-18 deg) and Civil Twilight (-6 deg)
    const astroDusk = this.solarEventsEngine.calculateEvent(jd, location, 'AstronomicalDusk').data;
    const astroDawn = this.solarEventsEngine.calculateEvent(jd, location, 'AstronomicalDawn').data;

    const civilDusk = this.solarEventsEngine.calculateEvent(jd, location, 'CivilDusk').data;
    const civilDawn = this.solarEventsEngine.calculateEvent(jd, location, 'CivilDawn').data;

    const schedule: ObservationScheduleResult = {
      date,
      astronomicalNightStart: astroDusk,
      astronomicalNightEnd: astroDawn,
      civilNightStart: civilDusk,
      civilNightEnd: civilDawn,
      bestObservationWindow: {
        start: astroDusk,
        end: astroDawn
      },
      moonlessWindow: {
        start: astroDusk,
        end: astroDawn
      },
      milkyWayVisibilityWindow: {
        start: astroDusk,
        end: astroDawn
      }
    };

    return {
      data: schedule,
      computationTimeMs: performance.now() - startTime
    };
  }
}
