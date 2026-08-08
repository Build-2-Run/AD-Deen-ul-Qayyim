import { ReactNode } from 'react';
import { Stack } from '../../../design/primitives/Stack';
import { Box } from '../../../design/primitives/Box';
import { cn } from '../../../utils/cn';
import { useReader } from '../context/ReaderContext';

interface ReaderBlockProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function ReaderBlock({ children, className, id }: ReaderBlockProps) {
  return (
    <Box id={id} className={cn("py-12 border-b border-[var(--border)] last:border-0 scroll-mt-20", className)}>
      <Stack space={8}>
        {children}
      </Stack>
    </Box>
  );
}

export function ReaderHeader({ children, className }: { children: ReactNode, className?: string }) {
  const { readingFocus } = useReader();
  if (readingFocus) return null; // Hide header in focus mode

  return (
    <header className={cn("flex items-center justify-between gap-4 mb-4", className)}>
      {children}
    </header>
  );
}

export function ReaderContent({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("reader-content prose prose-lg dark:prose-invert max-w-none", className)}>
      {children}
    </div>
  );
}

export function ReaderFooter({ children, className }: { children: ReactNode, className?: string }) {
  const { readingFocus } = useReader();
  if (readingFocus) return null; // Hide footer in focus mode

  return (
    <footer className={cn("flex items-center gap-4 mt-8 pt-4 border-t border-[var(--border)]/50", className)}>
      {children}
    </footer>
  );
}
