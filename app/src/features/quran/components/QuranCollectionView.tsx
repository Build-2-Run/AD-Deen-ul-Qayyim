import { useState, useMemo } from 'react';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body } from '../../../design/typography/BasicText';
import { KnowledgeCollection } from '../../knowledge/components/KnowledgeCollection';
import { useQuranList } from '../hooks/useQuran';
import { QuranAdapter } from '../adapters';
import { Icon } from '../../../design/icons/Icon';
import { KnowledgeNode } from '../../knowledge/types';
import { ContinueReadingBanner } from './ContinueReadingBanner';
import { useJuzList } from '../hooks/useJuzList';

import { Link } from 'react-router-dom';

export type QuranCollectionType = 'surah' | 'juz' | 'hizb' | 'ruku' | 'sajdah';

interface QuranCollectionViewProps {
  type: QuranCollectionType;
}

export function QuranCollectionView({ type }: QuranCollectionViewProps) {
  const [search, setSearch] = useState('');
  const [browseTab, setBrowseTab] = useState<'surah' | 'juz'>('surah');
  const { surahs, loading } = useQuranList();
  const { juzs, loading: juzLoading } = useJuzList();

  const filteredSurahs = useMemo(() => {
    if (!search) return surahs;
    return surahs.filter(s =>
      s.name.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      s.name.english.toLowerCase().includes(search.toLowerCase()) ||
      s.name.arabic.includes(search) ||
      s.number.toString() === search
    );
  }, [surahs, search]);

  const titles = {
    surah: { title: "The Noble Quran", desc: "Explore the divine revelation. Select a Surah to open the Word-by-Word & Tajweed Mushaf Reader." },
    juz: { title: "Juz (Parts)", desc: "Read the Quran divided into 30 equal parts." },
    hizb: { title: "Hizb (Half Parts)", desc: "Read the Quran divided into 60 Hizbs." },
    ruku: { title: "Ruku (Sections)", desc: "Read the Quran by thematic sections." },
    sajdah: { title: "Sajdah (Prostrations)", desc: "Verses requiring prostration of recitation." },
  };

  const { title, desc } = titles[type];

  return (
    <PageContainer>
      <ContentContainer>
        <header className="mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-extrabold tracking-tight mb-3 text-[#fbbf24]" style={{ textShadow: '0 0 24px rgba(251,191,36,0.5)' }}>
            The Noble Quran
          </h1>
          <p className="max-w-3xl text-[#6ee7b7] text-base md:text-lg font-semibold leading-relaxed mb-4" style={{ textShadow: '0 0 12px rgba(110,231,183,0.3)' }}>
            {desc}
          </p>
        </header>

        {type === 'surah' && <ContinueReadingBanner />}

        {type === 'surah' && (
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setBrowseTab('surah')}
              className={`px-6 py-2.5 rounded-full text-sm font-extrabold transition-all ${
                browseTab === 'surah'
                  ? 'bg-[#f5c75d] text-black shadow-[0_0_16px_rgba(245,199,93,0.4)]'
                  : 'bg-[#0c1824] text-white border border-[#f5c75d]/40 hover:bg-[#f5c75d]/20 hover:text-[#f5c75d]'
              }`}
            >
              📖 Surah (1–114)
            </button>
            <button
              onClick={() => setBrowseTab('juz')}
              className={`px-6 py-2.5 rounded-full text-sm font-extrabold transition-all ${
                browseTab === 'juz'
                  ? 'bg-[#f5c75d] text-black shadow-[0_0_16px_rgba(245,199,93,0.4)]'
                  : 'bg-[#0c1824] text-white border border-[#f5c75d]/40 hover:bg-[#f5c75d]/20 hover:text-[#f5c75d]'
              }`}
            >
              📜 Parah (Juz 1–30)
            </button>
          </div>
        )}

        {/* 2 Top Hero Entry Cards */}
        {type === 'surah' && browseTab === 'surah' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Card 1: Word-by-Word Reader */}
            <Link
              to="/quran/1/read?mode=word"
              className="p-6 md:p-8 rounded-2xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1"
              style={{
                background: 'radial-gradient(circle at 90% 10%, rgba(245, 199, 93, 0.2), transparent 60%), #0c1824',
                border: '1.5px solid rgba(245, 199, 93, 0.4)',
                boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold text-[#f5c75d] uppercase tracking-wider mb-3 bg-[#f5c75d]/15 border border-[#f5c75d]/30">
                <span>🔍 MULTI-LANGUAGE &amp; ROOT WORDS</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#f5c75d] transition-colors">
                Word-by-Word Reader
              </h2>
              <p className="text-xs text-white/80 leading-relaxed mb-6 max-w-md">
                Study each word with English translation, Urdu translation (اردو), and Arabic Root Word (جذر) morphological analysis.
              </p>
              <div className="text-xs font-bold text-[#f5c75d] flex items-center gap-2">
                <span>Launch Word-by-Word Reader</span>
                <span>➔</span>
              </div>
            </Link>

            {/* Card 2: 15-Line Classic Simple Mushaf */}
            <Link
              to="/quran/1/read?mode=tajweed"
              className="p-6 md:p-8 rounded-2xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1"
              style={{
                background: 'radial-gradient(circle at 90% 10%, rgba(110, 231, 183, 0.15), transparent 60%), #0c1824',
                border: '1.5px solid rgba(110, 231, 183, 0.35)',
                boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#6ee7b7] transition-colors">
                15-Line Classic Simple Mushaf
              </h2>
              <p className="text-xs text-white/80 leading-relaxed mb-6 max-w-md">
                Traditional South Asian 15-line black-and-white classical Arabic calligraphy for Huffaz and daily recitation.
              </p>
              <div className="text-xs font-bold text-[#6ee7b7] flex items-center gap-2">
                <span>Open 15-Line Classic Mushaf</span>
                <span>➔</span>
              </div>
            </Link>
          </div>
        )}

        {!(type === 'surah' && browseTab === 'juz') && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder={`Search ${type}s by name or number...`}
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#f5c75d] transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {type === 'surah' && browseTab === 'juz' ? (
          juzLoading ? (
            <div className="py-12 text-center text-white/60">Loading Parah (Juz) list...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {(juzs ?? []).map((juz) => (
                <Link
                  key={juz.juzNumber}
                  to={`/quran/${juz.startSurah}/read`}
                  className="group rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'radial-gradient(circle at 90% 10%, rgba(245, 199, 93, 0.15), transparent 55%), #0c1824',
                    border: '1px solid rgba(245, 199, 93, 0.35)',
                  }}
                >
                  <div className="text-[10px] font-bold text-[#f5c75d] uppercase tracking-wider mb-2">Parah</div>
                  <div className="text-2xl font-bold text-white group-hover:text-[#f5c75d] transition-colors mb-2">{juz.juzNumber}</div>
                  <div className="text-[11px] text-white/60">Starts Surah {juz.startSurah}:{juz.startAyah}</div>
                </Link>
              ))}
            </div>
          )
        ) : loading ? (
          <div className="py-12 text-center text-white/60">Loading {title}...</div>
        ) : type === 'surah' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.id}
                to={`/quran/${surah.number}/read`}
                className="group relative rounded-xl p-3 transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5"
                style={{
                  background: 'radial-gradient(circle at 90% 10%, rgba(245, 199, 93, 0.15), transparent 55%), #0c1824',
                  border: '1px solid rgba(245, 199, 93, 0.35)',
                  borderLeft: '3px solid #f5c75d',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-[#f5c75d] uppercase tracking-wider bg-[#f5c75d]/10 border border-[#f5c75d]/30">
                      {surah.number}
                    </span>
                    <span className="font-arabic text-lg text-[#f5c75d]" style={{ fontFamily: "'Amiri', serif" }}>
                      {surah.name.arabic}
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-white group-hover:text-[#f5c75d] transition-colors truncate">
                    {surah.name.transliteration}
                  </h3>
                  <p className="text-[11px] text-white/60 truncate mb-1.5">{surah.name.english}</p>

                  <div className="text-[10px] text-white/70 font-medium pt-1.5 border-t border-white/10 flex items-center justify-between">
                    <span>{surah.revelation.type}</span>
                    <span>{surah.ayahCount} Ayahs</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <KnowledgeCollection nodes={[]} mode="grid" />
        )}
      </ContentContainer>
    </PageContainer>
  );
}
