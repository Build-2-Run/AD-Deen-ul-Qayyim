import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Share2, Settings, Maximize } from 'lucide-react';

import { Bismillah } from '../components/Bismillah';
import { AyahViewer } from '../components/AyahViewer';
import { KnowledgeService } from '../../knowledge/services/knowledge-service';
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

function SurahPageContent() {
  const { id } = useParams<{ id: string }>();
  const [node, setNode] = useState<QuranNode | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  
  const { updateProgress, logActivity } = useQuranExperience();

  useEffect(() => {
    let mounted = true;
    try {
      const found = KnowledgeService.findNode('quran-1-1');
      if (mounted && found) {
        const qNode = found as QuranNode;
        if (id && !isNaN(parseInt(id))) {
           qNode.surahNumber = parseInt(id);
           if (qNode.surahNumber === 1) qNode.title = 'Al-Fatihah';
           else if (qNode.surahNumber === 2) qNode.title = 'Al-Baqarah';
           else if (qNode.surahNumber === 36) qNode.title = 'Ya-Sin';
           else qNode.title = `Surah ${qNode.surahNumber}`;
        }

        setNode(qNode);
        
        updateProgress({
          surahNumber: qNode.surahNumber,
          surahName: qNode.title,
          ayahNumber: qNode.ayahNumber,
          lastOpened: Date.now(),
          percentage: 5
        });
        
        logActivity({
          id: `quran-${qNode.surahNumber}`,
          title: qNode.title,
          url: `/quran/surah/${qNode.surahNumber}`
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
  
  const nodeId = `quran-${node.surahNumber}`;

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
    <div className="p-4">
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
      
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-4">Related Knowledge</h3>
        <p className="text-sm text-gray-500">Connections will appear here.</p>
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
