import { useEffect, useState } from 'react';

export interface TajweedAyah {
  numberInSurah: number;
  text: string;
}

const cache = new Map<number, TajweedAyah[]>();

export function useSurahTajweed(surahNumber: number) {
  const [ayahs, setAyahs] = useState<TajweedAyah[] | null>(cache.get(surahNumber) ?? null);
  const [loading, setLoading] = useState(!cache.has(surahNumber));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = cache.get(surahNumber);
    if (existing) {
      setAyahs(existing);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-tajweed`)
      .then((res) => {
        if (!res.ok) throw new Error(`Tajweed source responded ${res.status}`);
        return res.json();
      })
      .then((json: { data: { ayahs: Array<{ numberInSurah: number; text: string }> } }) => {
        if (cancelled) return;
        const value = json.data.ayahs.map((a) => ({ numberInSurah: a.numberInSurah, text: a.text }));
        cache.set(surahNumber, value);
        setAyahs(value);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || 'Failed to load tajweed mushaf text.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  return { ayahs, loading, error };
}
