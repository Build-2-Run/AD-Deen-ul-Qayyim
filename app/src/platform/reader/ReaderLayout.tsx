import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ReaderPreferences {
  version: number;
  arabicSize: number;
  translationSize: number;
  translationLanguage: string; // 'none', 'en-sahih', 'ur-jalandhry'
  theme: 'light' | 'dark';
  developerMode: boolean;
}

const DEFAULT_PREFS: ReaderPreferences = {
  version: 1,
  arabicSize: 32,
  translationSize: 18,
  translationLanguage: 'en-sahih',
  theme: 'light',
  developerMode: false
};

interface ReaderContextType {
  preferences: ReaderPreferences;
  updatePreferences: (partial: Partial<ReaderPreferences>) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ReaderContext = createContext<ReaderContextType | null>(null);

export const useReader = () => {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error("useReader must be within ReaderLayout");
  return ctx;
};

export interface ReaderLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  toolbar?: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export const ReaderLayout: React.FC<ReaderLayoutProps> = ({ children, header, toolbar, leftSidebar, rightSidebar }) => {
  const [preferences, setPreferences] = useState<ReaderPreferences>(() => {
    try {
      const stored = localStorage.getItem('reader_preferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === 1) return { ...DEFAULT_PREFS, ...parsed };
      }
    } catch (_e) {}
    return DEFAULT_PREFS;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('reader_preferences', JSON.stringify(preferences));
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences]);

  const updatePreferences = (partial: Partial<ReaderPreferences>) => {
    setPreferences(prev => ({ ...prev, ...partial }));
  };

  return (
    <ReaderContext.Provider value={{ preferences, updatePreferences, isSidebarOpen, toggleSidebar: () => setIsSidebarOpen(p => !p) }}>
      <div className={`flex flex-col h-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors`}>
        {/* Header Region */}
        {header && (
          <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 shrink-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
            {header}
          </header>
        )}

        {/* Toolbar Region */}
        {toolbar}

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Sidebar */}
          {leftSidebar && (
            <aside className="w-72 border-r border-gray-200 dark:border-gray-800 hidden md:block shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
              {leftSidebar}
            </aside>
          )}

          {/* Center Content */}
          <main className="flex-1 overflow-y-auto relative scroll-smooth" id="reader-content">
            <div className="max-w-3xl mx-auto py-12 px-4 md:px-8 pb-32">
              {children}
            </div>
          </main>

          {/* Right Sidebar */}
          {rightSidebar && (
            <aside className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-l border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900 overflow-hidden`}>
              <div className="w-80 h-full">{rightSidebar}</div>
            </aside>
          )}
        </div>
      </div>
    </ReaderContext.Provider>
  );
};
