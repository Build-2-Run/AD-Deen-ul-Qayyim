import { useState } from 'react';
import { RelatedNode } from '../types';
import { Flex } from '../../../design/primitives/Flex';
import { Stack } from '../../../design/primitives/Stack';
import { Icon } from '../../../design/icons/Icon';
import { Body, Caption } from '../../../design/typography/BasicText';

interface RelatedKnowledgeProps {
  nodes: RelatedNode[];
}

export function RelatedKnowledge({ nodes }: RelatedKnowledgeProps) {
  const [expanded, setExpanded] = useState(false);

  if (!nodes || nodes.length === 0) return null;

  return (
    <Stack space={2} className="mt-6">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded"
      >
        <Icon name={expanded ? 'ChevronDown' : 'ChevronRight'} size={16} />
        <Caption className="font-semibold uppercase tracking-wider">Related Knowledge ({nodes.length})</Caption>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6 border-l border-[var(--border)] ml-2">
          {nodes.map(node => (
            <div key={node.id} className="p-3 bg-[var(--surface-elevated)] rounded-lg hover:border-[var(--primary)] border border-transparent transition-all cursor-pointer group">
              <Stack space={1}>
                <Flex align="center" className="gap-2 text-[var(--text-secondary)]">
                  <Icon name="Network" size={14} />
                  <Caption className="text-xs uppercase font-medium">{node.relation.replace('_', ' ')}</Caption>
                </Flex>
                <Body className="font-medium group-hover:text-[var(--primary)] transition-colors">{node.title}</Body>
              </Stack>
            </div>
          ))}
        </div>
      )}
    </Stack>
  );
}
