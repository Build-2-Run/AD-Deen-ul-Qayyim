import { useEffect, useState } from 'react';
import { Bismillah } from '../components/Bismillah';
import { AyahViewer } from '../components/AyahViewer';
import { ReadingWorkspace } from '../../reader/components/ReadingWorkspace';
import { KnowledgeService } from '../../knowledge/services/knowledge-service';
import type { QuranNode } from '../../../types/quran';
import { Spinner } from '../../../components/ui/Spinner';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

function SurahPageContent() {
  const [node, setNode] = useState<QuranNode | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    try {
      // Fetch data via the unified Knowledge Engine Runtime rather than isolated QuranService
      const found = KnowledgeService.findNode('quran-1-1');
      if (mounted && found) {
        setNode(found as QuranNode);
      }
    } catch (err) {
      if (mounted) setError(err instanceof Error ? err : new Error('Unknown error'));
    }
    return () => { mounted = false; };
  }, []);

  if (error) throw error;

  if (!node) {
    return <div className="flex justify-center py-24"><Spinner /></div>;
  }

  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Quran', url: '/quran' },
    { label: node.surahNumber === 1 ? 'Al-Fatihah' : `Surah ${node.surahNumber}` },
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
