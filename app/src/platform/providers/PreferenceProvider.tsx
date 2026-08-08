import { createContext, ReactNode, useContext } from 'react';

// Stub for now. Will be expanded when real preferences are implemented.
interface PreferenceContextType {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
}

const defaultPreferences: PreferenceContextType = {
  theme: 'system',
  fontSize: 'base'
};

const PreferenceContext = createContext<PreferenceContextType>(defaultPreferences);

export function PreferenceProvider({ children }: { children: ReactNode }) {
  return (
    <PreferenceContext.Provider value={defaultPreferences}>
      {children}
    </PreferenceContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferenceContext);
}
