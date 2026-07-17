import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bismillah } from '../components/Bismillah';
import { AyahViewer } from '../components/AyahViewer';
import { ReadingWorkspace } from '../../reader/components/ReadingWorkspace';
import { KnowledgeService } from '../../knowledge/services/knowledge-service';
import type { QuranNode } from '../../../types/quran';
import { Spinner } from '../../../components/ui/Spinner';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import { useQuranExperience } from '../hooks/useQuranExperience';

function SurahPageContent() {
  const { id } = useParams<{ id: string }>();
  const [node, setNode] = useState<QuranNode | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const { updateProgress, logActivity } = useQuranExperience();

  useEffect(() => {
    let mounted = true;
    try {
      // In this demo, 'quran-1-1' is the loaded sample if we just use id '1'
      // We'll forcefully load the sample node for demonstration
      const found = KnowledgeService.findNode('quran-1-1');
      if (mounted && found) {
        const qNode = found as QuranNode;
        // Mocking the surah number based on the URL param for the demo
        if (id && !isNaN(parseInt(id))) {
           qNode.surahNumber = parseInt(id);
           if (qNode.surahNumber === 1) qNode.title = 'Al-Fatihah';
           else if (qNode.surahNumber === 2) qNode.title = 'Al-Baqarah';
           else if (qNode.surahNumber === 36) qNode.title = 'Ya-Sin';
           else qNode.title = `Surah ${qNode.surahNumber}`;
        }

        setNode(qNode);
        
        // Log Activity and Progress
        updateProgress({
          surahNumber: qNode.surahNumber,
          surahName: qNode.title,
          ayahNumber: qNode.ayahNumber,
          lastOpened: Date.now(),
          percentage: 5 // mock percentage
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

  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Quran', url: '/quran' },
    { label: node.title },
    { label: `Ayah ${node.ayahNumber}` }
  ];

  const ayahs = [
    { number: node.ayahNumber, arabic: node.arabicText, translation: node.translations?.[0]?.text || '' }
  ];

  return (
    <ReadingWorkspace node={node} breadcrumbs={breadcrumbs}>
      <Bismillah />
      <AyahViewer ayahs={ayahs} />
    </ReadingWorkspace>
  );
}

export function SurahPage() {
  return (
    <ErrorBoundary>
      <SurahPageContent />
    </ErrorBoundary>
  );
}
