import { useReader } from '../context/ReaderContext';
import { Sheet, SheetContent } from '../../../design/components/Sheet';
import { Stack } from '../../../design/primitives/Stack';
import { Icon } from '../../../design/icons/Icon';
import { Caption } from '../../../design/typography/BasicText';
import { Flex } from '../../../design/primitives/Flex';

export function KnowledgePanel() {
  const { panelData, closePanel } = useReader();
  
  const isOpen = panelData !== null;
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'quran': return 'BookOpen';
      case 'fiqh': return 'Library';
      case 'tafsir': return 'BookOpen';
      case 'hadith': return 'Scroll';
      case 'lexicon': return 'Library';
      case 'biography': return 'User';
      case 'reference': return 'Link';
      default: return 'Info';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closePanel()}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto z-50 bg-[#0c1824] text-white border-l border-[#f5c75d]/30 shadow-2xl p-6 sm:p-8">
        {panelData && (
          <Stack space={6} className="mt-4">
            <Flex align="center" className="gap-2.5">
              <div className="bg-[#f5c75d]/10 border border-[#f5c75d]/30 p-2 rounded-xl text-[#f5c75d]">
                <Icon name={getIcon(panelData.type)} size={18} />
              </div>
              <Caption className="uppercase tracking-widest font-bold text-xs text-[#f5c75d]">
                {panelData.type}
              </Caption>
            </Flex>
            <div className="flex flex-col space-y-1.5">
              <h2 className="text-xl font-extrabold leading-tight tracking-tight text-[#f5c75d] md:text-2xl" style={{ textShadow: '0 0 12px rgba(245,199,93,0.3)' }}>{panelData.title}</h2>
            </div>
            <div className="pt-2 pb-8 text-white/90">
              {panelData.content}
            </div>
          </Stack>
        )}
      </SheetContent>
    </Sheet>
  );
}
