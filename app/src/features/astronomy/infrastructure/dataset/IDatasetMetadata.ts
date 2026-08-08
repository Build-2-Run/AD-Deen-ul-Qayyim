export interface IDatasetMetadata {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly minEngineVersion: string;
  readonly source: string;
  readonly license: string;
  readonly sha256Checksum: string;
  readonly lastUpdated: string;
  readonly totalRecords: number;
  readonly sizeBytes: number;
  readonly isLoaded: boolean;
}

export interface DatasetVerificationResult {
  readonly isValid: boolean;
  readonly checksumMatches: boolean;
  readonly versionCompatible: boolean;
  readonly errors: string[];
}
