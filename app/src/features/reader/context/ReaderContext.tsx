import { createContext, useContext, useState, ReactNode } from 'react';

interface KnowledgePanelData {
  title: string;
  type: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'lexicon' | 'biography' | 'reference';
  content: ReactNode;
}

interface ReaderContextValue {
  readingFocus: boolean;
  setReadingFocus: (focus: boolean) => void;
  panelData: KnowledgePanelData | null;
  setPanelData: (data: KnowledgePanelData | null) => void;
  openPanel: (data: KnowledgePanelData) => void;
  closePanel: () => void;
}

const ReaderContext = createContext<ReaderContextValue | undefined>(undefined);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [readingFocus, setReadingFocus] = useState(false);
  const [panelData, setPanelData] = useState<KnowledgePanelData | null>(null);

  const openPanel = (data: KnowledgePanelData) => {
    setPanelData(data);
  };

  const closePanel = () => {
    setPanelData(null);
  };

  return (
    <ReaderContext.Provider value={{
      readingFocus,
      setReadingFocus,
      panelData,
      setPanelData,
      openPanel,
      closePanel,
    }}>
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
}
