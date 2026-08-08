export interface DeltaTProviderMetadata {
  id: string;
  name: string;
  source: string;
  rangeStartYear: number;
  rangeEndYear: number;
  version: string;
}

export interface IDeltaTProvider {
  getMetadata(): DeltaTProviderMetadata;
  calculateDeltaT(year: number, month: number): number; // Returns Delta T in seconds
}
