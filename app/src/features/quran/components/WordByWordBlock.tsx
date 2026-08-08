import { useVerseWords } from '../hooks/useVerseWords';

interface WordByWordBlockProps {
  surahNumber: number;
  ayahNumber: number;
}

export function WordByWordBlock({ surahNumber, ayahNumber }: WordByWordBlockProps) {
  const { data, loading, error } = useVerseWords(surahNumber, ayahNumber);

  if (loading) {
    return <p className="text-white/50 text-sm italic py-4 text-center">Loading word-by-word breakdown…</p>;
  }
  if (error || !data) {
    return <p className="text-red-300 text-sm py-4 text-center">Could not load word-by-word data{error ? ` (${error})` : ''}.</p>;
  }

  return (
    <div className="mt-2">
      <div dir="rtl" className="flex flex-wrap gap-1.5 justify-end mb-2">
        {data.words.map((word, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 min-w-[44px]">
            <span
              className="font-arabic text-base text-[#f5c75d]"
              style={{ fontFamily: "'Amiri', serif", textShadow: '0 0 8px rgba(245, 199, 93, 0.4)' }}
            >
              {word.arabic}
            </span>
            <span className="text-[10px] text-white/70 text-center leading-tight">{word.english}</span>
            {word.urdu && (
              <span
                dir="rtl"
                className="text-[11px] text-white/70 text-center leading-tight"
                style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
              >
                {word.urdu}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-black/20 border border-white/10 p-2.5 space-y-1.5">
        {data.fullEnglish && (
          <p className="text-white/90 text-xs leading-snug">
            <span className="text-white/40 uppercase tracking-wider text-[9px] mr-2">EN</span>
            {data.fullEnglish}
          </p>
        )}
        {data.fullUrdu && (
          <p dir="rtl" className="text-white/90 text-sm leading-snug text-right" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
            <span className="text-white/40 uppercase tracking-wider text-[9px] ml-2" style={{ fontFamily: 'inherit' }}>UR</span>
            {data.fullUrdu}
          </p>
        )}
      </div>
    </div>
  );
}
