export type RevelationType = 'Meccan' | 'Medinan';

export interface RevelationInfo {
  type: RevelationType;
  order: number;
  place?: string;
}

export interface QuranMetadata {
  surahNumber: number;
  ayahNumber: number;
  juz: number;
  hizbQuarter: number;
  page: number;
  ruku: number;
  manzil: number;
  sajdah?: boolean | { recommended: boolean; obligatory: boolean };
}

export interface Ayah {
  id: string; // e.g., "quran:1:1"
  surahNumber: number;
  ayahNumber: number;
  text: {
    arabic: string;
    uthmani?: string;
    imlaei?: string;
  };
  translation?: {
    [languageCode: string]: string;
  };
  metadata: QuranMetadata;
}

export interface Surah {
  id: string; // e.g., "quran:1"
  number: number;
  name: {
    arabic: string;
    english: string;
    transliteration: string;
  };
  revelation: RevelationInfo;
  ayahCount: number;
  ayahs?: Ayah[]; // Optional, populated when loading a specific Surah
}

// ==========================================
// Future Extension Points (No implementation)
// ==========================================

export interface TafsirProvider {
  getTafsir(ayahId: string, author: string): Promise<any>;
}

export interface TranslationProvider {
  getTranslation(ayahId: string, language: string, author: string): Promise<any>;
}

export interface AudioProvider {
  getAyahAudio(ayahId: string, reciter: string): Promise<any>;
  getWordAudio(wordId: string): Promise<any>;
}

export interface CrossReferenceProvider {
  getRelatedAyahs(ayahId: string): Promise<any>;
  getRelatedHadiths(ayahId: string): Promise<any>;
}

export interface WordAnalysisProvider {
  getWordByWord(ayahId: string): Promise<any>;
  getRootAnalysis(wordId: string): Promise<any>;
  getGrammar(ayahId: string): Promise<any>;
}
