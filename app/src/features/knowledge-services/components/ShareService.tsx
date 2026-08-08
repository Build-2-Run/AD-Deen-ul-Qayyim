import { IconButton } from '../../../design/components/Button';
import { Icon } from '../../../design/icons/Icon';
import { ServiceComponentProps } from '../types';
import { useReader } from '../../reader/context/ReaderContext';
import { Stack } from '../../../design/primitives/Stack';
import { Body, Caption } from '../../../design/typography/BasicText';

export function ShareService({ node }: ServiceComponentProps) {
  const { openPanel } = useReader();

  const handleShare = () => {
    openPanel({
      title: 'Share Knowledge',
      type: 'reference',
      content: (
        <Stack space={4}>
          <div className="p-4 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg">
            <Body className="font-medium mb-1">{node.title}</Body>
            <Caption className="text-[var(--text-secondary)]">{node.subtitle || 'AD-Deen-ul-Qayyim'}</Caption>
          </div>
          
          <Stack space={2}>
            <button className="w-full text-left p-3 hover:bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg flex items-center justify-between transition-colors">
              <span className="text-sm font-medium">Copy Reference</span>
              <Icon name="Copy" size={16} className="text-[var(--text-secondary)]" />
            </button>
            <button className="w-full text-left p-3 hover:bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg flex items-center justify-between transition-colors">
              <span className="text-sm font-medium">Copy Link</span>
              <Icon name="Link" size={16} className="text-[var(--text-secondary)]" />
            </button>
            <button className="w-full text-left p-3 hover:bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg flex items-center justify-between transition-colors">
              <span className="text-sm font-medium">Export Citation</span>
              <Icon name="Download" size={16} className="text-[var(--text-secondary)]" />
            </button>
          </Stack>
        </Stack>
      )
    });
  };

  return (
    <IconButton variant="ghost" title="Share" onClick={handleShare}>
      <Icon name="Share2" size={18} />
    </IconButton>
  );
}
