import { useState, useEffect } from 'react';
import { QuranRepository } from '../repository';
import { Surah } from '../models';

export function useQuranList() {
  const [surahs, setSurahs] = useState<Omit<Surah, 'ayahs'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    QuranRepository.getSurahs().then(data => {
      setSurahs(data);
      setLoading(false);
    });
  }, []);

  return { surahs, loading };
}

export function useSurah(surahNumber: number) {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    QuranRepository.getSurah(surahNumber)
      .then(data => {
        if (mounted) {
          setSurah(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [surahNumber]);

  return { surah, loading, error };
}
