import React, { useState } from 'react';
import { ReaderContext } from './ReaderContext';
import { ReaderPreferences, defaultPreferences } from '../settings/ReaderSettings';
import { CacheProvider } from '../cache/CacheProvider';

export const ReaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<ReaderPreferences>(() => {
    try {
      const cache = CacheProvider.getInstance();
      if (cache.getSync) {
        const saved = cache.getSync<ReaderPreferences>('reader_preferences');
        return saved ? { ...defaultPreferences, ...saved } : defaultPreferences;
      }
      return defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarSlot, setActiveSidebarSlot] = useState<'left' | 'right' | null>(null);

  const updatePreferences = (updates: Partial<ReaderPreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...updates };
      const cache = CacheProvider.getInstance();
      if (cache.setSync) {
        cache.setSync('reader_preferences', next);
      }
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
