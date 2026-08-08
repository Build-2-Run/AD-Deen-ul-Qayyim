import { useEffect, useState } from 'react';

export interface Chapter {
  id: number;
  nameArabic: string;
  nameSimple: string;
  versesCount: number;
}

let cache: Chapter[] | null = null;
let inflight: Promise<Chapter[]> | null = null;

async function fetchChapters(): Promise<Chapter[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch('https://api.quran.com/api/v4/chapters?language=en')
      .then((res) => {
        if (!res.ok) throw new Error(`Chapters source responded ${res.status}`);
        return res.json();
      })
      .then((data: { chapters: Array<{ id: number; name_arabic: string; name_simple: string; verses_count: number }> }) => {
        cache = data.chapters.map((c) => ({
          id: c.id,
          nameArabic: c.name_arabic,
          nameSimple: c.name_simple,
          versesCount: c.verses_count,
        }));
        return cache;
      });
  }
  return inflight;
}

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[] | null>(cache);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) {
      setChapters(cache);
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchChapters()
      .then((data) => {
        if (!cancelled) setChapters(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || 'Failed to load chapter list.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { chapters, loading, error };
}
