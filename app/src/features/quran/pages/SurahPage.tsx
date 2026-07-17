import { useEffect, useState } from 'react';
import { Bismillah } from '../components/Bismillah';
import { AyahViewer } from '../components/AyahViewer';
import { ReadingWorkspace } from '../../reader/components/ReadingWorkspace';
import { QuranService } from '../services/quran-service';
import type { QuranNode } from '../../../types/quran';
import { Spinner } from '../../../components/ui/Spinner';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

function SurahPageContent() {
  const [node, setNode] = useState<QuranNode | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchNode = async () => {
      try {
        const nodes = await QuranService.getQuranNodes();
        if (mounted && nodes.length > 0) {
          setNode(nodes[0]); // Using the sample node
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };
    fetchNode();
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

  // The sample data currently represents an Ayah, so we map it to an array for AyahViewer
  const ayahs = [
    { number: node.ayahNumber, arabic: node.arabicText, translation: node.translations?.[0]?.text || '' }
  ];

  return (
    <ReadingWorkspace 
      node={node}
      breadcrumbs={breadcrumbs}
      // Note: NodeHeader takes arabic/translation. We can omit it if AyahViewer renders it,
      // but to satisfy the layout request, we let ReadingWorkspace render the Title.
    >
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
