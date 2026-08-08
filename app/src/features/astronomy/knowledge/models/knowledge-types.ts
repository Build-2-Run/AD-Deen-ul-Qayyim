export type CitationSource = 'Quran' | 'Hadith' | 'FiqhConsensus' | 'HistoricalManuscript';
export type AuthenticityGrade = 'Sahih' | 'Hasan' | 'Mutawatir' | 'Consensus' | 'HistoricalRecord';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface AuthenticCitation {
  readonly id: string;
  readonly source: CitationSource;
  readonly reference: string;       // e.g. "Surah Ya-Sin [36:38-40]" or "Sahih Al-Bukhari 1907"
  readonly arabicText: string;
  readonly translations: Record<string, string>; // { en: "...", ur: "...", id: "...", fr: "..." }
  readonly authenticity: AuthenticityGrade;
  readonly scholarlyCommentary?: Record<string, string>;
  readonly keywords: ReadonlyArray<string>;
}

export interface ScholarReference {
  readonly scholarName: string;
  readonly era: string;
  readonly bookTitle: string;
  readonly quote: Record<string, string>;
}

export interface HistoricalAstronomer {
  readonly id: string;
  readonly name: string;
  readonly arabicName: string;
  readonly eraYears: string;
  readonly location: string;
  readonly biography: Record<string, string>;
  readonly contributions: ReadonlyArray<Record<string, string>>;
  readonly discoveries: ReadonlyArray<Record<string, string>>;
  readonly majorWorks: ReadonlyArray<string>;
}

export interface GlossaryTerm {
  readonly id: string;
  readonly termArabic: string;
  readonly termEnglish: string;
  readonly termUrdu?: string;
  readonly termIndonesian?: string;
  readonly termFrench?: string;
  readonly category: 'Astronomy' | 'Fiqh' | 'Mathematics' | 'Geography';
  readonly scientificDefinition: Record<string, string>;
  readonly islamicContext?: Record<string, string>;
}

export interface LearningModule {
  readonly id: string;
  readonly title: Record<string, string>;
  readonly description: Record<string, string>;
  readonly category: string;
  readonly levels: {
    readonly Beginner: Record<string, string>;
    readonly Intermediate: Record<string, string>;
    readonly Advanced: Record<string, string>;
  };
  readonly relatedCitations: ReadonlyArray<string>; // Citation IDs
  readonly relatedAstronomers: ReadonlyArray<string>; // Astronomer IDs
}

export interface EducationalPhenomenon {
  readonly id: string;
  readonly title: Record<string, string>;
  readonly category: string;
  readonly scientificExplanation: Record<string, string>;
  readonly quranCitations: ReadonlyArray<AuthenticCitation>;
  readonly hadithCitations: ReadonlyArray<AuthenticCitation>;
  readonly fiqhReferences: ReadonlyArray<ScholarReference>;
  readonly historicalAstronomers: ReadonlyArray<HistoricalAstronomer>;
  readonly relatedTerms: ReadonlyArray<string>;
}

export interface KnowledgeTopic {
  readonly id: string;
  readonly title: Record<string, string>;
  readonly summary: Record<string, string>;
  readonly phenomenonId: string;
  readonly moduleIds: ReadonlyArray<string>;
}
