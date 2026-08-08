import { ISolarEphemerisEngine, JulianDate, ObserverLocation, AtmosphericConditions, EngineResult, SolarCoordinates, SolarEvent, CalculationMethod, EclipticCoordinates } from '../../models';
import { EngineState } from '../core/EngineState';
import { TimeEngine } from './TimeEngine';
import { normalizeDegrees, toRadians, toDegrees } from './MathUtils';
import { CoordinateEngine } from './CoordinateEngine';

export class SolarEphemerisEngine implements ISolarEphemerisEngine {
  
  public calculateSolarCoordinates(
    jd: JulianDate,
    _location?: ObserverLocation,
    _atmosphere?: AtmosphericConditions
  ): EngineResult<SolarCoordinates> {
    const startTime = performance.now();
    const state = new EngineState();
    
    // T = Julian Century since J2000.0
    const T = TimeEngine.calculateJulianCentury(jd, state);
    
    // 1. Mean Longitude (L0)
    // Meeus Eq 25.2
    let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    L0 = normalizeDegrees(L0);
    state.addTrace('SOLAR_MEAN_LONGITUDE', 'Calculate Solar Mean Longitude (L0)', { T }, L0, 'L0 = 280.46646 + 36000.76983*T + 0.0003032*T^2');

    // 2. Mean Anomaly (M)
    // Meeus Eq 25.3
    let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    M = normalizeDegrees(M);
    state.addTrace('SOLAR_MEAN_ANOMALY', 'Calculate Solar Mean Anomaly (M)', { T }, M, 'M = 357.52911 + 35999.05029*T - 0.0001537*T^2');

    // 3. Eccentricity of Earth's Orbit (e)
    // Meeus Eq 25.4
    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
    state.addTrace('EARTH_ECCENTRICITY', 'Calculate Earth Eccentricity (e)', { T }, e, 'e = 0.016708634 - 0.000042037*T - 0.0000001267*T^2');

    // 4. Equation of Center (C)
    // Meeus (approx)
    const mRad = toRadians(M);
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(mRad)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * mRad)
            + 0.000289 * Math.sin(3 * mRad);
    state.addTrace('EQUATION_OF_CENTER', 'Calculate Equation of Center (C)', { M: mRad, T }, C, 'C = (1.914602 - 0.004817*T - 0.000014*T^2)*sin(M) + ...');

    // 5. True Longitude (Odot)
    const trueLong = normalizeDegrees(L0 + C);
    state.addTrace('SOLAR_TRUE_LONGITUDE', 'Calculate True Longitude', { L0, C }, trueLong, 'trueLong = L0 + C');

    // 6. True Anomaly (v)
    const v = M + C;

    // 7. Radius Vector (R) - distance in AU
    // Meeus Eq 25.5
    const R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(toRadians(v)));
    state.addTrace('SOLAR_RADIUS_VECTOR', 'Calculate Radius Vector (R)', { e, v }, R, 'R = 1.000001018*(1-e^2)/(1+e*cos(v))');

    // 8. Apparent Longitude (lambda) corrected for nutation and aberration
    const omega = 125.04 - 1934.136 * T;
    const lambda = trueLong - 0.00569 - 0.00474 * Math.sin(toRadians(omega));
    state.addTrace('SOLAR_APPARENT_LONGITUDE', 'Calculate Apparent Longitude (lambda)', { trueLong, omega }, lambda, 'lambda = trueLong - 0.00569 - 0.00474*sin(omega)');

    // 9. Mean Obliquity of Ecliptic (epsilon0)
    // Meeus Eq 22.2 (simplified)
    const epsilon0 = 23.43929111 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;
    
    // 10. True Obliquity (epsilon)
    const epsilon = epsilon0 + 0.00256 * Math.cos(toRadians(omega));
    state.addTrace('TRUE_OBLIQUITY', 'Calculate True Obliquity (epsilon)', { epsilon0, omega }, epsilon, 'epsilon = epsilon0 + 0.00256*cos(omega)');

    // 11. Equatorial Coordinates (RA, Dec)
    const eclipticCoords: EclipticCoordinates = { eclipticLongitude: lambda, eclipticLatitude: 0, distance: R };
    const equatorial = CoordinateEngine.eclipticToEquatorial(eclipticCoords, epsilon, state);

    // 12. Angular Diameter (if needed)
    // Approximate: d = 9.36 / R (arcminutes) => converted to degrees
    const angularDiameter = (9.36 / R) / 60;
    
    const result: SolarCoordinates = {
      equatorial,
      ecliptic: eclipticCoords,
      distanceAU: R,
      angularDiameter
    };

    return {
      data: result,
      computationTimeMs: performance.now() - startTime
    };
  }

  public calculateEquationOfTime(jd: JulianDate, state?: EngineState): number {
    const T = TimeEngine.calculateJulianCentury(jd, state);
    
    let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    L0 = normalizeDegrees(L0);

    let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    M = normalizeDegrees(M);

    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

    const epsilon0 = 23.43929111 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;
    const omega = 125.04 - 1934.136 * T;
    const epsilon = epsilon0 + 0.00256 * Math.cos(toRadians(omega));
    
    const y = Math.pow(Math.tan(toRadians(epsilon) / 2), 2);
    const mRad = toRadians(M);
    const l0Rad = toRadians(L0);

    // Meeus Eq 28.3 for EoT (in minutes)
    const eotRad = y * Math.sin(2 * l0Rad) 
                 - 2 * e * Math.sin(mRad) 
                 + 4 * e * y * Math.sin(mRad) * Math.cos(2 * l0Rad) 
                 - 0.5 * y * y * Math.sin(4 * l0Rad) 
                 - 1.25 * e * e * Math.sin(2 * mRad);
    
    // Convert radians to minutes of time (1 radian = 180/pi degrees = (180/pi)*4 minutes)
    const eotMin = toDegrees(eotRad) * 4;

    if (state) {
      state.addTrace('EQUATION_OF_TIME', 'Calculate Equation of Time (EoT)', { y, M, L0, e }, eotMin, 'Meeus Eq 28.3');
    }

    return eotMin;
  }

  public calculateSolarEvent(
    _event: SolarEvent,
    _date: JulianDate,
    _location: ObserverLocation,
    _atmosphere?: AtmosphericConditions,
    _method?: CalculationMethod
  ): EngineResult<JulianDate | null> {
    // Phase 2A focuses on Ephemeris geometry. Transit logic is Phase 3.
    throw new Error('Solar events (Transit, Sunrise/Sunset) orchestration will be implemented in Phase 3.');
  }
}
