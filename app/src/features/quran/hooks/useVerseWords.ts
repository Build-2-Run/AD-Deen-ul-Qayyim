import { useEffect, useState } from 'react';

export interface VerseWord {
  arabic: string;
  english: string;
  urdu: string;
}

export interface VerseWordsData {
  words: VerseWord[];
  fullEnglish: string;
  fullUrdu: string;
}

const cache = new Map<string, VerseWordsData>();

function stripFootnotes(text: string): string {
  return text.replace(/<sup[^>]*>.*?<\/sup>/g, '').trim();
}

interface RawVerseResponse {
  verse: {
    words: Array<{ char_type_name: string; text_uthmani: string; translation: { text: string | null } }>;
    translations?: Array<{ resource_id: number; text: string }>;
  };
}

export function useVerseWords(surahNumber: number, ayahNumber: number) {
  const key = `${surahNumber}:${ayahNumber}`;
  const [data, setData] = useState<VerseWordsData | null>(cache.get(key) ?? null);
  const [loading, setLoading] = useState(!cache.has(key));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = cache.get(key);
    if (existing) {
      setData(existing);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const base = `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${ayahNumber}?words=true&word_fields=text_uthmani`;

    Promise.all([
      fetch(`${base}&translations=20,54`).then((res) => {
        if (!res.ok) throw new Error(`Verse source responded ${res.status}`);
        return res.json() as Promise<RawVerseResponse>;
      }),
      fetch(`${base}&language=ur`).then((res) => {
        if (!res.ok) throw new Error(`Urdu word source responded ${res.status}`);
        return res.json() as Promise<RawVerseResponse>;
      }),
    ])
      .then(([enJson, urJson]) => {
        if (cancelled) return;
        const enWords = enJson.verse.words.filter((w) => w.char_type_name === 'word');
        const urWords = urJson.verse.words.filter((w) => w.char_type_name === 'word');
        const words = enWords.map((w, i) => ({
          arabic: w.text_uthmani,
          english: w.translation?.text || '',
          urdu: urWords[i]?.translation?.text || '',
        }));
        const fullEnglish = stripFootnotes(enJson.verse.translations?.find((t) => t.resource_id === 20)?.text || '');
        const fullUrdu = stripFootnotes(enJson.verse.translations?.find((t) => t.resource_id === 54)?.text || '');
        const value = { words, fullEnglish, fullUrdu };
        cache.set(key, value);
        setData(value);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || 'Failed to load word-by-word data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key, surahNumber, ayahNumber]);

  return { data, loading, error };
}
