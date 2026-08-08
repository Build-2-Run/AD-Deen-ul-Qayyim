export interface ExternalDataSource {
  readonly id: string;               // e.g. "jpl-ssd", "iers", "mpc", "cds-vizier", "yale", "celestrak"
  readonly name: string;             // e.g. "JPL Solar System Dynamics"
  readonly baseUrl: string;          // e.g. "https://ssd.jpl.nasa.gov/api"
  readonly primaryMirrorUrl: string;
  readonly fallbackMirrorUrl?: string;
  readonly supportedFormats: string[]; // e.g. ["JSON", "SPK", "TLE", "ASCII"]
  readonly description: string;
}

export interface IDataSourceProvider {
  getSources(): ReadonlyArray<ExternalDataSource>;
  getSourceById(id: string): ExternalDataSource | undefined;
}
