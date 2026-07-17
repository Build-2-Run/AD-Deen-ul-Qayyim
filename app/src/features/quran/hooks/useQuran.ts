import { useState, useEffect } from 'react';
import { QuranService } from '../services/quran-service';
import { SurahMeta } from '../types/quran-ui';

export function useQuran() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data fetching
    const fetchSurahs = async () => {
      setLoading(true);
      // artificial delay to show spinner working
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = QuranService.getSurahs();
      setSurahs(data);
      setLoading(false);
    };
    fetchSurahs();
  }, []);

  return { surahs, loading };
}
