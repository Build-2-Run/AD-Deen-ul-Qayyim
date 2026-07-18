import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Share2, Settings, Maximize } from 'lucide-react';

import { Bismillah } from '../components/Bismillah';
import { AyahViewer } from '../components/AyahViewer';
import type { QuranNode } from '../../../types/quran';
import { Spinner } from '../../../components/ui/Spinner';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import { useQuranExperience } from '../hooks/useQuranExperience';

// Platform Reader & Study UI
import { ReaderLayout } from '../../../platform/reader/ReaderLayout';
import { ReaderToolbar, ReaderToolbarItem } from '../../../platform/reader/components/ReaderToolbar';
import { BookmarkButton } from '../../../platform/study/components/BookmarkButton';
import { NoteButton } from '../../../platform/study/components/NoteButton';
import { NotesPanel } from '../../../platform/study/components/NotesPanel';
import { KnowledgeConnectionsPanel } from '../../../platform/relations/components/KnowledgeConnectionsPanel';

function SurahPageContent() {
  const { id } = useParams<{ id: string }>();
  const [node, setNode] = useState<QuranNode | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  
  const { updateProgress, logActivity } = useQuranExperience();

  useEffect(() => {
    let mounted = true;
    try {
      if (mounted) {
        const surahNumber = (id && !isNaN(parseInt(id))) ? parseInt(id) : 1;
        let title = `Surah ${surahNumber}`;
        if (surahNumber === 1) title = 'Al-Fatihah';
        else if (surahNumber === 2) title = 'Al-Baqarah';
        else if (surahNumber === 36) title = 'Ya-Sin';

        const mockNode: QuranNode = {
          id: `quran-${surahNumber}`,
          title: title,
          slug: title.toLowerCase().replace(/ /g, '-'),
          status: 'Published',
          surahNumber: surahNumber,
          ayahNumber: 1,
          arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          translations: [{ languageCode: 'en', text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', translatorId: 'Sahih International' }],
          category: 'quran',
        };

        setNode(mockNode);
        
        updateProgress({
          surahNumber: mockNode.surahNumber,
          surahName: mockNode.title,
          ayahNumber: mockNode.ayahNumber,
          lastOpened: Date.now(),
          percentage: 5
        });
        
        logActivity({
          id: mockNode.id,
          title: mockNode.title,
          url: `/quran/surah/${mockNode.surahNumber}`
        });
      }
    } catch (err) {
      if (mounted) setError(err instanceof Error ? err : new Error('Unknown error'));
    }
    return () => { mounted = false; };
  }, [id, updateProgress, logActivity]);

  if (error) throw error;

  if (!node) {
    return <div className="flex justify-center py-24"><Spinner /></div>;
  }

  const ayahs = [
    { number: node.ayahNumber, arabic: node.arabicText, translation: node.translations?.[0]?.text || '' }
  ];
  
  const nodeId = node.id;

  const toolbarItems: ReaderToolbarItem[] = [
    { id: 'copy', icon: <Copy className="w-5 h-5" />, label: 'Copy Ayah', enabled: true, visible: true, onClick: () => console.log('Copy') },
    { id: 'share', icon: <Share2 className="w-5 h-5" />, label: 'Share', enabled: true, visible: true, onClick: () => console.log('Share') },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Reader Settings', enabled: true, visible: true, onClick: () => console.log('Settings') },
    { id: 'fullscreen', icon: <Maximize className="w-5 h-5" />, label: 'Fullscreen', enabled: true, visible: true, onClick: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error(err));
      } else {
        document.exitFullscreen();
      }
    } },
  ];

  const header = (
    <div className="flex items-center text-sm">
      <Link to="/" className="text-gray-500 hover:text-emerald-600 transition-colors">Home</Link>
      <span className="mx-2 text-gray-300">/</span>
      <Link to="/quran" className="text-gray-500 hover:text-emerald-600 transition-colors">Quran</Link>
      <span className="mx-2 text-gray-300">/</span>
      <span className="text-gray-900 font-medium">{node.title}</span>
    </div>
  );

  const leftSidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h3 className="font-semibold text-lg mb-4">Surah Information</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-500 block text-xs uppercase tracking-wider">Number</span>
            <span className="font-medium">{node.surahNumber}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs uppercase tracking-wider">Revelation</span>
            <span className="font-medium">Meccan</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <KnowledgeConnectionsPanel nodeId={nodeId} />
      </div>
    </div>
  );
  
  const rightSidebar = showNotes ? (
    <NotesPanel nodeId={nodeId} onClose={() => setShowNotes(false)} />
  ) : undefined;

  return (
    <ReaderLayout 
      header={header}
      toolbar={
        <ReaderToolbar items={toolbarItems}>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />
          <BookmarkButton nodeId={nodeId} title={node.title} />
          <div onClick={() => setShowNotes(!showNotes)}>
            <NoteButton />
          </div>
        </ReaderToolbar>
      }
      leftSidebar={leftSidebar}
      rightSidebar={rightSidebar}
    >
      <Bismillah />
      <AyahViewer ayahs={ayahs} />
    </ReaderLayout>
  );
}

export function SurahPage() {
  return (
    <ErrorBoundary>
      <SurahPageContent />
    </ErrorBoundary>
  );
}
