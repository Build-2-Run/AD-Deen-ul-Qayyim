import { ReactNode } from 'react';
import { PreferenceProvider } from './PreferenceProvider';
import { LocalizationProvider } from './LocalizationProvider';
import { ReaderProvider } from '../../features/reader/context/ReaderContext';
import { KnowledgePanel } from '../../features/reader/components/KnowledgePanel';
import { SharedErrorBoundary } from '../components/SharedErrorBoundary';

export function PlatformProvider({ children }: { children: ReactNode }) {
  return (
    <SharedErrorBoundary>
      <PreferenceProvider>
        <LocalizationProvider>
          <ReaderProvider>
            {children}
            <KnowledgePanel />
          </ReaderProvider>
        </LocalizationProvider>
      </PreferenceProvider>
    </SharedErrorBoundary>
  );
}

