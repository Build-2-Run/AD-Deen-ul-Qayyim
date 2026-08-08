export type NodeCategory =
  | 'QuranVerse'
  | 'Hadith'
  | 'AstronomicalPhenomenon'
  | 'Prayer'
  | 'HijriCalendar'
  | 'FiqhRule'
  | 'HistoricalScholar'
  | 'ScientificConcept'
  | 'EducationalTopic'
  | 'Tafsir'
  | 'Place';

export interface CitationReference {
  readonly code: string;            // e.g. "Qur'an 36:38", "Sahih al-Bukhari 547"
  readonly arabicText: string;
  readonly englishText: string;
  readonly source: string;
}

export interface KnowledgeNode {
  readonly id: string;               // e.g. "node:sun", "node:quran:36:38"
  readonly category: NodeCategory;
  readonly label: string;            // English label
  readonly arabicLabel: string;      // Arabic label
  readonly description: string;
  readonly tags: ReadonlyArray<string>;
  readonly citations: ReadonlyArray<CitationReference>;
  readonly metadata?: Record<string, unknown>;
}
