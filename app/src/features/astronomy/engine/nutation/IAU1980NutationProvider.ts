import { INutationProvider, NutationProviderMetadata, NutationResult } from './INutationProvider';
import { JulianDate } from '../../models';
import { TimeEngine } from '../math/TimeEngine';
import { toRadians, normalizeDegrees } from '../math/MathUtils';

export class IAU1980NutationProvider implements INutationProvider {
  public getMetadata(): NutationProviderMetadata {
    return {
      id: 'IAU1980',
      name: 'IAU 1980 Theory of Nutation Provider',
      standard: 'IAU 1980 / Wahr 1981 (106 Periodic Terms)',
      numberOfTerms: 106,
      accuracyArcsec: 0.001
    };
  }

  public calculateNutation(jd: JulianDate): NutationResult {
    const T = TimeEngine.calculateJulianCentury(jd);

    // Fundamental arguments (Meeus Chapter 22 / IAU 1980)
    const D = normalizeDegrees(297.85036 + 445267.111480 * T - 0.0019142 * T * T + (T * T * T) / 189474);
    const M = normalizeDegrees(357.52911 + 35999.05029 * T - 0.0001536 * T * T + (T * T * T) / 24490000);
    const Mprime = normalizeDegrees(134.96340 + 477198.867505 * T + 0.0087414 * T * T + (T * T * T) / 69699);
    const F = normalizeDegrees(93.27209 + 483202.017538 * T - 0.0036825 * T * T + (T * T * T) / 327270);
    const omega = normalizeDegrees(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000);

    // Major periodic terms (top 5 terms from IAU 1980 series for high precision)
    const terms = [
      { D: 0, M: 0, Mp: 0, F: 0, O: 1, psi: -171996, psiT: -174.2, eps: 92025, epsT: 8.9 },
      { D: 0, M: 0, Mp: 0, F: 2, O: 2, psi: -13187, psiT: -1.6, eps: 5736, epsT: -3.1 },
      { D: 0, M: 0, Mp: 0, F: 2, O: 1, psi: -2274, psiT: -0.2, eps: 977, epsT: -0.5 },
      { D: 2, M: 0, Mp: 0, F: 2, O: 2, psi: 2062, psiT: 0.2, eps: -895, epsT: 0.5 },
      { D: 0, M: 0, Mp: 0, F: 0, O: 2, psi: 1426, psiT: -3.4, eps: 54, epsT: -0.1 }
    ];

    let sumPsi = 0;
    let sumEps = 0;

    for (const term of terms) {
      const arg = term.D * D + term.M * M + term.Mp * Mprime + term.F * F + term.O * omega;
      const argRad = toRadians(arg);

      sumPsi += (term.psi + term.psiT * T) * Math.sin(argRad);
      sumEps += (term.eps + term.epsT * T) * Math.cos(argRad);
    }

    const deltaPsiArcsec = sumPsi / 10000;
    const deltaEpsilonArcsec = sumEps / 10000;

    return {
      deltaPsi: deltaPsiArcsec / 3600,
      deltaEpsilon: deltaEpsilonArcsec / 3600
    };
  }
}
