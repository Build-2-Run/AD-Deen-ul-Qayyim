import { useState } from 'react';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption } from '../../../design/typography/BasicText';
import { Flex } from '../../../design/primitives/Flex';
import { useLibrary } from '../hooks/useLibrary';
import { mockNodes } from '../../knowledge/mock/data';
import { KnowledgeCollection } from '../../knowledge/components/KnowledgeCollection';
import { ReaderProvider } from '../../reader/context/ReaderContext';
import { KnowledgePanel } from '../../reader/components/KnowledgePanel';

export function PersonalLibrary() {
  const { bookmarks, history, getCollections, getNote } = useLibrary();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history' | 'collections' | 'notes'>('bookmarks');

  // Map IDs to actual node objects for rendering
  const getNodesByIds = (ids: string[]) => {
    return ids.map(id => mockNodes.find(n => n.id === id)).filter(Boolean) as any[];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bookmarks':
        return (
          <div className="mt-8">
            <KnowledgeCollection nodes={getNodesByIds(bookmarks)} mode="comfortable-list" />
          </div>
        );
      case 'history':
        return (
          <div className="mt-8">
            <KnowledgeCollection nodes={getNodesByIds(history)} mode="compact-list" />
          </div>
        );
      case 'collections':
        const collections = getCollections();
        return (
          <div className="mt-8 flex flex-col gap-12">
            {collections.map(c => (
              <div key={c.id}>
                <Caption className="uppercase tracking-widest font-semibold text-[var(--text-secondary)] mb-4 block">
                  {c.id.replace('-', ' ')} ({c.nodes.length})
                </Caption>
                <KnowledgeCollection nodes={getNodesByIds(c.nodes)} mode="grid" />
              </div>
            ))}
          </div>
        );
      case 'notes':
        const notesNodes = mockNodes.filter(n => getNote(n.id));
        return (
          <div className="mt-8 flex flex-col gap-8">
            {notesNodes.length === 0 ? (
              <div className="py-12 text-center text-[var(--text-secondary)]">No notes yet.</div>
            ) : (
              notesNodes.map(n => (
                <div key={n.id} className="p-6 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl">
                  <Heading level={3} size="lg" className="mb-2">{n.title}</Heading>
                  <div className="p-4 bg-[var(--surface)] border border-[var(--border)]/50 rounded-lg">
                    <Body className="text-[var(--text-primary)] italic whitespace-pre-wrap">{getNote(n.id)}</Body>
                  </div>
                </div>
              ))
            )}
          </div>
        );
    }
  };

  return (
    <ReaderProvider>
      <PageContainer>
        <ContentContainer>
          <div className="mb-12 border-b border-[var(--border)] pb-8">
            <Heading level={1} size="3xl" className="mb-4">Personal Library</Heading>
            <Body variant="secondary" className="max-w-2xl mb-8">
              Your centralized hub for saved knowledge. This demonstrates the Universal Knowledge Services layer operating independently of any specific dataset.
            </Body>

            <Flex align="center" className="gap-2 bg-[var(--surface-elevated)] p-1 rounded-lg inline-flex overflow-x-auto">
              {(['bookmarks', 'history', 'collections', 'notes'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  {tab}
                </button>
              ))}
            </Flex>
          </div>

          {renderContent()}

          <KnowledgePanel />
        </ContentContainer>
      </PageContainer>
    </ReaderProvider>
  );
}
