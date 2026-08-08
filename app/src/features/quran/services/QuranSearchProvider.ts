import { SearchProvider, SearchResult } from '../../../platform/registry/SearchRegistry';
import { mockQuranData } from '../mock/data';

export const QuranSearchProvider: SearchProvider = {
  id: 'quran-search',
  name: 'Quran',
  search: async (query: string): Promise<SearchResult[]> => {
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    mockQuranData.forEach(surah => {
      // 1. Search Surah Names
      if (
        surah.name.english.toLowerCase().includes(q) ||
        surah.name.transliteration.toLowerCase().includes(q) ||
        surah.name.arabic.includes(q)
      ) {
        results.push({
          id: surah.id,
          title: surah.name.transliteration,
          subtitle: `Surah ${surah.number}`,
          description: surah.name.english,
          url: `/quran/${surah.number}`,
          category: 'Quran - Surah',
          score: 100
        });
      }

      // 2. Search Ayahs
      surah.ayahs?.forEach(ayah => {
        const arabicMatch = ayah.text.arabic.includes(q);
        const transMatch = ayah.translation?.en?.toLowerCase().includes(q);
        
        if (arabicMatch || transMatch) {
          results.push({
            id: ayah.id,
            title: `${surah.name.transliteration} ${surah.number}:${ayah.ayahNumber}`,
            subtitle: arabicMatch ? ayah.text.arabic : (ayah.translation?.en || ''),
            url: `/quran/${surah.number}/read`, // Usually we'd append an anchor or ayah param
            category: 'Quran - Ayah',
            score: arabicMatch ? 80 : 60
          });
        }
      });
    });

    return results;
  }
};
