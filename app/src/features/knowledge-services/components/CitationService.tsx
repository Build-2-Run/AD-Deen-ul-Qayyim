import { useState } from 'react';
import { IconButton } from '../../../design/components/Button';
import { Icon } from '../../../design/icons/Icon';
import { ServiceComponentProps } from '../types';
import { useReader } from '../../reader/context/ReaderContext';
import { Stack } from '../../../design/primitives/Stack';
import { Flex } from '../../../design/primitives/Flex';

export function CitationService({ node }: ServiceComponentProps) {
  const { openPanel } = useReader();

  const handleCitation = () => {
    openPanel({
      title: 'Citation Manager',
      type: 'reference',
      content: <CitationManagerUI node={node} />
    });
  };

  return (
    <IconButton variant="ghost" title="Export Citation" onClick={handleCitation}>
      <Icon name="Quote" size={18} />
    </IconButton>
  );
}

function CitationManagerUI({ node }: { node: any }) {
  const [style, setStyle] = useState<'APA' | 'MLA' | 'Chicago' | 'Traditional'>('Traditional');

  const getCitationText = () => {
    switch (style) {
      case 'APA':
        return `${node.metadata.source || 'ADQ'}. (${new Date().getFullYear()}). ${node.title}. AD-Deen-ul-Qayyim.`;
      case 'MLA':
        return `"${node.title}." ${node.metadata.source || 'ADQ'}, ${new Date().getFullYear()}.`;
      case 'Chicago':
        return `${node.metadata.source || 'ADQ'}. "${node.title}." AD-Deen-ul-Qayyim, ${new Date().getFullYear()}.`;
      case 'Traditional':
      default:
        return `${node.title} [${node.subtitle || 'General'}]. From: ${node.metadata.source || 'ADQ'}.`;
    }
  };

  return (
    <Stack space={4}>
      <div className="flex bg-[var(--surface-elevated)] p-1 rounded-lg">
        {['Traditional', 'APA', 'MLA', 'Chicago'].map(s => (
          <button
            key={s}
            onClick={() => setStyle(s as any)}
            className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${style === s ? 'bg-[var(--surface)] shadow-sm text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="p-4 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg font-serif text-sm leading-relaxed text-[var(--text-primary)]">
        {getCitationText()}
      </div>

      <Flex justify="end">
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--primary)] hover:text-white hover:border-transparent transition-all">
          <Icon name="Copy" size={14} />
          Copy Citation
        </button>
      </Flex>
    </Stack>
  );
}
