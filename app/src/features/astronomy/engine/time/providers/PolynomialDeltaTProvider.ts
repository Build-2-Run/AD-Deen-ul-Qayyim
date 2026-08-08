import { IDeltaTProvider, DeltaTProviderMetadata } from './IDeltaTProvider';

export class PolynomialDeltaTProvider implements IDeltaTProvider {
  public getMetadata(): DeltaTProviderMetadata {
    return {
      id: 'PolynomialEspenakMeeus',
      name: 'Espenak-Meeus Polynomial Delta T Provider',
      source: 'NASA TP-2006-214141 Five-Year Canonical Predictions',
      rangeStartYear: 1900,
      rangeEndYear: 2150,
      version: 'NASA-2006.1'
    };
  }

  public calculateDeltaT(year: number, month: number): number {
    const y = year + (month - 0.5) / 12;
    let deltaT = 0;

    if (year >= 1900 && year < 1920) {
      const t = y - 1900;
      deltaT = -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t * t * t - 0.000197 * t * t * t * t;
    } else if (year >= 1920 && year < 1941) {
      const t = y - 1920;
      deltaT = 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * t * t * t;
    } else if (year >= 1941 && year < 1961) {
      const t = y - 1950;
      deltaT = 29.07 + 0.407 * t - Math.pow(t, 2) / 233 + Math.pow(t, 3) / 2547;
    } else if (year >= 1961 && year < 1986) {
      const t = y - 1975;
      deltaT = 45.45 + 1.067 * t - Math.pow(t, 2) / 260 - Math.pow(t, 3) / 718;
    } else if (year >= 1986 && year < 2005) {
      const t = y - 2000;
      deltaT = 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t + 0.000651814 * t * t * t * t + 0.00002373599 * Math.pow(t, 5);
    } else if (year >= 2005 && year < 2050) {
      const t = y - 2000;
      deltaT = 62.92 + 0.32217 * t + 0.005589 * t * t;
    } else if (year >= 2050 && year < 2150) {
      deltaT = -20 + 32 * Math.pow(((y - 1820) / 100), 2) - 0.5628 * (2150 - y);
    } else {
      const t = (y - 2000) / 100;
      deltaT = 62.92 + 32.5 * t * t;
    }

    return deltaT;
  }
}
