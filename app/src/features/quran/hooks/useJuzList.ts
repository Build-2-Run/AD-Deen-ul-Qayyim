import { useEffect, useState } from 'react';

export interface JuzInfo {
  juzNumber: number;
  startSurah: number;
  startAyah: number;
}

let cache: JuzInfo[] | null = null;
let inflight: Promise<JuzInfo[]> | null = null;

async function fetchJuzs(): Promise<JuzInfo[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch('https://api.quran.com/api/v4/juzs')
      .then((res) => {
        if (!res.ok) throw new Error(`Juz source responded ${res.status}`);
        return res.json();
      })
      .then((data: { juzs: Array<{ juz_number: number; verse_mapping: Record<string, string> }> }) => {
        const seen = new Set<number>();
        const list: JuzInfo[] = [];
        for (const j of data.juzs) {
          if (seen.has(j.juz_number)) continue;
          seen.add(j.juz_number);
          const surahKeys = Object.keys(j.verse_mapping).map(Number).sort((a, b) => a - b);
          const startSurah = surahKeys[0];
          const startAyah = Number(j.verse_mapping[String(startSurah)].split('-')[0]);
          list.push({ juzNumber: j.juz_number, startSurah, startAyah });
        }
        list.sort((a, b) => a.juzNumber - b.juzNumber);
        cache = list;
        return list;
      });
  }
  return inflight;
}

export function useJuzList() {
  const [juzs, setJuzs] = useState<JuzInfo[] | null>(cache);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) {
      setJuzs(cache);
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchJuzs()
      .then((data) => {
        if (!cancelled) setJuzs(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || 'Failed to load Juz list.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { juzs, loading, error };
}
