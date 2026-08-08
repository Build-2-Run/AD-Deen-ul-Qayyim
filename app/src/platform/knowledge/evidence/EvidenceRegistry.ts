import { EvidenceRecord } from './EvidenceRecord';

export class EvidenceRegistry {
  private static instance: EvidenceRegistry;
  private evidenceRecords = new Map<string, EvidenceRecord>();

  public static getInstance(): EvidenceRegistry {
    if (!EvidenceRegistry.instance) {
      EvidenceRegistry.instance = new EvidenceRegistry();
    }
    return EvidenceRegistry.instance;
  }

  public registerEvidence(record: EvidenceRecord): void {
    if (!record.canonicalEvidenceId || !record.canonicalEvidenceId.startsWith('adq:evidence:')) {
      throw new Error(
        `Invalid Evidence ID Error: ID '${record.canonicalEvidenceId}' must start with 'adq:evidence:'.`
      );
    }

    if (this.evidenceRecords.has(record.canonicalEvidenceId)) {
      throw new Error(
        `Duplicate Evidence Error: Record with ID '${record.canonicalEvidenceId}' is already registered.`
      );
    }

    if (record.confidenceScore < 0.0 || record.confidenceScore > 1.0) {
      throw new Error(
        `Invalid Confidence Score Error: Score ${record.confidenceScore} on evidence '${record.canonicalEvidenceId}' must be between 0.0 and 1.0.`
      );
    }

    this.evidenceRecords.set(record.canonicalEvidenceId, Object.freeze({ ...record }));
  }

  public getEvidence(canonicalEvidenceId: string): EvidenceRecord | undefined {
    return this.evidenceRecords.get(canonicalEvidenceId);
  }

  public hasEvidence(canonicalEvidenceId: string): boolean {
    return this.evidenceRecords.has(canonicalEvidenceId);
  }

  public getAllEvidence(): ReadonlyArray<EvidenceRecord> {
    return Array.from(this.evidenceRecords.values());
  }

  public clear(): void {
    this.evidenceRecords.clear();
  }

  public size(): number {
    return this.evidenceRecords.size;
  }
}
