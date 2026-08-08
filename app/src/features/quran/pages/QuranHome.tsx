import { useState, useMemo } from 'react';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body } from '../../../design/typography/BasicText';
import { KnowledgeCollection } from '../../knowledge/components/KnowledgeCollection';
import { useQuranList } from '../hooks/useQuran';
import { QuranAdapter } from '../adapters';
import { Icon } from '../../../design/icons/Icon';

export function QuranHome() {
  const [search, setSearch] = useState('');
  const { surahs, loading } = useQuranList();

  // Transform Surahs to KnowledgeNodes using Adapter
  const surahNodes = useMemo(() => {
    return surahs.map(s => QuranAdapter.toSurahNode(s));
  }, [surahs]);

  const filteredNodes = useMemo(() => {
    if (!search) return surahNodes;
    
    return surahNodes.filter(node => 
      node.title.toLowerCase().includes(search.toLowerCase()) || 
      node.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
      node.arabicText?.includes(search)
    );
  }, [surahNodes, search]);

  return (
    <PageContainer>
      <ContentContainer>
        <header className="mb-12">
          <Heading level={1} size="4xl" className="mb-4">The Noble Quran</Heading>
          <Body variant="secondary" className="max-w-2xl">
            Explore the divine revelation. Select a Surah to view its overview and begin reading.
          </Body>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search Surahs..." 
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[var(--text-secondary)]">Loading Quran...</div>
        ) : (
          <KnowledgeCollection nodes={filteredNodes} mode="grid" />
        )}
      </ContentContainer>
    </PageContainer>
  );
}
