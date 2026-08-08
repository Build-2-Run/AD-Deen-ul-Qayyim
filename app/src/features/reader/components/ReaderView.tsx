import { ReactNode } from 'react';
import { ReaderProvider, useReader } from '../context/ReaderContext';
import { ReaderContainer } from '../../../design/layout/Containers';
import { ReaderProgress } from './ReaderProgress';
import { KnowledgePanel } from './KnowledgePanel';
import { IconButton } from '../../../design/components/Button';
import { Icon } from '../../../design/icons/Icon';
import { cn } from '../../../utils/cn';

interface ReaderViewProps {
  children: ReactNode;
  title?: string;
}

function ReaderContent({ children, title }: ReaderViewProps) {
  const { readingFocus, setReadingFocus } = useReader();

  return (
    <div className={cn(
      "relative transition-all duration-500",
      readingFocus ? "bg-[var(--background)] min-h-screen z-40" : ""
    )}>
      {/* Optional Top Bar for Reader Focus Toggle */}
      <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-[var(--background)] to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          {title && !readingFocus && (
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{title}</h1>
          )}
        </div>
        <div className="pointer-events-auto">
          <IconButton 
            variant="ghost" 
            onClick={() => setReadingFocus(!readingFocus)}
            aria-label="Toggle Reading Focus"
            title="Toggle Reading Focus"
            className={cn(readingFocus && "text-[var(--primary)] bg-[var(--primary)]/10")}
          >
            <Icon name={readingFocus ? 'EyeOff' : 'Eye'} />
          </IconButton>
        </div>
      </div>

      <ReaderProgress />
      <ReaderContainer>
        {children}
      </ReaderContainer>
      <KnowledgePanel />
    </div>
  );
}

export function ReaderView(props: ReaderViewProps) {
  return (
    <ReaderProvider>
      <ReaderContent {...props} />
    </ReaderProvider>
  );
}
