import { INutationProvider, NutationProviderMetadata, NutationResult } from './INutationProvider';
import { JulianDate } from '../../models';
import { TimeEngine } from '../math/TimeEngine';
import { toRadians } from '../math/MathUtils';

export class MeeusNutationProvider implements INutationProvider {
  public getMetadata(): NutationProviderMetadata {
    return {
      id: 'MeeusApproximation',
      name: 'Meeus Chapter 22 Nutation Provider',
      standard: 'Jean Meeus Astronomical Algorithms (2nd Ed)',
      numberOfTerms: 4,
      accuracyArcsec: 0.5
    };
  }

  public calculateNutation(jd: JulianDate): NutationResult {
    const T = TimeEngine.calculateJulianCentury(jd);
    const omega = 125.04452 - 1934.136261 * T;
    const L0 = 280.4665 + 36000.7698 * T;
    const Lprime = 218.3165 + 481267.8813 * T;

    // Approximate nutation in longitude (deltaPsi) in degrees
    const deltaPsiArcsec = -17.20 * Math.sin(toRadians(omega)) - 1.32 * Math.sin(toRadians(2 * L0)) - 0.23 * Math.sin(toRadians(2 * Lprime)) + 0.21 * Math.sin(toRadians(2 * omega));
    const deltaPsi = deltaPsiArcsec / 3600;

    // Approximate nutation in obliquity (deltaEpsilon) in degrees
    const deltaEpsilonArcsec = 9.20 * Math.cos(toRadians(omega)) + 0.57 * Math.cos(toRadians(2 * L0)) + 0.10 * Math.cos(toRadians(2 * Lprime)) - 0.09 * Math.cos(toRadians(2 * omega));
    const deltaEpsilon = deltaEpsilonArcsec / 3600;

    return { deltaPsi, deltaEpsilon };
  }
}
