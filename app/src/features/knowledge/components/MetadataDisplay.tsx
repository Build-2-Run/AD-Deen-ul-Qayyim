import { Flex } from '../../../design/primitives/Flex';
import { Caption } from '../../../design/typography/BasicText';
import { KnowledgeMetadata } from '../types';

interface MetadataDisplayProps {
  metadata: KnowledgeMetadata;
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
  const formatAuthority = (auth: string) => auth.replace('_', ' ').toUpperCase();

  return (
    <Flex wrap="wrap" className="gap-2 mt-4">
      {metadata.authorityClass && (
        <div className="bg-[var(--surface-elevated)] border border-[var(--border)] px-2 py-1 rounded text-xs font-semibold text-[var(--text-secondary)] tracking-wider">
          {formatAuthority(metadata.authorityClass)}
        </div>
      )}
      {metadata.confidence && (
        <div className="bg-[var(--surface-elevated)] border border-[var(--border)] px-2 py-1 rounded text-xs font-semibold text-[var(--text-secondary)]">
          Confidence: {metadata.confidence.toUpperCase()}
        </div>
      )}
      {metadata.readingLevel && (
        <div className="bg-[var(--surface-elevated)] border border-[var(--border)] px-2 py-1 rounded text-xs font-semibold text-[var(--text-secondary)]">
          Level: {metadata.readingLevel}
        </div>
      )}
      {metadata.source && (
        <Caption className="text-[var(--text-secondary)] px-2 py-1">Source: {metadata.source}</Caption>
      )}
    </Flex>
  );
}
