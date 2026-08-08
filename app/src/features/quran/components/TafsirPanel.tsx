import { useState } from 'react';
import { TAFSIR_EDITIONS } from '../data/tafsirEditions';
import { useTafsir } from '../hooks/useTafsir';

interface TafsirPanelProps {
  surahNumber: number;
  ayahNumber: number;
}

function TafsirTabContent({ surahNumber, ayahNumber, editionId }: { surahNumber: number; ayahNumber: number; editionId: string }) {
  const edition = TAFSIR_EDITIONS.find((e) => e.id === editionId)!;
  const { text, loading, error } = useTafsir(edition, surahNumber, ayahNumber);

  if (loading) {
    return <p className="text-white/50 text-sm italic py-6 text-center">Loading {edition.englishName}…</p>;
  }
  if (error) {
    return <p className="text-red-300 text-sm py-6 text-center">Could not load this tafsir ({error}).</p>;
  }
  if (!text) {
    return <p className="text-white/50 text-sm italic py-6 text-center">No commentary available for this ayah in {edition.englishName}.</p>;
  }
  return (
    <p
      dir={edition.language === 'ar' ? 'rtl' : 'ltr'}
      className={edition.language === 'ar' ? 'font-arabic text-lg leading-loose text-white/90 text-right' : 'text-base leading-relaxed text-white/90'}
    >
      {text}
    </p>
  );
}

export function TafsirPanel({ surahNumber, ayahNumber }: TafsirPanelProps) {
  const [activeId, setActiveId] = useState(TAFSIR_EDITIONS[0].id);

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <div className="flex gap-2 overflow-x-auto px-3 pt-3 pb-2 hide-scrollbar">
        {TAFSIR_EDITIONS.map((edition) => (
          <button
            key={edition.id}
            onClick={() => setActiveId(edition.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-arabic transition-colors whitespace-nowrap ${
              activeId === edition.id
                ? 'bg-[#f5c75d] text-black font-bold'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {edition.arabicName}
          </button>
        ))}
      </div>
      <div className="px-5 pb-5 pt-2">
        <TafsirTabContent surahNumber={surahNumber} ayahNumber={ayahNumber} editionId={activeId} />
      </div>
    </div>
  );
}
