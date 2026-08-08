import { JulianDate } from '../../models';

export interface NutationResult {
  deltaPsi: number;   // Nutation in longitude (degrees)
  deltaEpsilon: number; // Nutation in obliquity (degrees)
}

export interface NutationProviderMetadata {
  id: string;
  name: string;
  standard: string;
  numberOfTerms: number;
  accuracyArcsec: number;
}

export interface INutationProvider {
  getMetadata(): NutationProviderMetadata;
  calculateNutation(jd: JulianDate): NutationResult;
}
