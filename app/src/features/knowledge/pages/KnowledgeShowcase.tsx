import { useState } from 'react';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption } from '../../../design/typography/BasicText';
import { Flex } from '../../../design/primitives/Flex';
import { mockNodes } from '../mock/data';
import { KnowledgeCollection } from '../components/KnowledgeCollection';
import { ReaderProvider } from '../../reader/context/ReaderContext';
import { KnowledgePanel } from '../../reader/components/KnowledgePanel';

export function KnowledgeShowcase() {
  const [viewMode, setViewMode] = useState<'comfortable-list' | 'grid' | 'compact-list'>('comfortable-list');

  return (
    <ReaderProvider>
      <PageContainer>
        <ContentContainer>
          <div className="mb-12 border-b border-[var(--border)] pb-8">
            <Heading level={1} size="3xl" className="mb-4">Knowledge Showcase</Heading>
            <Body variant="secondary" className="max-w-2xl mb-8">
              A presentation layer demonstration using mock data across diverse domains. 
              The layout adapts automatically to the node type (Quran, Hadith, Fiqh, etc.) while preserving 
              the ADQ interaction philosophy.
            </Body>

            <Flex align="center" className="gap-2 bg-[var(--surface-elevated)] p-1 rounded-lg inline-flex">
              <button 
                onClick={() => setViewMode('comfortable-list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'comfortable-list' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Comfortable List
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode('compact-list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'compact-list' ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Compact List
              </button>
            </Flex>
            <Caption className="block mt-2 text-[var(--text-secondary)] italic">
              Note: The parent page dictates the view mode contextually. These toggles are just for testing the showcase.
            </Caption>
          </div>

          <KnowledgeCollection nodes={mockNodes} mode={viewMode} />
          
          <KnowledgePanel />
        </ContentContainer>
      </PageContainer>
    </ReaderProvider>
  );
}
