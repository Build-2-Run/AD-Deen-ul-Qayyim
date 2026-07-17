import { SurahMeta } from '../types/quran-ui';

export class QuranService {
  static getSurahs(): SurahMeta[] {
    return [
      { id: 1, nameArabic: 'الفاتحة', nameTransliterated: 'Al-Fatihah', nameEnglish: 'The Opening', revelationType: 'Meccan', totalAyahs: 7 },
      { id: 2, nameArabic: 'البقرة', nameTransliterated: 'Al-Baqarah', nameEnglish: 'The Cow', revelationType: 'Medinan', totalAyahs: 286 },
      { id: 3, nameArabic: 'آل عمران', nameTransliterated: 'Ali \'Imran', nameEnglish: 'Family of Imran', revelationType: 'Medinan', totalAyahs: 200 },
      { id: 114, nameArabic: 'الناس', nameTransliterated: 'An-Nas', nameEnglish: 'Mankind', revelationType: 'Meccan', totalAyahs: 6 }
    ];
  }
}
