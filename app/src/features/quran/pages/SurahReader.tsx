import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSurah } from '../hooks/useQuran';
import { QuranAdapter } from '../adapters';
import { ReaderProvider } from '../../reader/context/ReaderContext';
import { ReaderView } from '../../reader/components/ReaderView';
import { ReaderBlock, ReaderHeader, ReaderContent } from '../../reader/components/ReaderBlock';
import { KnowledgePanel } from '../../reader/components/KnowledgePanel';
import { ActionBar } from '../../knowledge/components/ActionBar';
import { Icon } from '../../../design/icons/Icon';
import { Heading } from '../../../design/typography/Heading';
import { TafsirPanel } from '../components/TafsirPanel';
import { SynthesisCard } from '../components/SynthesisCard';
import { WordByWordBlock } from '../components/WordByWordBlock';
import { TajweedMushafPage } from '../components/TajweedMushafPage';
import { BookmarkButton } from '../components/BookmarkButton';
import { BookmarksDrawer } from '../components/BookmarksDrawer';
import { saveLastRead } from '../utils/readingProgress';

type ReaderMode = 'word' | 'tajweed';

export function SurahReader() {
  const { surahId } = useParams<{ surahId: string }>();
  const surahNumber = parseInt(surahId || '1', 10);

  const { surah, loading, error } = useSurah(surahNumber);
  const [expandedAyah, setExpandedAyah] = useState<number | null>(null);
  const [mode, setMode] = useState<ReaderMode>('word');
  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  useEffect(() => {
    if (surah) {
      saveLastRead({ surahNumber: surah.number, surahName: surah.name.transliteration, ayahNumber: 1 });
    }
  }, [surah?.number]);

  if (loading) return <div className="p-12 text-center text-[var(--text-secondary)]">Loading Reader...</div>;
  if (error || !surah || !surah.ayahs) return <div className="p-12 text-center text-red-500">Failed to load Ayahs.</div>;

  // Transform Ayahs to KnowledgeNodes using Adapter
  const ayahNodes = surah.ayahs.map(ayah => QuranAdapter.toAyahNode(ayah, surah));

  return (
    <ReaderProvider>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Nastaliq+Urdu&display=swap');`}</style>
      <div className="adq-sky adq-sky-night min-h-screen text-white flex">
        {/* Main Reader Column */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto hide-scrollbar">

          {/* Minimal Reader Navigation Header */}
          <header className="sticky top-0 z-10 bg-black/30 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <Link to="/quran" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={20} />
              <span className="font-medium">Back</span>
            </Link>

            <Heading level={2} size="lg" className="font-arabic text-[#f5c75d]" style={{ fontFamily: "'Amiri', serif", textShadow: '0 0 12px rgba(245, 199, 93, 0.5)' }}>
              {surah.name.arabic}
            </Heading>

            <button
              onClick={() => setBookmarksOpen(true)}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-[#f5c75d] transition-colors"
            >
              <Icon name="Star" size={18} />
              <span className="hidden sm:inline">Bookmarks</span>
            </button>
          </header>

          <BookmarksDrawer open={bookmarksOpen} onClose={() => setBookmarksOpen(false)} />

          {/* Mode Switcher Bar */}
          <div className="flex justify-center gap-3 px-6 pt-6 flex-wrap">
            <button
              onClick={() => setMode('word')}
              className={`px-5 py-2.5 rounded-full text-sm font-extrabold transition-all ${
                mode === 'word'
                  ? 'bg-[#f5c75d] text-black shadow-[0_0_14px_rgba(245,199,93,0.4)]'
                  : 'bg-[#0c1824] text-white border border-[#f5c75d]/40 hover:bg-[#f5c75d]/20 hover:text-[#f5c75d]'
              }`}
            >
              🔍 Word-by-Word &amp; Multi-Lang Translation
            </button>
            <button
              onClick={() => setMode('tajweed')}
              className={`px-5 py-2.5 rounded-full text-sm font-extrabold transition-all ${
                mode === 'tajweed'
                  ? 'bg-[#f5c75d] text-black shadow-[0_0_14px_rgba(245,199,93,0.4)]'
                  : 'bg-[#0c1824] text-white border border-[#f5c75d]/40 hover:bg-[#f5c75d]/20 hover:text-[#f5c75d]'
              }`}
            >
              📜 15-Line Simple Mushaf
            </button>
          </div>

          {mode === 'tajweed' ? (
            <main className="flex-1 py-8 px-6 max-w-4xl mx-auto w-full">
              <TajweedMushafPage surahNumber={surah.number} />
            </main>
          ) : (
          <main className="flex-1 py-12 px-6">
            <ReaderView>
              {ayahNodes.map((node, idx) => (
                <ReaderBlock key={node.id}>
                  <ReaderHeader>
                    {idx === 0 && node.metadata.badges && node.metadata.badges.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 w-full justify-center">
                        {node.metadata.badges.map((badge, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 uppercase tracking-wider">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                    {node.prefixContent && (
                      <div className="w-full text-center mb-8">
                        <Heading level={3} size="xl" className="font-arabic text-white" style={{ fontFamily: "'Amiri', serif", textShadow: '0 0 12px rgba(245, 199, 93, 0.5)' }}>
                          {node.prefixContent}
                        </Heading>
                      </div>
                    )}
                    <Heading
                      level={3}
                      size="lg"
                      className="font-arabic text-[#f5c75d] text-right w-full leading-loose mb-4"
                      style={{ fontFamily: "'Amiri', serif", textShadow: '0 0 16px rgba(245, 199, 93, 0.45)' }}
                    >
                      {node.arabicText}
                      {node.nodeNumber && (
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-sm ml-3 font-sans text-white/70"
                          style={{ textShadow: 'none' }}
                        >
                          {node.nodeNumber}
                        </span>
                      )}
                    </Heading>
                  </ReaderHeader>
                  <ReaderContent>
                    {node.nodeNumber && (
                      <WordByWordBlock surahNumber={surah.number} ayahNumber={Number(node.nodeNumber)} />
                    )}
                  </ReaderContent>
                  <ActionBar node={node} />

                  {node.nodeNumber && (
                    <div className="mt-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <button
                          onClick={() => {
                            const next = expandedAyah === node.nodeNumber ? null : node.nodeNumber;
                            const nextAyah = next == null ? null : Number(next);
                            setExpandedAyah(nextAyah);
                            if (nextAyah) {
                              saveLastRead({ surahNumber: surah.number, surahName: surah.name.transliteration, ayahNumber: nextAyah });
                            }
                          }}
                          className="flex items-center gap-2 text-sm text-[#f5c75d] hover:text-white transition-colors font-medium"
                        >
                          <Icon name="Book" size={16} />
                          {expandedAyah === node.nodeNumber ? 'Hide Tafsir & Synthesis' : 'Tafsir & Synthesis'}
                          <Icon name={expandedAyah === node.nodeNumber ? 'ChevronUp' : 'ChevronDown'} size={16} />
                        </button>

                        <BookmarkButton
                          surahNumber={surah.number}
                          surahName={surah.name.transliteration}
                          ayahNumber={Number(node.nodeNumber)}
                          arabicPreview={node.arabicText ?? ''}
                        />
                      </div>

                      {expandedAyah === node.nodeNumber && (
                        <>
                          <TafsirPanel surahNumber={surah.number} ayahNumber={node.nodeNumber} />
                          <SynthesisCard surahNumber={surah.number} ayahNumber={node.nodeNumber} />
                        </>
                      )}
                    </div>
                  )}
                </ReaderBlock>
              ))}
            </ReaderView>
          </main>
          )}
        </div>

        {/* Global Knowledge Panel for Services */}
        <KnowledgePanel />
      </div>
    </ReaderProvider>
  );
}
