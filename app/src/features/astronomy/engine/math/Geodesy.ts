import { Coordinates } from '../../models';
import { EngineState } from '../core/EngineState';
import { getDefaultEarthModel } from './EarthModel';
import { toRadians, toDegrees } from './MathUtils';

export interface GeodesyResult {
  distance: number;       // meters
  initialBearing: number; // degrees
  finalBearing: number;   // degrees
  methodUsed: 'Vincenty' | 'Karney' | 'Spherical';
}

export class GeodesyEngine {
  /**
   * Calculates the shortest distance and bearings between two points on the Earth
   * using Vincenty's inverse algorithm on the WGS84 ellipsoid.
   * Falls back to Spherical calculation if Vincenty fails to converge.
   */
  public static inverse(
    p1: Coordinates,
    p2: Coordinates,
    state?: EngineState
  ): GeodesyResult {
    const earth = getDefaultEarthModel();
    const a = earth.semiMajorAxis;
    const b = earth.semiMinorAxis;
    const f = earth.flattening;

    const L = toRadians(p2.longitude - p1.longitude);
    const U1 = Math.atan((1 - f) * Math.tan(toRadians(p1.latitude)));
    const U2 = Math.atan((1 - f) * Math.tan(toRadians(p2.latitude)));

    const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
    const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

    let lambda = L;
    let lambdaP = 2 * Math.PI;
    let iterLimit = 100;
    
    let sinLambda = 0, cosLambda = 0;
    let sinSigma = 0, cosSigma = 0, sigma = 0;
    let sinAlpha = 0, cosSqAlpha = 0;
    let cos2SigmaM = 0;
    
    let converged = false;

    // Record iterations for traceability
    const traceIterations: Array<{ iter: number, lambda: number, diff: number }> = [];

    while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0) {
      sinLambda = Math.sin(lambda);
      cosLambda = Math.cos(lambda);

      sinSigma = Math.sqrt(
        (cosU2 * sinLambda) * (cosU2 * sinLambda) +
        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
      );

      if (sinSigma === 0) {
        // Co-incident points
        return { distance: 0, initialBearing: 0, finalBearing: 0, methodUsed: 'Vincenty' };
      }

      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);

      sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
      cosSqAlpha = 1 - sinAlpha * sinAlpha;
      
      cos2SigmaM = cosSqAlpha === 0 ? 0 : cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;

      const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      lambdaP = lambda;
      lambda = L + (1 - C) * f * sinAlpha * (
        sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))
      );

      if (state) {
        traceIterations.push({ iter: 100 - iterLimit, lambda, diff: Math.abs(lambda - lambdaP) });
      }
    }

    if (iterLimit === 0) {
      converged = false;
      if (state) {
        state.addTrace('VINCENTY_FAILED', 'Vincenty failed to converge, falling back to Spherical', { iterations: 100 }, null, 'Spherical Fallback');
      }
      return this.sphericalInverse(p1, p2, state);
    }

    converged = true;
    if (state) {
      state.addTrace('VINCENTY_CONVERGENCE', 'Vincenty iteration convergence details', { 
        converged, 
        iterations: 100 - iterLimit,
        finalDiff: Math.abs(lambda - lambdaP),
        trace: traceIterations
      }, lambda, 'Iterative lambda refinement');
    }

    const uSq = cosSqAlpha * ((a * a - b * b) / (b * b));
    const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const deltaSigma = B * sinSigma * (
      cos2SigmaM + (B / 4) * (
        cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - 
        (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)
      )
    );

    const distance = b * A * (sigma - deltaSigma);
    let initialBearing = Math.atan2(cosU2 * sinLambda, cosU1 * sinU2 - sinU1 * cosU2 * cosLambda);
    let finalBearing = Math.atan2(cosU1 * sinLambda, -sinU1 * cosU2 + cosU1 * sinU2 * cosLambda);

    // Normalize to 0-360
    initialBearing = (toDegrees(initialBearing) + 360) % 360;
    finalBearing = (toDegrees(finalBearing) + 360) % 360;

    return {
      distance,
      initialBearing,
      finalBearing,
      methodUsed: 'Vincenty'
    };
  }

  /**
   * Spherical Inverse calculation using the Haversine formula and Spherical Trigonometry.
   * Used primarily as a fallback when Vincenty fails on nearly antipodal points.
   */
  public static sphericalInverse(
    p1: Coordinates,
    p2: Coordinates,
    state?: EngineState
  ): GeodesyResult {
    const R = getDefaultEarthModel().meanEarthRadius;
    const lat1 = toRadians(p1.latitude);
    const lat2 = toRadians(p2.latitude);
    const dLat = toRadians(p2.latitude - p1.latitude);
    const dLon = toRadians(p2.longitude - p1.longitude);

    // Haversine Distance
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Initial Bearing
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let initialBearing = Math.atan2(y, x);
    initialBearing = (toDegrees(initialBearing) + 360) % 360;

    // Final Bearing
    const y2 = Math.sin(-dLon) * Math.cos(lat1);
    const x2 = Math.cos(lat2) * Math.sin(lat1) -
               Math.sin(lat2) * Math.cos(lat1) * Math.cos(-dLon);
    let finalBearing = Math.atan2(y2, x2);
    finalBearing = (toDegrees(finalBearing) + 180) % 360;

    if (state) {
      state.addTrace('SPHERICAL_GEODESY', 'Calculated Great Circle distance and bearing', { distance, initialBearing }, null, 'Haversine and Spherical Cosine Rules');
    }

    return {
      distance,
      initialBearing,
      finalBearing,
      methodUsed: 'Spherical'
    };
  }
}
