export interface DatasetMetadata {
  id: string;
  version: string;
  source: string;
  translation?: string;
  compiledAt: string;
  checksum: string;
  language: string;
}

export class DatasetRegistry {
  private static datasets: Map<string, DatasetMetadata> = new Map();

  static register(metadata: DatasetMetadata) {
    this.datasets.set(metadata.id, metadata);
  }

  static getDataset(id: string): DatasetMetadata | undefined {
    return this.datasets.get(id);
  }

  static listDatasets(): DatasetMetadata[] {
    return Array.from(this.datasets.values());
  }

  static getVersion(id: string): string | undefined {
    return this.datasets.get(id)?.version;
  }
}
