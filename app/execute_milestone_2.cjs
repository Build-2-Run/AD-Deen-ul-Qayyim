const fs = require('fs');
const path = require('path');

const write = (relPath, content) => {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
};

const dirs = [
  'src/platform/reader/components',
  'src/platform/settings'
];
dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

// 1. Settings Model
write('src/platform/settings/ReaderSettings.ts', `
export interface ReaderPreferences {
  theme: 'light' | 'dark' | 'system' | 'sepia';
  arabicFont: string;
  translationFont: string;
  arabicSize: number;
  translationSize: number;
  lineHeight: number;
  pageWidth: 'narrow' | 'medium' | 'wide' | 'full';
  textAlignment: 'left' | 'center' | 'right' | 'justify';
  showTranslation: boolean;
  showTransliteration: boolean;
  showAyahNumbers: boolean;
  showWordByWord: boolean;
  autoScroll: boolean;
  keepScreenAwake: boolean;
}

export const defaultPreferences: ReaderPreferences = {
  theme: 'system',
  arabicFont: 'uthmani',
  translationFont: 'inter',
  arabicSize: 32,
  translationSize: 16,
  lineHeight: 1.8,
  pageWidth: 'medium',
  textAlignment: 'left',
  showTranslation: true,
  showTransliteration: false,
  showAyahNumbers: true,
  showWordByWord: false,
  autoScroll: false,
  keepScreenAwake: true
};
`);

// 2. Reader Context
write('src/platform/reader/ReaderContext.ts', `
import { createContext } from 'react';
import { ReaderPreferences, defaultPreferences } from '../settings/ReaderSettings';

export interface ReaderContextState {
  preferences: ReaderPreferences;
  updatePreferences: (updates: Partial<ReaderPreferences>) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  activeSidebarSlot: 'left' | 'right' | null;
  setActiveSidebarSlot: (slot: 'left' | 'right' | null) => void;
}

export const ReaderContext = createContext<ReaderContextState>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
  isSidebarOpen: false,
  toggleSidebar: () => {},
  activeSidebarSlot: null,
  setActiveSidebarSlot: () => {}
});
`);

// 3. useReader hook
write('src/platform/reader/useReader.ts', `
import { useContext } from 'react';
import { ReaderContext, ReaderContextState } from './ReaderContext';

export function useReader(): ReaderContextState {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
}
`);

// 4. Reader Provider
write('src/platform/reader/ReaderProvider.tsx', `
import React, { useState } from 'react';
import { ReaderContext } from './ReaderContext';
import { ReaderPreferences, defaultPreferences } from '../settings/ReaderSettings';

export const ReaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<ReaderPreferences>(() => {
    try {
      const saved = localStorage.getItem('reader_preferences');
      return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarSlot, setActiveSidebarSlot] = useState<'left' | 'right' | null>(null);

  const updatePreferences = (updates: Partial<ReaderPreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('reader_preferences', JSON.stringify(next));
      return next;
    });
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <ReaderContext.Provider value={{
      preferences,
      updatePreferences,
      isSidebarOpen,
      toggleSidebar,
      activeSidebarSlot,
      setActiveSidebarSlot
    }}>
      {children}
    </ReaderContext.Provider>
  );
};
`);

// 5. Reader Layout
write('src/platform/reader/ReaderLayout.tsx', `
import React from 'react';
import { ReaderProvider } from './ReaderProvider';
import { ReaderHeader } from './components/ReaderHeader';
import { ReaderToolbar } from './components/ReaderToolbar';
import { ReaderSidebar } from './components/ReaderSidebar';
import { ReaderFooter } from './components/ReaderFooter';
import { ReaderContent } from './components/ReaderContent';

interface ReaderLayoutProps {
  header?: React.ReactNode;
  toolbar?: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  bottomPanel?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const ReaderLayout: React.FC<ReaderLayoutProps> = (props) => {
  return (
    <ReaderProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
        {props.leftSidebar && <ReaderSidebar slot="left">{props.leftSidebar}</ReaderSidebar>}
        
        <div className="flex-1 flex flex-col min-w-0">
          <ReaderHeader>{props.header}</ReaderHeader>
          <ReaderToolbar>{props.toolbar}</ReaderToolbar>
          
          <ReaderContent>{props.children}</ReaderContent>
          
          <ReaderFooter>{props.footer}</ReaderFooter>
        </div>

        {props.rightSidebar && <ReaderSidebar slot="right">{props.rightSidebar}</ReaderSidebar>}
        {props.bottomPanel && <div className="absolute bottom-0 w-full z-20">{props.bottomPanel}</div>}
      </div>
    </ReaderProvider>
  );
};
`);

// 6. Reader Components
write('src/platform/reader/components/ReaderHeader.tsx', `
import React from 'react';
export const ReaderHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  children ? <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 bg-white dark:bg-gray-950 z-10">{children}</header> : null
);
`);

write('src/platform/reader/components/ReaderToolbar.tsx', `
import React from 'react';
export interface ReaderToolbarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  visible: boolean;
  onClick: () => void;
}

export const ReaderToolbar: React.FC<{ children?: React.ReactNode, items?: ReaderToolbarItem[] }> = ({ children, items }) => (
  (children || items) ? (
    <div className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-10 gap-2">
      {items?.filter(i => i.visible).map(item => (
        <button
          key={item.id}
          disabled={!item.enabled}
          onClick={item.onClick}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center"
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
      {children}
    </div>
  ) : null
);
`);

write('src/platform/reader/components/ReaderSidebar.tsx', `
import React from 'react';
import { useReader } from '../useReader';

export const ReaderSidebar: React.FC<{ children?: React.ReactNode, slot: 'left' | 'right' }> = ({ children, slot }) => {
  const { isSidebarOpen, activeSidebarSlot } = useReader();
  if (!isSidebarOpen || activeSidebarSlot !== slot || !children) return null;

  return (
    <aside className={\`w-80 border-\${slot === 'left' ? 'r' : 'l'} border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 h-full overflow-y-auto flex-shrink-0 z-20 shadow-xl\`}>
      {children}
    </aside>
  );
};
`);

write('src/platform/reader/components/ReaderFooter.tsx', `
import React from 'react';
export const ReaderFooter: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  children ? <footer className="h-10 border-t border-gray-200 dark:border-gray-800 flex items-center px-4 text-sm text-gray-500 bg-white dark:bg-gray-950 z-10">{children}</footer> : null
);
`);

write('src/platform/reader/components/ReaderContent.tsx', `
import React from 'react';
import { useReader } from '../useReader';

export const ReaderContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences } = useReader();
  
  const widthClass = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full'
  }[preferences.pageWidth];

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 relative">
      <div className={\`mx-auto \${widthClass} p-4 sm:p-8 lg:p-12 pb-32 transition-all duration-300\`}>
        {children}
      </div>
    </main>
  );
};
`);

console.log('Milestone 2 core scaffolded.');
