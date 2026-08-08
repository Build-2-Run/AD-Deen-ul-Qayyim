import { useReader } from '../context/ReaderContext';
import { cn } from '../../../utils/cn';

interface CitationProps {
  id: string;
  title: string;
  type?: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'lexicon' | 'biography' | 'reference';
  content: React.ReactNode;
  children: React.ReactNode;
}

export function Citation({ id, title, type = 'reference', content, children }: CitationProps) {
  const { openPanel, panelData } = useReader();
  
  const isActive = panelData?.title === title; // naive check for prototype

  return (
    <button
      id={id}
      onClick={() => openPanel({ title, type, content })}
      className={cn(
        "inline-flex items-baseline rounded transition-colors px-0.5 mx-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
        isActive 
          ? "bg-[var(--primary)] text-white" 
          : "text-[var(--primary)] hover:bg-[var(--primary)]/10"
      )}
      title={`Reference: ${title}`}
    >
      {children}
    </button>
  );
}
