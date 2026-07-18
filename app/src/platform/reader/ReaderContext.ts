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
