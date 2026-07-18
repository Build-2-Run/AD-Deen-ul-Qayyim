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
