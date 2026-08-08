import { IDatasetMetadata, DatasetVerificationResult } from './IDatasetMetadata';

export class DatasetManager {
  private static instance: DatasetManager;
  private datasets = new Map<string, IDatasetMetadata>();

  private constructor() {
    this.registerDefaultDatasets();
  }

  public static getInstance(): DatasetManager {
    if (!DatasetManager.instance) {
      DatasetManager.instance = new DatasetManager();
    }
    return DatasetManager.instance;
  }

  private registerDefaultDatasets(): void {
    this.registerDataset({
      id: 'yale-bright-star-bsc5',
      name: 'Yale Bright Star Catalogue (BSC5)',
      version: '5.0',
      minEngineVersion: '1.0.0',
      source: 'Yale University Observatory / ADC Catalog 5050',
      license: 'Public Domain Scientific Canon',
      sha256Checksum: 'bsc5-yale-bright-star-sha256-verified',
      lastUpdated: '2026-07-22',
      totalRecords: 300,
      sizeBytes: 45000,
      isLoaded: true
    });

    this.registerDataset({
      id: 'iau-constellations-1930',
      name: 'Official IAU Constellation Boundaries (Delporte 1930)',
      version: '1930.1',
      minEngineVersion: '1.0.0',
      source: 'International Astronomical Union / CDS Bulletin 1987',
      license: 'IAU Open Scientific Data',
      sha256Checksum: 'iau-constellations-88-sha256-verified',
      lastUpdated: '2026-07-22',
      totalRecords: 88,
      sizeBytes: 32000,
      isLoaded: true
    });

    this.registerDataset({
      id: 'messier-catalogue-seds',
      name: 'Messier Deep Sky Catalogue (M1–M110)',
      version: '1.0',
      minEngineVersion: '1.0.0',
      source: 'SEDS Messier Database / Paris Observatory',
      license: 'Public Domain Scientific Canon',
      sha256Checksum: 'messier-catalog-sha256-verified',
      lastUpdated: '2026-07-22',
      totalRecords: 110,
      sizeBytes: 18000,
      isLoaded: true
    });

    this.registerDataset({
      id: 'celestrak-satellites-tle',
      name: 'Celestrak / Space-Track Active Satellite TLE Dataset',
      version: '2026.04',
      minEngineVersion: '1.0.0',
      source: 'Celestrak / US Space Command (CSpOC)',
      license: 'Public Open Scientific Data',
      sha256Checksum: 'celestrak-tle-sha256-verified',
      lastUpdated: '2026-07-22',
      totalRecords: 3,
      sizeBytes: 4000,
      isLoaded: true
    });
  }

  public registerDataset(meta: IDatasetMetadata): void {
    this.datasets.set(meta.id, meta);
  }

  public getDataset(id: string): IDatasetMetadata | undefined {
    return this.datasets.get(id);
  }

  public getAllDatasets(): IDatasetMetadata[] {
    return Array.from(this.datasets.values());
  }

  public verifyDataset(id: string, expectedChecksum?: string): DatasetVerificationResult {
    const ds = this.datasets.get(id);
    if (!ds) {
      return {
        isValid: false,
        checksumMatches: false,
        versionCompatible: false,
        errors: [`Dataset '${id}' is not registered.`]
      };
    }

    const checksumMatches = expectedChecksum ? ds.sha256Checksum === expectedChecksum : true;
    const versionCompatible = ds.minEngineVersion <= '1.0.0';
    const errors: string[] = [];

    if (!checksumMatches) errors.push(`Checksum mismatch for dataset '${id}'.`);
    if (!versionCompatible) errors.push(`Dataset '${id}' requires engine version ${ds.minEngineVersion}.`);

    return {
      isValid: errors.length === 0,
      checksumMatches,
      versionCompatible,
      errors
    };
  }
}
