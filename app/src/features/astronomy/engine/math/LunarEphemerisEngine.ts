import {
  ILunarEphemerisEngine,
  ILunarPhaseEngine,
  JulianDate,
  ObserverLocation,
  AtmosphericConditions,
  EngineResult,
  LunarCoordinates,
  EclipticCoordinates
} from '../../models';
import { EngineState } from '../core/EngineState';
import { TimeEngine } from './TimeEngine';
import { normalizeDegrees, toRadians, toDegrees } from './MathUtils';
import { CoordinateEngine } from './CoordinateEngine';
import { LunarPeriodicTermsLR, LunarPeriodicTermsB } from './LunarPeriodicTerms';

export class LunarEphemerisEngine implements ILunarEphemerisEngine, ILunarPhaseEngine {
  
  public calculateLunarCoordinates(
    jd: JulianDate,
    location?: ObserverLocation,
    _atmosphere?: AtmosphericConditions
  ): EngineResult<LunarCoordinates> {
    const startTime = performance.now();
    const state = new EngineState();

    // 1. Julian Century
    const T = TimeEngine.calculateJulianCentury(jd, state);

    // 2. Fundamental Arguments (Meeus Chap 47)
    // L' (Mean Longitude of the Moon)
    let Lprime = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841 - Math.pow(T, 4) / 65194000;
    Lprime = normalizeDegrees(Lprime);
    state.addTrace('LUNAR_MEAN_LONGITUDE', 'Calculate Mean Longitude (L\')', { T }, Lprime, 'Meeus 47.1');

    // D (Mean Elongation of the Moon)
    let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T * T * T) / 545868 - Math.pow(T, 4) / 113065000;
    D = normalizeDegrees(D);
    state.addTrace('MEAN_ELONGATION', 'Calculate Mean Elongation (D)', { T }, D, 'Meeus 47.2');

    // M (Sun's Mean Anomaly)
    let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000;
    M = normalizeDegrees(M);
    state.addTrace('SUN_MEAN_ANOMALY', 'Calculate Sun\'s Mean Anomaly (M)', { T }, M, 'Meeus 47.3');

    // M' (Moon's Mean Anomaly)
    let Mprime = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T * T * T) / 69699 - Math.pow(T, 4) / 14712000;
    Mprime = normalizeDegrees(Mprime);
    state.addTrace('LUNAR_MEAN_ANOMALY', 'Calculate Moon\'s Mean Anomaly (M\')', { T }, Mprime, 'Meeus 47.4');

    // F (Moon's Argument of Latitude)
    let F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - (T * T * T) / 3526000 + Math.pow(T, 4) / 863310000;
    F = normalizeDegrees(F);
    state.addTrace('ARGUMENT_OF_LATITUDE', 'Calculate Moon\'s Argument of Latitude (F)', { T }, F, 'Meeus 47.5');

    // A1, A2, A3 (Action of Venus, Jupiter, Earth)
    const A1 = normalizeDegrees(119.75 + 131.849 * T);
    const A2 = normalizeDegrees(53.09 + 479264.290 * T);
    const A3 = normalizeDegrees(313.45 + 481266.484 * T);
    const E = 1 - 0.002516 * T - 0.0000074 * T * T;
    state.addTrace('EARTH_ORBIT_ECCENTRICITY_E', 'Calculate E multiplier', { T }, E, 'Meeus 47.6');

    // 3. Periodic Terms for Longitude (Σl) and Distance (Σr)
    let sumL = 0;
    let sumR = 0;

    for (const term of LunarPeriodicTermsLR) {
      // The argument for the sine/cosine functions:
      const arg = term.D * D + term.M * M + term.Mprime * Mprime + term.F * F;
      const argRad = toRadians(arg);

      // The E multiplier is used when M is non-zero (Meeus 47 p.340)
      let eMult = 1;
      if (Math.abs(term.M) === 1) eMult = E;
      if (Math.abs(term.M) === 2) eMult = E * E;

      sumL += term.l * eMult * Math.sin(argRad);
      sumR += term.r * eMult * Math.cos(argRad);
    }

    // Add Venus/Jupiter corrections to Longitude
    sumL += 3958 * Math.sin(toRadians(A1)) 
          + 1962 * Math.sin(toRadians(Lprime - F)) 
          + 318 * Math.sin(toRadians(A2));

    state.addTrace('PERIODIC_LONGITUDE_SUM', 'Calculate Σl (60 terms + corrections)', { terms: 60 }, sumL, 'Meeus Table 47.A');
    state.addTrace('PERIODIC_DISTANCE_SUM', 'Calculate Σr (60 terms)', { terms: 60 }, sumR, 'Meeus Table 47.A');

    // 4. Periodic Terms for Latitude (Σb)
    let sumB = 0;
    for (const term of LunarPeriodicTermsB) {
      const arg = term.D * D + term.M * M + term.Mprime * Mprime + term.F * F;
      const argRad = toRadians(arg);

      let eMult = 1;
      if (Math.abs(term.M) === 1) eMult = E;
      if (Math.abs(term.M) === 2) eMult = E * E;

      sumB += term.b * eMult * Math.sin(argRad);
    }
    // Latitude corrections
    sumB -= 2235 * Math.sin(toRadians(Lprime))
          + 382 * Math.sin(toRadians(A3))
          + 175 * Math.sin(toRadians(A1 - F))
          + 175 * Math.sin(toRadians(A1 + F))
          + 127 * Math.sin(toRadians(Lprime - Mprime))
          - 115 * Math.sin(toRadians(Lprime + Mprime));
          
    state.addTrace('PERIODIC_LATITUDE_SUM', 'Calculate Σb (60 terms + corrections)', { terms: 60 }, sumB, 'Meeus Table 47.B');

    // 5. Final Geocentric Coordinates
    const geocentricLongitude = normalizeDegrees(Lprime + sumL / 1000000);
    const geocentricLatitude = sumB / 1000000;
    const distanceKm = 385000.56 + sumR / 1000;

    state.addTrace('GEOCENTRIC_LONGITUDE', 'Calculate Geocentric Longitude', { Lprime, sumL }, geocentricLongitude, 'λ = L\' + Σl/1000000');
    state.addTrace('GEOCENTRIC_LATITUDE', 'Calculate Geocentric Latitude', { sumB }, geocentricLatitude, 'β = Σb/1000000');
    state.addTrace('EARTH_MOON_DISTANCE', 'Calculate Geocentric Distance', { sumR }, distanceKm, 'Δ = 385000.56 + Σr/1000');

    // 6. Apparent Coordinates (Nutation)
    // We omit the rigorous nutation calculation (Meeus Ch 22) for Phase 2B, utilizing a basic mean approximation.
    // The exact apparent coordinates will be added when Nutation engine is fully built.
    const omega = 125.04452 - 1934.136261 * T; // Longitude of ascending node
    const deltaPsi = -0.00478 * Math.sin(toRadians(omega)); // Approximation of nutation in longitude
    const apparentLongitude = normalizeDegrees(geocentricLongitude + deltaPsi);
    
    // 7. Obliquity
    const epsilon0 = 23.439291 - 0.0130042 * T;
    const epsilon = epsilon0 + 0.00256 * Math.cos(toRadians(omega));

    // 8. Equatorial Coordinates
    const eclipticCoords: EclipticCoordinates = {
      eclipticLongitude: apparentLongitude,
      eclipticLatitude: geocentricLatitude,
      distance: distanceKm
    };
    
    const equatorial = CoordinateEngine.eclipticToEquatorial(eclipticCoords, epsilon, state);

    // 9. Parallax and Angular Diameter
    const equatorialHorizontalParallax = toDegrees(Math.asin(6378.14 / distanceKm));
    const angularDiameter = 0.5181 * (384401 / distanceKm); // Approx

    state.addTrace('PARALLAX_AND_DIAMETER', 'Calculate Parallax & Diameter', { distanceKm }, { parallax: equatorialHorizontalParallax, diameter: angularDiameter }, 'Meeus Ch 47/40');

    // 10. Topocentric Correction
    let finalEquatorial = equatorial;
    if (location) {
      finalEquatorial = CoordinateEngine.geocentricToTopocentric(
        jd,
        equatorial,
        equatorialHorizontalParallax,
        location,
        state
      );
    }

    const data: LunarCoordinates = {
      equatorial: finalEquatorial,
      ecliptic: eclipticCoords,
      distanceKm,
      parallax: equatorialHorizontalParallax,
      angularDiameter
    };

    return {
      data,
      computationTimeMs: performance.now() - startTime
    };
  }

  /**
   * Calculates the Phase Angle, Illuminated Fraction, and approximate Age of the Moon.
   * Meeus Chapter 48.
   */
  public calculatePhase(jd: JulianDate): EngineResult<{ phaseAngle: number, illuminatedFraction: number, ageDays: number }> {
    const startTime = performance.now();
    const state = new EngineState();
    
    // We need both Sun and Moon coordinates.
    // We will do a simplified internal calculation for the Sun here to avoid circular dependency in architecture,
    // or we can just require the Sun coordinates to be passed in. The prompt asks to implement ILunarPhaseEngine.
    // Since Phase relies on Sun, we'll quickly recalculate basic Sun.
    
    const T = TimeEngine.calculateJulianCentury(jd, state);
    
    // Sun
    let L0 = 280.46646 + 36000.76983 * T;
    let M = 357.52911 + 35999.05029 * T;
    let C = 1.914602 * Math.sin(toRadians(M));
    let sunLong = normalizeDegrees(L0 + C);

    // Moon
    let Lprime = 218.3164477 + 481267.88123421 * T;
    let D = 297.8501921 + 445267.1114034 * T;
    let Mprime = 134.9633964 + 477198.8675055 * T;
    
    // Moon Long & Lat (simplified for phase)
    let moonLong = Lprime + 6.289 * Math.sin(toRadians(Mprime));
    let moonLat = 5.128 * Math.sin(toRadians(93.27 + 483202.0 * T));
    
    moonLong = normalizeDegrees(moonLong);
    sunLong = normalizeDegrees(sunLong);

    // Meeus Eq 48.2 (Elongation Psi)
    const slRad = toRadians(sunLong);
    const mlRad = toRadians(moonLong);
    const mbRad = toRadians(moonLat);
    
    const cosPsi = Math.cos(mbRad) * Math.cos(mlRad - slRad);
    let psi = toDegrees(Math.acos(cosPsi));
    let phaseAngle = 180 - psi; // Approximate Phase Angle i
    
    state.addTrace('PHASE_ANGLE', 'Calculate Phase Angle', { sunLong, moonLong, moonLat }, phaseAngle, 'Meeus Eq 48.2');

    // Illuminated fraction
    const k = (1 - cosPsi) / 2;
    state.addTrace('ILLUMINATED_FRACTION', 'Calculate Illuminated Fraction', { phaseAngle }, k, 'Meeus Eq 48.1');

    // Age (approximated by Elongation angle / 360 * 29.53)
    const elongation = normalizeDegrees(D);
    const ageDays = (elongation / 360) * 29.530588853;
    state.addTrace('LUNAR_AGE', 'Calculate Lunar Age (Synodic days)', { elongation }, ageDays, 'Age = (D/360) * 29.53');

    return {
      data: { phaseAngle, illuminatedFraction: k, ageDays },
      computationTimeMs: performance.now() - startTime
    };
  }
}
