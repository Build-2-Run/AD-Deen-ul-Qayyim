import { createContext, ReactNode, useContext } from 'react';

// Stub for Localization.
interface LocalizationContextType {
  locale: string;
  t: (key: string) => string;
}

const defaultLocalization: LocalizationContextType = {
  locale: 'en',
  t: (key: string) => key // simple passthrough for now
};

const LocalizationContext = createContext<LocalizationContextType>(defaultLocalization);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  return (
    <LocalizationContext.Provider value={defaultLocalization}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  return useContext(LocalizationContext);
}
