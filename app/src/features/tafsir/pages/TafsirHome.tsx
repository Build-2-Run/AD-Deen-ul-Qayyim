import { useState } from 'react';
import { useChapters } from '../hooks/useChapters';
import { TafsirPanel } from '../../quran/components/TafsirPanel';
import { SynthesisCard } from '../../quran/components/SynthesisCard';

export function TafsirHome() {
  const { chapters, loading, error } = useChapters();
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahNumber, setAyahNumber] = useState(1);

  const activeChapter = chapters?.find((c) => c.id === surahNumber);
  const maxAyah = activeChapter?.versesCount ?? 286;

  function handleSurahChange(value: number) {
    setSurahNumber(value);
    setAyahNumber(1);
  }

  function handleAyahChange(value: number) {
    const clamped = Math.min(Math.max(1, value), maxAyah);
    setAyahNumber(clamped);
  }

  return (
    <div className="adq-sky adq-sky-night min-h-screen text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');`}</style>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1
          className="text-3xl sm:text-4xl font-bold text-center mb-2"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          <span style={{ color: '#f5c75d', textShadow: '0 0 16px rgba(245, 199, 93, 0.5)' }}>Tafsir al-Qur'an</span>{' '}
          <span className="text-white">(تفسير القرآن)</span>
        </h1>
        <p className="text-center text-white/60 text-sm mb-10">
          Select a Surah and Ayah to read seven verified classical commentaries side by side.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 mb-6 flex flex-col sm:flex-row gap-4">
          <label className="flex-1 flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-white/50">Surah</span>
            <select
              value={surahNumber}
              onChange={(e) => handleSurahChange(Number(e.target.value))}
              disabled={loading}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white disabled:opacity-50"
            >
              {loading && <option>Loading surahs…</option>}
              {error && <option>Failed to load surah names</option>}
              {chapters?.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0b1f1a]">
                  {c.id}. {c.nameSimple} — {c.nameArabic}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 sm:w-40">
            <span className="text-xs uppercase tracking-wider text-white/50">Ayah (1–{maxAyah})</span>
            <input
              type="number"
              min={1}
              max={maxAyah}
              value={ayahNumber}
              onChange={(e) => handleAyahChange(Number(e.target.value))}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </label>
        </div>

        <TafsirPanel surahNumber={surahNumber} ayahNumber={ayahNumber} />
        <SynthesisCard surahNumber={surahNumber} ayahNumber={ayahNumber} />
      </div>
    </div>
  );
}
