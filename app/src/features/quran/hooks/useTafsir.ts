import { useEffect, useState } from 'react';
import { TafsirEdition } from '../data/tafsirEditions';

const cache = new Map<string, string>();

function cacheKey(slug: string, surah: number, ayah: number) {
  return `${slug}:${surah}:${ayah}`;
}

export function useTafsir(edition: TafsirEdition, surahNumber: number, ayahNumber: number) {
  const key = cacheKey(edition.slug, surahNumber, ayahNumber);
  const [text, setText] = useState<string | null>(cache.get(key) ?? null);
  const [loading, setLoading] = useState(!cache.has(key));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = cache.get(key);
    if (existing !== undefined) {
      setText(existing);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${edition.slug}/${surahNumber}/${ayahNumber}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Tafsir source responded ${res.status}`);
        return res.json();
      })
      .then((data: { text?: string }) => {
        if (cancelled) return;
        const value = data.text?.trim() || '';
        cache.set(key, value);
        setText(value);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load tafsir.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key, edition.slug, surahNumber, ayahNumber]);

  return { text, loading, error };
}
