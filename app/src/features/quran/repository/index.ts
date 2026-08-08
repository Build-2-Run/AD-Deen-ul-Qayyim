import { Surah } from '../models';
import { mockQuranData } from '../mock/data';

export interface IQuranRepository {
  getSurahs(): Promise<Omit<Surah, 'ayahs'>[]>;
  getSurah(number: number): Promise<Surah>;
}

class QuranRepositoryImpl implements IQuranRepository {
  async getSurahs(): Promise<Omit<Surah, 'ayahs'>[]> {
    try {
      const res = await fetch('https://api.quran.com/api/v4/chapters');
      if (!res.ok) throw new Error('API fetch failed');
      const data = await res.json();
      
      if (data && data.chapters && Array.isArray(data.chapters)) {
        return data.chapters.map((c: any) => ({
          id: `quran:${c.id}`,
          number: c.id,
          name: {
            arabic: c.name_arabic,
            english: c.translated_name?.name || c.name_simple,
            transliteration: c.name_simple
          },
          revelation: {
            type: c.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'
          },
          ayahCount: c.verses_count
        }));
      }
    } catch (err) {
      console.warn('[QuranRepository] Failed to fetch 114 surahs from API, using fallback', err);
    }

    // Fallback to mock data if offline or error
    return mockQuranData.map(s => {
      const { ayahs, ...rest } = s;
      return rest;
    });
  }

  async getSurah(number: number): Promise<Surah> {
    const surah = mockQuranData.find(s => s.number === number);
    if (!surah) {
      // Create lightweight fallback object for any surah requested
      return {
        id: `quran:${number}`,
        number,
        name: {
          arabic: `سورة ${number}`,
          english: `Surah ${number}`,
          transliteration: `Surah ${number}`
        },
        revelation: { type: 'Meccan', order: 1 },
        ayahCount: 7,
        ayahs: []
      };
    }
    return surah;
  }
}

export const QuranRepository = new QuranRepositoryImpl();
