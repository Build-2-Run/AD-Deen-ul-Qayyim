import {
  IAsrEngine,
  JulianDate,
  ObserverLocation,
  AtmosphericConditions,
  EngineResult
} from '../../models';
import { EngineState } from '../core/EngineState';
import { SolarEphemerisEngine } from './SolarEphemerisEngine';
import { CoordinateEngine } from './CoordinateEngine';
import { normalizeDegrees, toDegrees, toRadians } from './MathUtils';

export class AsrEngine implements IAsrEngine {
  private solarEphemeris: SolarEphemerisEngine;

  constructor() {
    this.solarEphemeris = new SolarEphemerisEngine();
  }

  public calculateAsr(
    jd: JulianDate, // 0h UT of the day
    location: ObserverLocation,
    shadowFactor: 1 | 2,
    _atmosphere?: AtmosphericConditions
  ): EngineResult<JulianDate | null> {
    const startTime = performance.now();
    const state = new EngineState();

    const longitude = location.coordinates.longitude;
    const latitude = location.coordinates.latitude;

    const jd0 = Math.floor(jd.value - 0.5) + 0.5;
    const gmst0 = CoordinateEngine.calculateGreenwichSiderealTime({ value: jd0 });

    // Approximate transit
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

    // Declination at transit
    const transitEq = this.solarEphemeris.calculateSolarCoordinates({ value: transitJd }).data.equatorial;
    const decAtTransit = transitEq.declination;

    // Calculate approximate Asr altitude
    // cot(h) = n + tan(|lat - dec|)
    const latRad = toRadians(latitude);
    const decRad = toRadians(decAtTransit);
    
    // Altitude of sun at transit = 90 - |lat - dec|
    // This is mathematically identical to finding tan of zenith distance at transit
    const zenithDistanceRad = Math.abs(latRad - decRad);
    
    const tanZ = Math.tan(zenithDistanceRad);
    const cotH = shadowFactor + tanZ;
    let h0 = toDegrees(Math.atan(1 / cotH));

    state.addTrace('ASR_ALTITUDE_APPROX', `Calculate approx Asr altitude (shadow factor ${shadowFactor})`, { latitude, decAtTransit, shadowFactor }, h0, 'cot(h) = n + tan(|phi - dec|)');

    const cosH0 = (Math.sin(toRadians(h0)) - Math.sin(latRad) * Math.sin(decRad)) /
                  (Math.cos(latRad) * Math.cos(decRad));

    if (cosH0 < -1 || cosH0 > 1) {
      state.addTrace('ASR_DOES_NOT_OCCUR', 'cos(H0) out of bounds', { cosH0 }, null, 'Circumpolar conditions for Asr');
      return { data: null, computationTimeMs: performance.now() - startTime };
    }

    const H0 = toDegrees(Math.acos(cosH0));
    
    // Asr is an afternoon event, so we add the hour angle
    let m = m0 + H0 / 360;
    while (m > 1) m -= 1;
    let eventJd = jd0 + m;

    // Iterative refinement, recalulating declination and precise altitude target at the event time
    for (let i = 0; i < 4; i++) {
      const eq = this.solarEphemeris.calculateSolarCoordinates({ value: eventJd }).data.equatorial;
      const currentDecRad = toRadians(eq.declination);
      
      const currentTanZ = Math.tan(Math.abs(latRad - currentDecRad));
      const currentCotH = shadowFactor + currentTanZ;
      const exactH0Rad = Math.atan(1 / currentCotH);

      const cosH = (Math.sin(exactH0Rad) - Math.sin(latRad) * Math.sin(currentDecRad)) / (Math.cos(latRad) * Math.cos(currentDecRad));
      
      if (cosH < -1 || cosH > 1) {
        return { data: null, computationTimeMs: performance.now() - startTime };
      }
      
      const expectedH = toDegrees(Math.acos(cosH));
      const thetaM = CoordinateEngine.calculateGreenwichSiderealTime({ value: eventJd });
      
      let currentH = normalizeDegrees(thetaM + longitude - eq.rightAscension);
      if (currentH > 180) currentH -= 360;

      const deltaH = expectedH - currentH;
      eventJd += (deltaH / 360) * 0.997269566;
    }

    state.addTrace('EXACT_ASR_TIME', `Refined exact Asr (shadow factor ${shadowFactor})`, { initial_m: m }, eventJd, 'Iterative hour angle and declination refinement');

    return {
      data: { value: eventJd },
      computationTimeMs: performance.now() - startTime
    };
  }
}
