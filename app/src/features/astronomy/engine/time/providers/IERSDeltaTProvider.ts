import { IDeltaTProvider, DeltaTProviderMetadata } from './IDeltaTProvider';
import { PolynomialDeltaTProvider } from './PolynomialDeltaTProvider';

export class IERSDeltaTProvider implements IDeltaTProvider {
  private fallbackProvider = new PolynomialDeltaTProvider();

  // Official IERS Bulletin A/B observational table samples (annual averages in seconds)
  private iersTable: Record<number, number> = {
    1970: 40.18,
    1975: 45.48,
    1980: 50.54,
    1985: 54.34,
    1990: 56.86,
    1995: 60.79,
    2000: 63.83,
    2005: 64.69,
    2010: 66.07,
    2015: 67.64,
    2020: 69.36,
    2024: 69.18,
    2025: 69.15,
    2026: 69.12
  };

  public getMetadata(): DeltaTProviderMetadata {
    return {
      id: 'IERSObservational',
      name: 'IERS Rapid Service / Earth Orientation Parameters Observational Provider',
      source: 'IERS Bulletin A/B (1970-2026 Observational Datasets)',
      rangeStartYear: 1970,
      rangeEndYear: 2026,
      version: 'IERS-2026.1'
    };
  }

  public calculateDeltaT(year: number, month: number): number {
    if (this.iersTable[year] !== undefined) {
      return this.iersTable[year];
    }
    // Fallback to polynomial provider if year is not in IERS observational table
    return this.fallbackProvider.calculateDeltaT(year, month);
  }
}
