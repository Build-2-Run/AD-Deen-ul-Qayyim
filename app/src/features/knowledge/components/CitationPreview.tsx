import { useState } from 'react';
import { Citation } from '../types';
import { Flex } from '../../../design/primitives/Flex';
import { Stack } from '../../../design/primitives/Stack';
import { Icon } from '../../../design/icons/Icon';
import { Body, Caption } from '../../../design/typography/BasicText';


interface CitationPreviewProps {
  citation: Citation;
}

export function CitationPreview({ citation }: CitationPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--surface)]">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 hover:bg-[var(--surface-elevated)] transition-colors flex items-center justify-between outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
      >
        <Flex align="center" className="gap-3">
          <Icon name="Link" size={16} className="text-[var(--text-secondary)]" />
          <Caption className="font-semibold">{citation.source} <span className="text-[var(--text-secondary)] font-normal">{citation.reference}</span></Caption>
        </Flex>
        <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-[var(--text-secondary)]" />
      </button>
      
      {expanded && (
        <div className="p-4 pt-2 border-t border-[var(--border)]/50 bg-[var(--surface-elevated)]">
          <Stack space={2}>
            <Body className="text-[var(--text-secondary)] italic leading-relaxed text-sm border-l-2 border-[var(--primary)] pl-3">
              "{citation.preview}"
            </Body>
            <Flex justify="end">
              <button className="text-xs text-[var(--primary)] hover:underline font-semibold flex items-center gap-1 mt-1">
                Explore Source <Icon name="ArrowRight" size={12} />
              </button>
            </Flex>
          </Stack>
        </div>
      )}
    </div>
  );
}
