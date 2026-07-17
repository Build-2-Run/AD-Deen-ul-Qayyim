export interface SurahMeta {
  id: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  revelationType: 'Meccan' | 'Medinan';
  totalAyahs: number;
}
