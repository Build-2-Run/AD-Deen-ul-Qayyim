const fs = require('fs');
const path = require('path');

const PLATFORM_DIR = path.join(__dirname, 'src', 'platform');
const REGISTRY_DIR = path.join(PLATFORM_DIR, 'registry');
const SEARCH_DIR = path.join(PLATFORM_DIR, 'search');
const READER_DIR = path.join(PLATFORM_DIR, 'reader');
const READER_COMP_DIR = path.join(READER_DIR, 'components');
const QURAN_PAGES_DIR = path.join(__dirname, 'src', 'features', 'quran', 'pages');

// 1. DatasetRegistry.ts
const datasetRegistryCode = `export interface DatasetMetadata {
  id: string;
  version: string;
  source: string;
  compiledAt: string;
  language: string;
  surahs?: any[];
}

export class DatasetRegistry {
  private static metadataCache: DatasetMetadata | null = null;
  private static searchIndexCache: any[] | null = null;
  private static surahCache: Map<string, any> = new Map();
  private static translationCache: Map<string, any> = new Map();

  static async loadMetadata(): Promise<DatasetMetadata> {
    if (this.metadataCache) return this.metadataCache;
    const meta = (await import('../../../content/quran/compiled/metadata.json')).default;
    this.metadataCache = meta;
    return meta;
  }

  static async loadSurah(surahNumber: number): Promise<any> {
    const sNumStr = String(surahNumber).padStart(3, '0');
    if (this.surahCache.has(sNumStr)) return this.surahCache.get(sNumStr);
    
    // Dynamic import allows Vite to chunk each JSON file
    const surah = (await import(\`../../../content/quran/compiled/surahs/\${sNumStr}.json\`)).default;
    this.surahCache.set(sNumStr, surah);
    return surah;
  }

  static async loadTranslation(surahNumber: number, lang: string, author: string): Promise<any> {
    const sNumStr = String(surahNumber).padStart(3, '0');
    const key = \`\${lang}-\${author}-\${sNumStr}\`;
    if (this.translationCache.has(key)) return this.translationCache.get(key);
    
    const trans = (await import(\`../../../content/quran/compiled/translations/\${lang}/\${author}/\${sNumStr}.json\`)).default;
    this.translationCache.set(key, trans);
    return trans;
  }

  static async search(query: string): Promise<any[]> {
    if (!this.searchIndexCache) {
      this.searchIndexCache = (await import('../../../content/quran/compiled/search-index.json')).default;
    }
    const q = query.toLowerCase();
    return this.searchIndexCache!.filter((item: any) => 
      item.english?.toLowerCase().includes(q) || 
      item.urdu?.includes(q) || 
      item.arabic?.includes(q)
    );
  }
}
`;
fs.writeFileSync(path.join(REGISTRY_DIR, 'DatasetRegistry.ts'), datasetRegistryCode);

// 2. PlatformSearch.ts
const platformSearchCode = `import { DatasetRegistry } from '../registry/DatasetRegistry';
import { StudyService } from '../study/StudyService';

export interface SearchResult {
  id: string;
  title: string;
  type: 'node' | 'bookmark' | 'note' | 'collection';
  preview?: string;
}

export class PlatformSearch {
  static async search(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 3) return [];
    
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Notes
    const notes = await StudyService.searchNotes(lowerQuery);
    notes.forEach(note => {
      results.push({ id: note.id, title: note.title || 'Untitled Note', type: 'note', preview: note.content.substring(0, 100) + '...' });
    });

    // Search Bookmarks
    const bookmarks = await StudyService.searchBookmarks(lowerQuery);
    bookmarks.forEach(bm => {
      results.push({ id: bm.id, title: bm.title, type: 'bookmark' });
    });

    // Search Quran Index
    const nodes = await DatasetRegistry.search(lowerQuery);
    nodes.slice(0, 50).forEach((node: any) => { // limit to 50 results
      results.push({
        id: node.nodeId,
        title: \`Surah \${node.surah} Ayah \${node.ayah}\`,
        type: 'node',
        preview: node.english || node.arabic
      });
    });

    return results;
  }
}
`;
fs.writeFileSync(path.join(SEARCH_DIR, 'PlatformSearch.ts'), platformSearchCode);

// 3. ReaderSettingsPanel.tsx
const readerSettingsPanelCode = `import React from 'react';
import { Settings, X } from 'lucide-react';
import { useReader, ReaderPreferences } from '../ReaderLayout';

export const ReaderSettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { preferences, updatePreferences } = useReader();

  const handleSizeChange = (key: keyof ReaderPreferences, change: number) => {
    updatePreferences({ [key]: (preferences[key] as number) + change });
  };

  return (
    <div className="absolute top-14 right-4 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Reader Settings
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Arabic Size */}
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">Arabic Size</label>
          <div className="flex items-center justify-between">
            <button onClick={() => handleSizeChange('arabicSize', -2)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200">-</button>
            <span className="text-sm font-medium">{preferences.arabicSize}px</span>
            <button onClick={() => handleSizeChange('arabicSize', 2)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200">+</button>
          </div>
        </div>

        {/* Translation Size */}
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">Translation Size</label>
          <div className="flex items-center justify-between">
            <button onClick={() => handleSizeChange('translationSize', -2)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200">-</button>
            <span className="text-sm font-medium">{preferences.translationSize}px</span>
            <button onClick={() => handleSizeChange('translationSize', 2)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200">+</button>
          </div>
        </div>

        {/* Translation Toggle */}
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">Translations</label>
          <select 
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded text-sm p-2"
            value={preferences.translationLanguage}
            onChange={(e) => updatePreferences({ translationLanguage: e.target.value })}
          >
            <option value="none">None (Arabic Only)</option>
            <option value="en-sahih">English (Sahih International)</option>
            <option value="ur-jalandhry">Urdu (Jalandhry)</option>
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">Theme</label>
          <select 
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded text-sm p-2"
            value={preferences.theme}
            onChange={(e) => updatePreferences({ theme: e.target.value as any })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
};
`;
fs.writeFileSync(path.join(READER_COMP_DIR, 'ReaderSettingsPanel.tsx'), readerSettingsPanelCode);

// 4. ReaderNavigation.tsx
const readerNavigationCode = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ReaderNavigation: React.FC<{ currentSurah: number }> = ({ currentSurah }) => {
  const navigate = useNavigate();

  const handlePrev = () => {
    if (currentSurah > 1) navigate(\`/quran/surah/\${currentSurah - 1}\`);
  };

  const handleNext = () => {
    if (currentSurah < 114) navigate(\`/quran/surah/\${currentSurah + 1}\`);
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handlePrev} 
        disabled={currentSurah <= 1}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
        title="Previous Surah"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm font-medium w-16 text-center">
        {currentSurah} / 114
      </span>
      <button 
        onClick={handleNext} 
        disabled={currentSurah >= 114}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
        title="Next Surah"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
`;
fs.writeFileSync(path.join(READER_COMP_DIR, 'ReaderNavigation.tsx'), readerNavigationCode);

// 5. ReaderLayout.tsx (Modify to supply context)
const readerLayoutCode = `import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ReaderPreferences {
  version: number;
  arabicSize: number;
  translationSize: number;
  translationLanguage: string; // 'none', 'en-sahih', 'ur-jalandhry'
  theme: 'light' | 'dark';
}

const DEFAULT_PREFS: ReaderPreferences = {
  version: 1,
  arabicSize: 32,
  translationSize: 18,
  translationLanguage: 'en-sahih',
  theme: 'light'
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
    } catch (e) {}
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
      <div className={\`flex flex-col h-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors\`}>
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
            <aside className={\`\${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-l border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900 overflow-hidden\`}>
              <div className="w-80 h-full">{rightSidebar}</div>
            </aside>
          )}
        </div>
      </div>
    </ReaderContext.Provider>
  );
};
`;
fs.writeFileSync(path.join(READER_DIR, 'ReaderLayout.tsx'), readerLayoutCode);

// 6. SurahPage.tsx Refactoring
const surahPageCode = `import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Share2, Settings, Maximize } from 'lucide-react';

import { Bismillah } from '../components/Bismillah';
import { Spinner } from '../../../components/ui/Spinner';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import { useQuranExperience } from '../hooks/useQuranExperience';
import { DatasetRegistry, DatasetMetadata } from '../../../platform/registry/DatasetRegistry';

import { ReaderLayout, useReader } from '../../../platform/reader/ReaderLayout';
import { ReaderToolbar, ReaderToolbarItem } from '../../../platform/reader/components/ReaderToolbar';
import { ReaderSettingsPanel } from '../../../platform/reader/components/ReaderSettingsPanel';
import { ReaderNavigation } from '../../../platform/reader/components/ReaderNavigation';

import { BookmarkButton } from '../../../platform/study/components/BookmarkButton';
import { NoteButton } from '../../../platform/study/components/NoteButton';
import { NotesPanel } from '../../../platform/study/components/NotesPanel';
import { KnowledgeConnectionsPanel } from '../../../platform/relations/components/KnowledgeConnectionsPanel';

function SurahPageContent() {
  const { id } = useParams<{ id: string }>();
  const surahNumber = id ? parseInt(id, 10) : 1;
  
  const [baseSurah, setBaseSurah] = useState<any>(null);
  const [translationData, setTranslationData] = useState<any>(null);
  const [meta, setMeta] = useState<DatasetMetadata | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  const { updateProgress, logActivity } = useQuranExperience();
  const { preferences } = useReader();

  // Load Base Surah
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const metadata = await DatasetRegistry.loadMetadata();
        if (mounted) setMeta(metadata);

        const data = await DatasetRegistry.loadSurah(surahNumber);
        if (mounted) {
          setBaseSurah(data);
          updateProgress({
            surahNumber,
            surahName: data.englishName || data.name,
            ayahNumber: 1,
            lastOpened: Date.now(),
            percentage: 5
          });
          logActivity({
            id: \`quran-\${surahNumber}\`,
            title: data.englishName || data.name,
            url: \`/quran/surah/\${surahNumber}\`
          });
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Unknown error loading Surah'));
      }
    };
    load();
    return () => { mounted = false; };
  }, [surahNumber, updateProgress, logActivity]);

  // Lazy-Load Translation
  useEffect(() => {
    let mounted = true;
    const loadTrans = async () => {
      if (!preferences.translationLanguage || preferences.translationLanguage === 'none') {
        setTranslationData(null);
        return;
      }
      
      const [lang, author] = preferences.translationLanguage.split('-');
      try {
        const data = await DatasetRegistry.loadTranslation(surahNumber, lang, author);
        if (mounted) setTranslationData(data);
      } catch (err) {
        console.error("Failed to load translation", err);
      }
    };
    loadTrans();
    return () => { mounted = false; };
  }, [surahNumber, preferences.translationLanguage]);

  if (error) throw error;
  if (!baseSurah || !meta) return <div className="flex justify-center py-24"><Spinner /></div>;

  const nodeId = \`quran-\${surahNumber}\`;
  
  // Combine Arabic and Translation
  const ayahs = baseSurah.ayahs.map((a: any, idx: number) => ({
    number: a.number,
    arabic: a.arabic,
    translation: translationData ? translationData.ayahs[idx]?.text : undefined
  }));

  const toolbarItems: ReaderToolbarItem[] = [
    { id: 'copy', icon: <Copy className="w-5 h-5" />, label: 'Copy', enabled: true, visible: true, onClick: () => console.log('Copy') },
    { id: 'share', icon: <Share2 className="w-5 h-5" />, label: 'Share', enabled: true, visible: true, onClick: () => console.log('Share') },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings', enabled: true, visible: true, onClick: () => setShowSettings(!showSettings) },
    { id: 'fullscreen', icon: <Maximize className="w-5 h-5" />, label: 'Fullscreen', enabled: true, visible: true, onClick: () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(e => console.error(e));
      else document.exitFullscreen();
    } },
  ];

  const header = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center text-sm">
        <Link to="/" className="text-gray-500 hover:text-emerald-600 transition-colors">Home</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link to="/quran" className="text-gray-500 hover:text-emerald-600 transition-colors">Quran</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{baseSurah.englishName} ({baseSurah.name})</span>
      </div>
      <ReaderNavigation currentSurah={surahNumber} />
    </div>
  );

  const leftSidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h3 className="font-semibold text-lg mb-4">Surah Information</h3>
        <div className="space-y-3 text-sm">
          <div><span className="text-gray-500 block text-xs uppercase tracking-wider">Number</span><span className="font-medium">{surahNumber}</span></div>
          <div><span className="text-gray-500 block text-xs uppercase tracking-wider">Revelation</span><span className="font-medium">{baseSurah.revelationType}</span></div>
          <div><span className="text-gray-500 block text-xs uppercase tracking-wider">Total Ayahs</span><span className="font-medium">{baseSurah.numberOfAyahs}</span></div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <KnowledgeConnectionsPanel nodeId={nodeId} />
      </div>
    </div>
  );
  
  const rightSidebar = showNotes ? <NotesPanel nodeId={nodeId} onClose={() => setShowNotes(false)} /> : undefined;

  return (
    <>
      <ReaderLayout 
        header={header}
        toolbar={
          <ReaderToolbar items={toolbarItems}>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />
            <BookmarkButton nodeId={nodeId} title={baseSurah.englishName} />
            <div onClick={() => setShowNotes(!showNotes)}>
              <NoteButton />
            </div>
          </ReaderToolbar>
        }
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
      >
        <Bismillah />
        
        <div className="space-y-12 mt-8">
          {ayahs.map(ayah => (
            <div key={ayah.number} className="flex flex-col gap-6" id={\`ayah-\${ayah.number}\`}>
              <div 
                className="text-right font-arabic leading-loose text-gray-900 dark:text-gray-100" 
                style={{ fontSize: \`\${preferences.arabicSize}px\` }}
                dir="rtl"
              >
                {ayah.arabic} <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-sm ml-2">{ayah.number}</span>
              </div>
              {ayah.translation && (
                <div 
                  className="text-gray-600 dark:text-gray-300"
                  style={{ fontSize: \`\${preferences.translationSize}px\` }}
                  dir={preferences.translationLanguage.startsWith('ur') ? 'rtl' : 'ltr'}
                >
                  {ayah.translation}
                </div>
              )}
            </div>
          ))}
        </div>

      </ReaderLayout>
      {showSettings && <ReaderSettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
}

export function SurahPage() {
  // Render Provider around content to supply context
  return (
    <ErrorBoundary>
      <ReaderLayout>
        <SurahPageContent />
      </ReaderLayout>
    </ErrorBoundary>
  );
}
`;
fs.writeFileSync(path.join(QURAN_PAGES_DIR, 'SurahPage.tsx'), surahPageCode);

console.log('Milestone 5 UI Scaffold Complete.');
