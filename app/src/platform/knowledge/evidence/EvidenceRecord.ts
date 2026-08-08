import { AuthenticityMetadata } from '../models/UniversalNode';

export type EvidenceType =
  | 'QuranVerse'
  | 'Hadith'
  | 'ScholarOpinion'
  | 'Ijma'
  | 'Qiyas'
  | 'ScientificPaper'
  | 'Observation'
  | 'HistoricalSource'
  | 'Dataset'
  | 'InternalReference';

export interface EvidenceRecord {
  readonly canonicalEvidenceId: string; // e.g. "adq:evidence:quran:16:69", "adq:evidence:hadith:bukhari:1907"
  readonly sourceType: EvidenceType;
  readonly title: string;
  readonly arabicText?: string;
  readonly englishText?: string;
  readonly author?: string;             // Author / Compiler / Scholar
  readonly collection?: string;         // Collection / Source Book
  readonly authenticity?: AuthenticityMetadata;
  readonly publication?: string;
  readonly language: string;
  readonly url?: string;
  readonly confidenceScore: number;     // 0.0 to 1.0
  readonly lastVerified: string;
  readonly version: string;
}
