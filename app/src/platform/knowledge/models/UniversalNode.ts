export type KnowledgeDomainType =
  | 'Qur\'an'
  | 'Hadith'
  | 'Tafsir'
  | 'Fiqh'
  | 'Aqeedah'
  | 'Seerah'
  | 'History'
  | 'Astronomy'
  | 'Geography'
  | 'Biology'
  | 'Medicine'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Nature'
  | 'Animals'
  | 'Plants'
  | 'Language'
  | 'Arabic'
  | 'Ethics'
  | 'Worship'
  | 'Daily Life'
  | 'Family'
  | 'Economics'
  | 'Civilization'
  | 'Scholars'
  | 'Places'
  | 'People'
  | 'Objects'
  | 'Events';

export type EducationalLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Scholar';

export interface MultilingualNames {
  readonly english: string;
  readonly arabic: string;
  readonly transliteration?: string;
  readonly urdu?: string;
  readonly french?: string;
  readonly turkish?: string;
  readonly indonesian?: string;
}

export interface UniversalCitation {
  readonly code: string;            // e.g. "Qur'an 16:69", "Sahih al-Bukhari 547"
  readonly arabicText: string;
  readonly englishText: string;
  readonly source: string;
  readonly authenticityGrade?: 'MUTAWATIR' | 'SAHIH' | 'HASAN' | 'SCHOLARLY_CONSENSUS';
}

export interface AuthenticityMetadata {
  readonly grade: string;
  readonly sourceScholar?: string;
  readonly verificationStatus: 'VERIFIED' | 'REVIEWED' | 'CANONICAL';
}

export interface ProvenanceMetadata {
  readonly creator: string;
  readonly version: string;
  readonly lastUpdated: string;
  readonly license: string;
}

export interface FundamentalQuestions {
  readonly whatIsIt: string;
  readonly whyIsItImportant: string;
  readonly whereIsItMentioned: string;
  readonly howIsItConnected: string;
  readonly quranContext?: string;
  readonly hadithContext?: string;
  readonly tafsirContext?: string;
  readonly fiqhRulings?: string;
  readonly historicalContext?: string;
  readonly scientificExplanation?: string;
  readonly scholarlyDiscussions?: string;
  readonly relatedADQTopics?: ReadonlyArray<string>;
  readonly prerequisiteTopics?: ReadonlyArray<string>;
  readonly subsequentTopics?: ReadonlyArray<string>;
}

export interface UniversalNode {
  readonly id: string;               // Canonical Node ID e.g. "adq:quran:surah:2", "adq:astronomy:sun"
  readonly category: string;         // e.g. "NaturalElement", "SacredPlace", "PropheticMedicine"
  readonly domain: KnowledgeDomainType;
  readonly names: MultilingualNames;
  readonly aliases: ReadonlyArray<string>;
  readonly description: string;
  readonly tags: ReadonlyArray<string>;
  readonly citations: ReadonlyArray<UniversalCitation>;
  readonly relatedMediaReferences?: ReadonlyArray<string>;
  readonly educationalLevel: EducationalLevel;
  readonly authenticity: AuthenticityMetadata;
  readonly provenance: ProvenanceMetadata;
  readonly fundamentalQuestions?: FundamentalQuestions;
  readonly metadata?: Record<string, unknown>;
}
