import { useMemo, useState } from 'react';
import { useSurahTajweed } from '../hooks/useSurahTajweed';
import { stripTajweedTags } from '../utils/tajweed';

interface TajweedMushafPageProps {
  surahNumber: number;
}

// Groups ayahs into pages sized to roughly fill a 15-line Indo-Pak-style page.
// This is a stylized visual approximation, not a byte-for-byte reproduction of
// a specific printed Mushaf's certified page/line boundaries (that requires a
// dedicated page-layout dataset this integration does not have).
const CHARS_PER_LINE = 38;
const LINES_PER_PAGE = 15;
const CHARS_PER_PAGE = CHARS_PER_LINE * LINES_PER_PAGE;

export function TajweedMushafPage({ surahNumber }: TajweedMushafPageProps) {
  const { ayahs, loading, error } = useSurahTajweed(surahNumber);
  const [pageIndex, setPageIndex] = useState(0);

  const pages = useMemo(() => {
    if (!ayahs) return [];
    const built: Array<Array<{ numberInSurah: number; text: string }>> = [];
    let current: Array<{ numberInSurah: number; text: string }> = [];
    let charCount = 0;
    for (const ayah of ayahs) {
      // Strip tajweed bracket-markup for clean simple black and white Arabic text
      const cleanText = stripTajweedTags(ayah.text);
      current.push({ ...ayah, text: cleanText });
      charCount += cleanText.length;
      if (charCount >= CHARS_PER_PAGE) {
        built.push(current);
        current = [];
        charCount = 0;
      }
    }
    if (current.length) built.push(current);
    return built;
  }, [ayahs]);

  if (loading) {
    return <p className="text-white/50 text-sm italic py-12 text-center">Loading 15-line Classic Mushaf…</p>;
  }
  if (error || !ayahs) {
    return <p className="text-red-300 text-sm py-12 text-center">Could not load the Mushaf text{error ? ` (${error})` : ''}.</p>;
  }

  const page = pages[pageIndex] ?? [];

  return (
    <div>
      <div
        className="rounded-2xl border-2 p-8 shadow-2xl"
        style={{
          borderColor: 'rgba(245, 199, 93, 0.4)',
          background: 'radial-gradient(circle at 50% 50%, rgba(12, 24, 36, 0.95), #060d14)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        }}
      >
        <p
          dir="rtl"
          className="font-arabic text-white text-right font-normal"
          style={{ fontFamily: "'Amiri', serif", fontSize: '1.85rem', lineHeight: '3.1rem', textAlign: 'justify', textAlignLast: 'center' }}
        >
          {page.map((ayah) => (
            <span key={ayah.numberInSurah}>
              {ayah.text}
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-[#f5c75d]/40 text-[#f5c75d] text-sm mx-2 font-sans align-middle bg-[#f5c75d]/10">
                {ayah.numberInSurah}
              </span>{' '}
            </span>
          ))}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
          disabled={pageIndex === 0}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white disabled:opacity-30 hover:bg-[#f5c75d] hover:text-[#0c1824] transition-all font-bold text-xs"
        >
          ← Previous Page
        </button>
        <span className="text-[#f5c75d] text-xs font-bold uppercase tracking-wider bg-[#f5c75d]/10 border border-[#f5c75d]/30 px-3 py-1 rounded-full">
          15-Line Classic Mushaf • Page {pageIndex + 1} of {pages.length}
        </span>
        <button
          onClick={() => setPageIndex((p) => Math.min(pages.length - 1, p + 1))}
          disabled={pageIndex >= pages.length - 1}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white disabled:opacity-30 hover:bg-[#f5c75d] hover:text-[#0c1824] transition-all font-bold text-xs"
        >
          Next Page →
        </button>
      </div>
    </div>
  );
}
