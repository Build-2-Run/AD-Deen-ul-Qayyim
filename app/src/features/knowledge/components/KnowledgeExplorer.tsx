import { useReader } from '../../reader/context/ReaderContext';
import { KnowledgeNode } from '../types';
import { Flex } from '../../../design/primitives/Flex';
import { Stack } from '../../../design/primitives/Stack';
import { Icon } from '../../../design/icons/Icon';
import { Body, Caption } from '../../../design/typography/BasicText';

interface KnowledgeExplorerProps {
  node: KnowledgeNode;
}

export function KnowledgeExplorer({ node }: KnowledgeExplorerProps) {
  const { openPanel } = useReader();

  const handleExplore = () => {
    // Opens in the KnowledgePanel (side sheet / bottom sheet) via ReaderContext
    openPanel({
      title: `Exploring: ${node.title}`,
      type: node.type as any, // Type mapping applies
      content: (
        <Stack space={4}>
          <Body className="text-[var(--text-secondary)]">
            This panel demonstrates the contextual exploration flow. Selecting related concepts here would push further into the stack, replacing or layering this content, while preserving the main reading view behind it.
          </Body>
          <div className="p-4 border border-[var(--border)] bg-[var(--surface-elevated)] rounded-xl">
            <Stack space={3}>
              <Caption className="uppercase font-bold tracking-widest text-[var(--primary)]">Exploration Tree</Caption>
              <Flex align="center" className="gap-2">
                <Icon name="BookOpen" size={14} className="text-[var(--text-secondary)]" />
                <Body>{node.title}</Body>
              </Flex>
              <div className="ml-2 pl-4 border-l border-[var(--border)]">
                <Flex align="center" className="gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] cursor-pointer">
                  <Icon name="CornerDownRight" size={14} />
                  <Body>Related Hadith</Body>
                </Flex>
              </div>
            </Stack>
          </div>
        </Stack>
      )
    });
  };

  return (
    <button
      onClick={handleExplore}
      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f5c75d]/10 text-[#f5c75d] border border-[#f5c75d]/30 hover:bg-[#f5c75d] hover:text-[#0c1824] transition-all rounded-full text-xs font-bold whitespace-nowrap shrink-0 flex-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#f5c75d]"
    >
      <Icon name="Compass" size={14} />
      Explore Deeply
    </button>
  );
}
