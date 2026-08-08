import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLastRead, ReadingProgress } from '../utils/readingProgress';

export function ContinueReadingBanner() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);

  useEffect(() => {
    setProgress(getLastRead());
  }, []);

  if (!progress) return null;

  return (
    <Link
      to={`/quran/${progress.surahNumber}/read`}
      className="flex items-center justify-between gap-4 mb-8 px-5 py-4 rounded-2xl border transition-all hover:-translate-y-0.5"
      style={{
        background: 'radial-gradient(circle at 10% 20%, rgba(245, 199, 93, 0.15), transparent 60%), #0c1824',
        borderColor: 'rgba(245, 199, 93, 0.35)',
      }}
    >
      <span className="text-sm font-bold text-[#f5c75d]">
        📖 Continue Reading: {progress.surahName} (Surah {progress.surahNumber}:{progress.ayahNumber})
      </span>
      <span className="text-[#f5c75d] text-lg">➔</span>
    </Link>
  );
}
