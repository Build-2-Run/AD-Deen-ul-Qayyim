import {
  ISolarEventsEngine,
  JulianDate,
  ObserverLocation,
  AtmosphericConditions,
  EngineResult,
  SolarEvent
} from '../../models';
import { EngineState } from '../core/EngineState';
import { SolarEphemerisEngine } from './SolarEphemerisEngine';
import { CoordinateEngine } from './CoordinateEngine';
import { normalizeDegrees, toDegrees, toRadians } from './MathUtils';

export class SolarEventsEngine implements ISolarEventsEngine {
  private solarEphemeris: SolarEphemerisEngine;

  constructor() {
    this.solarEphemeris = new SolarEphemerisEngine();
  }

  /**
   * Retrieves the target standard altitude for a specific solar event.
   */
  public getTargetAltitude(event: SolarEvent): number | null {
    switch (event) {
      case 'Sunrise':
      case 'Sunset':
        return -0.8333; // Meeus standard for Sun
      case 'CivilDawn':
      case 'CivilDusk':
        return -6.0;
      case 'NauticalDawn':
      case 'NauticalDusk':
        return -12.0;
      case 'AstronomicalDawn':
      case 'AstronomicalDusk':
        return -18.0;
      case 'BlueHourMorning':
      case 'BlueHourEvening':
        return -4.0;
      case 'GoldenHourMorning':
      case 'GoldenHourEvening':
        return 6.0;
      case 'SolarNoon':
      case 'SolarMidnight':
        return null; // Defined by transit, not altitude
      default:
        return null;
    }
  }

  /**
   * Identifies whether the event happens before transit (rising) or after (setting).
   */
  private isMorningEvent(event: SolarEvent): boolean {
    const morningEvents: SolarEvent[] = [
      'AstronomicalDawn', 'NauticalDawn', 'CivilDawn', 
      'BlueHourMorning', 'GoldenHourMorning', 'Sunrise'
    ];
    return morningEvents.includes(event);
  }

  /**
   * Calculates the exact Julian Date when the sun reaches a specific geometric altitude.
   */
  public calculateAltitudeEvent(
    jd: JulianDate, // Expects roughly midnight (or noon) of the target day
    location: ObserverLocation,
    targetAltitude: number,
    isMorning: boolean
  ): EngineResult<JulianDate | null> {
    const startTime = performance.now();

    const longitude = location.coordinates.longitude;
    const latitude = location.coordinates.latitude;

    const jd0 = Math.floor(jd.value - 0.5) + 0.5;
    const gmst0 = CoordinateEngine.calculateGreenwichSiderealTime({ value: jd0 });

    const eq0 = this.solarEphemeris.calculateSolarCoordinates({ value: jd0 }).data.equatorial;
    let m0 = (eq0.rightAscension - longitude - gmst0) / 360;
    while (m0 < 0) m0 += 1;
    while (m0 > 1) m0 -= 1;

    let transitJd = jd0 + m0;
    for (let i = 0; i < 3; i++) {
      const eqM = this.solarEphemeris.calculateSolarCoordinates({ value: transitJd }).data.equatorial;
      const thetaM = CoordinateEngine.calculateGreenwichSiderealTime({ value: transitJd });
      const hourAngle = normalizeDegrees(thetaM + longitude - eqM.rightAscension);
      
      let haCorr = hourAngle;
      if (haCorr > 180) haCorr -= 360;
      
      transitJd -= (haCorr / 360) * 0.997269566;
    }

    const transitEq = this.solarEphemeris.calculateSolarCoordinates({ value: transitJd }).data.equatorial;
    const dec = transitEq.declination;

    const cosH0 = (Math.sin(toRadians(targetAltitude)) - Math.sin(toRadians(latitude)) * Math.sin(toRadians(dec))) /
                  (Math.cos(toRadians(latitude)) * Math.cos(toRadians(dec)));

    if (cosH0 < -1 || cosH0 > 1) {
      return { data: null, computationTimeMs: performance.now() - startTime };
    }

    const H0 = toDegrees(Math.acos(cosH0));

    // Do NOT wrap `m` into [0,1). A morning event can fall slightly before this
    // day's 0h UT (locations east of Greenwich) and an evening event slightly
    // after the next 0h UT (locations west). Wrapping pushed such events onto the
    // wrong calendar day — e.g. Fajr for a Srinagar date landed on the following
    // morning. Keeping `m` as the natural offset from this day's transit anchors
    // the event to the correct day.
    const m = isMorning ? m0 - H0 / 360 : m0 + H0 / 360;

    let eventJd = jd0 + m;

    for (let i = 0; i < 4; i++) {
      const eq = this.solarEphemeris.calculateSolarCoordinates({ value: eventJd }).data.equatorial;
      const decRad = toRadians(eq.declination);
      const latRad = toRadians(latitude);
      const h0Rad = toRadians(targetAltitude);

      const cosH = (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
      if (cosH < -1 || cosH > 1) {
        return { data: null, computationTimeMs: performance.now() - startTime };
      }
      const expectedH = toDegrees(Math.acos(cosH));

      const thetaM = CoordinateEngine.calculateGreenwichSiderealTime({ value: eventJd });
      let currentH = normalizeDegrees(thetaM + longitude - eq.rightAscension);
      if (currentH > 180) currentH -= 360;

      const targetH = isMorning ? -expectedH : expectedH;
      const deltaH = targetH - currentH;

      eventJd += (deltaH / 360) * 0.997269566;
    }

    return {
      data: { value: eventJd },
      computationTimeMs: performance.now() - startTime
    };
  }

  /**
   * Calculates the exact Julian Date of a standard solar event.
   */
  public calculateEvent(
    jd: JulianDate, // Expects roughly midnight (or noon) of the target day
    location: ObserverLocation,
    event: SolarEvent,
    _atmosphere?: AtmosphericConditions
  ): EngineResult<JulianDate | null> {
    const startTime = performance.now();
    const state = new EngineState();

    const longitude = location.coordinates.longitude;
    const elevation = location.elevation || 0;

    // Adjust target altitude for observer elevation (dip of horizon)
    let h0 = this.getTargetAltitude(event);
    if (h0 !== null && (event === 'Sunrise' || event === 'Sunset')) {
      // Meeus dip correction: -0.0347 * sqrt(elevation in meters)
      h0 -= 0.0347 * Math.sqrt(elevation);
      state.addTrace('ALTITUDE_DIP_CORRECTION', 'Apply horizon dip correction for elevation', { elevation, base_h0: -0.8333 }, h0, 'h0 -= 0.0347 * sqrt(elevation)');
    }

    // Step 1: Compute Greenwich Sidereal Time at 0h UT
    // We expect the incoming jd to be the 0h UT of the day in question.
    // If not exactly 0h, we find the 0h UT JD.
    const jd0 = Math.floor(jd.value - 0.5) + 0.5;
    const gmst0 = CoordinateEngine.calculateGreenwichSiderealTime({ value: jd0 });

    // Step 2: Get Sun coordinates at jd0
    // Actually, for high precision Meeus Chapter 15 recommends interpolating between JD-1, JD, JD+1
    // But since our SolarEphemeris is highly accurate and fast, we can iteratively solve it.
    
    // First approximation: Transit
    const eq0 = this.solarEphemeris.calculateSolarCoordinates({ value: jd0 }).data.equatorial;
    
    // m0 = approximate transit time in fraction of day
    let m0 = (eq0.rightAscension - longitude - gmst0) / 360;
    while (m0 < 0) m0 += 1;
    while (m0 > 1) m0 -= 1;

    state.addTrace('APPROX_TRANSIT', 'Approximate transit time (m0)', { gmst0, RA: eq0.rightAscension, longitude }, m0, 'm0 = (alpha - L - theta0)/360');

    // Refine transit iteratively
    let transitJd = jd0 + m0;
    for (let i = 0; i < 3; i++) {
      const eqM = this.solarEphemeris.calculateSolarCoordinates({ value: transitJd }).data.equatorial;
      const thetaM = CoordinateEngine.calculateGreenwichSiderealTime({ value: transitJd });
      const hourAngle = normalizeDegrees(thetaM + longitude - eqM.rightAscension);
      
      // We want hourAngle to be 0 for transit. 
      // If hourAngle > 180, it's negative.
      let haCorr = hourAngle;
      if (haCorr > 180) haCorr -= 360;
      
      transitJd -= (haCorr / 360) * 0.997269566; // correction in days
    }

    state.addTrace('EXACT_TRANSIT', 'Refine exact solar transit', { initial_m0: m0 }, transitJd, 'Iterative hour angle reduction');

    if (event === 'SolarNoon') {
      return { data: { value: transitJd }, computationTimeMs: performance.now() - startTime };
    }

    if (event === 'SolarMidnight') {
      // Midnight is transit + 12h (or -12h)
      // Usually we want the midnight closing the day, or opening it.
      // Standard practice: Add 0.5 days to transit for solar midnight.
      const midnightJd = transitJd + 0.5;
      return { data: { value: midnightJd }, computationTimeMs: performance.now() - startTime };
    }

    if (h0 === null) {
      return { data: null, computationTimeMs: performance.now() - startTime };
    }

    // Step 3: Call calculateAltitudeEvent
    const isMorning = this.isMorningEvent(event);
    const result = this.calculateAltitudeEvent(jd, location, h0, isMorning);

    return {
      data: result.data,
      computationTimeMs: performance.now() - startTime
    };
  }
}
