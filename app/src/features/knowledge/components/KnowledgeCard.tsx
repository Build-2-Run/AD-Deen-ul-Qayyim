import { KnowledgeNode } from '../types';
import { KnowledgeHeader } from './KnowledgeHeader';
import { MetadataDisplay } from './MetadataDisplay';
import { ActionBar } from './ActionBar';
import { CitationPreview } from './CitationPreview';
import { RelatedKnowledge } from './RelatedKnowledge';
import { KnowledgeExplorer } from './KnowledgeExplorer';
import { MarkdownBody } from './MarkdownBody';
import { Stack } from '../../../design/primitives/Stack';
import { ArabicText } from '../../../design/typography/ArabicText';
import { Body } from '../../../design/typography/BasicText';
import { Flex } from '../../../design/primitives/Flex';

interface KnowledgeCardProps {
  node: KnowledgeNode;
}

export function KnowledgeCard({ node }: KnowledgeCardProps) {
  // Adaptive Layout Logic based on Type
  const isBilingual = !!node.arabicText && !!node.primaryTranslation;

  return (
    <div
      className="rounded-2xl p-6 md:p-8 text-white shadow-2xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5"
      style={{
        background: 'radial-gradient(circle at 90% 10%, rgba(245, 199, 93, 0.15), transparent 55%), #0c1824',
        border: '1px solid rgba(245, 199, 93, 0.35)',
        borderLeft: '4px solid #f5c75d',
        boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
      }}
    >
      <div className="mb-6">
        <KnowledgeHeader
          title={node.title}
          subtitle={node.subtitle}
          breadcrumbs={node.breadcrumbs}
        />
      </div>

      <Stack space={6}>
        {/* Adaptive Content Area */}
        {isBilingual ? (
          <div className="flex flex-col gap-6">
            {node.arabicText && (
              <div className="text-right">
                <ArabicText size="2xl">{node.arabicText}</ArabicText>
              </div>
            )}
            {node.primaryTranslation && (
              <div className="text-left max-w-2xl border-l-2 border-[#f5c75d]/40 pl-4">
                <Body size="lg" className="leading-relaxed">{node.primaryTranslation}</Body>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl">
            <MarkdownBody content={node.body} />
          </div>
        )}

        {/* Citations (Inline Expansion) */}
        {node.citations && node.citations.length > 0 && (
          <Stack space={3} className="mt-4">
            {node.citations.map(citation => (
              <CitationPreview key={citation.id} citation={citation} />
            ))}
          </Stack>
        )}

        {/* Metadata (Quiet Presentation) */}
        <MetadataDisplay metadata={node.metadata} />
        
        {/* Related Nodes (Collapsed) */}
        {node.relatedNodes && (
          <RelatedKnowledge nodes={node.relatedNodes} />
        )}
      </Stack>

      {/* Bottom Footer: Standard Action Bar & Explore Deeply Button */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4 flex-wrap">
        <ActionBar node={node} />
        <KnowledgeExplorer node={node} />
      </div>
    </div>
  );
}
