import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Share2, Settings, Maximize } from 'lucide-react';

import { Bismillah } from '../components/Bismillah';
import { Spinner } from '../../../components/ui/Spinner';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import { useQuranExperience } from '../hooks/useQuranExperience';
import { DatasetRegistry, DatasetMetadata } from '../../../platform/registry/DatasetRegistry';

import { ReaderLayout, useReader } from '../../../platform/reader/ReaderLayout';
import { ReaderToolbar, ReaderToolbarItem } from '../../../platform/reader/components/ReaderToolbar';
import { ReaderSettingsPanel } from '../../../platform/reader/components/ReaderSettingsPanel';
import { ReaderNavigation } from '../../../platform/reader/components/ReaderNavigation';

import { BookmarkButton } from '../../../platform/study/components/BookmarkButton';
import { NoteButton } from '../../../platform/study/components/NoteButton';
import { NotesPanel } from '../../../platform/study/components/NotesPanel';
import { KnowledgeConnectionsPanel } from '../../../platform/relations/components/KnowledgeConnectionsPanel';

function SurahPageContent() {
  const { id } = useParams<{ id: string }>();
  const surahNumber = id ? parseInt(id, 10) : 1;
  
  const [baseSurah, setBaseSurah] = useState<any>(null);
  const [translationData, setTranslationData] = useState<any>(null);
  const [meta, setMeta] = useState<DatasetMetadata | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  const { updateProgress, logActivity } = useQuranExperience();
  const { preferences } = useReader();

  // Load Base Surah
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const metadata = await DatasetRegistry.loadMetadata();
        if (mounted) setMeta(metadata);

        const data = await DatasetRegistry.loadSurah(surahNumber);
        if (mounted) {
          setBaseSurah(data);
          updateProgress({
            surahNumber,
            surahName: data.englishName || data.name,
            ayahNumber: 1,
            lastOpened: Date.now(),
            percentage: 5
          });
          logActivity({
            id: `quran:surah:${surahNumber}`,
            title: data.englishName || data.name,
            url: `/quran/surah/${surahNumber}`
          });
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Unknown error loading Surah'));
      }
    };
    load();
    return () => { mounted = false; };
  }, [surahNumber, updateProgress, logActivity]);

  // Lazy-Load Translation
  useEffect(() => {
    let mounted = true;
    const loadTrans = async () => {
      if (!preferences.translationLanguage || preferences.translationLanguage === 'none') {
        setTranslationData(null);
        return;
      }
      
      const [lang, author] = preferences.translationLanguage.split('-');
      try {
        const data = await DatasetRegistry.loadTranslation(surahNumber, lang, author);
        if (mounted) setTranslationData(data);
      } catch (err) {
        console.error("Failed to load translation", err);
      }
    };
    loadTrans();
    return () => { mounted = false; };
  }, [surahNumber, preferences.translationLanguage]);

  if (error) throw error;
  if (!baseSurah || !meta) return <div className="flex justify-center py-24"><Spinner /></div>;

  const nodeId = `quran:surah:${surahNumber}`;
  
  // Combine Arabic and Translation
  const ayahs = baseSurah.ayahs.map((a: any, idx: number) => ({
    number: a.number,
    arabic: a.arabic,
    translation: translationData ? translationData.ayahs[idx]?.text : undefined
  }));

  const toolbarItems: ReaderToolbarItem[] = [
    { id: 'copy', icon: <Copy className="w-5 h-5" />, label: 'Copy', enabled: true, visible: true, onClick: () => console.log('Copy') },
    { id: 'share', icon: <Share2 className="w-5 h-5" />, label: 'Share', enabled: true, visible: true, onClick: () => console.log('Share') },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings', enabled: true, visible: true, onClick: () => setShowSettings(!showSettings) },
    { id: 'fullscreen', icon: <Maximize className="w-5 h-5" />, label: 'Fullscreen', enabled: true, visible: true, onClick: () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(e => console.error(e));
      else document.exitFullscreen();
    } },
  ];

  const header = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center text-sm">
        <Link to="/" className="text-gray-500 hover:text-emerald-600 transition-colors">Home</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link to="/quran" className="text-gray-500 hover:text-emerald-600 transition-colors">Quran</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{baseSurah.englishName} ({baseSurah.name})</span>
      </div>
      <ReaderNavigation currentSurah={surahNumber} />
    </div>
  );

  const leftSidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h3 className="font-semibold text-lg mb-4">Surah Information</h3>
        <div className="space-y-3 text-sm">
          <div><span className="text-gray-500 block text-xs uppercase tracking-wider">Number</span><span className="font-medium">{surahNumber}</span></div>
          <div><span className="text-gray-500 block text-xs uppercase tracking-wider">Revelation</span><span className="font-medium">{baseSurah.revelationType}</span></div>
          <div><span className="text-gray-500 block text-xs uppercase tracking-wider">Total Ayahs</span><span className="font-medium">{baseSurah.numberOfAyahs}</span></div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <KnowledgeConnectionsPanel nodeId={nodeId} />
      </div>
    </div>
  );
  
  const rightSidebar = showNotes ? <NotesPanel nodeId={nodeId} onClose={() => setShowNotes(false)} /> : undefined;

  return (
    <>
      <ReaderLayout 
        header={header}
        toolbar={
          <ReaderToolbar items={toolbarItems}>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />
            <BookmarkButton nodeId={nodeId} title={baseSurah.englishName} />
            <div onClick={() => setShowNotes(!showNotes)}>
              <NoteButton />
            </div>
          </ReaderToolbar>
        }
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
      >
        <Bismillah />
        
        <div className="space-y-12 mt-8">
          {ayahs.map((ayah: any) => (
            <div key={ayah.number} className="flex flex-col gap-6" id={`ayah-${ayah.number}`}>
              <div 
                className="text-right font-arabic leading-loose text-gray-900 dark:text-gray-100 relative" 
                style={{ fontSize: `${preferences.arabicSize}px` }}
                dir="rtl"
              >
                {ayah.arabic} <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-sm ml-2">{ayah.number}</span>
                {preferences.developerMode && (
                  <div className="absolute top-0 right-0 -mt-6 text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 px-1 py-0.5 rounded" dir="ltr">
                    quran:surah:{surahNumber}:ayah:{ayah.number}
                  </div>
                )}
              </div>
              {ayah.translation && (
                <div 
                  className="text-gray-600 dark:text-gray-300"
                  style={{ fontSize: `${preferences.translationSize}px` }}
                  dir={preferences.translationLanguage.startsWith('ur') ? 'rtl' : 'ltr'}
                >
                  {ayah.translation}
                </div>
              )}
            </div>
          ))}
        </div>

      </ReaderLayout>
      {showSettings && <ReaderSettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
}

export function SurahPage() {
  // Render Provider around content to supply context
  return (
    <ErrorBoundary>
      <ReaderLayout>
        <SurahPageContent />
      </ReaderLayout>
    </ErrorBoundary>
  );
}
