import { useContext } from 'react';
import { ReaderContext, ReaderContextState } from './ReaderContext';

export function useReader(): ReaderContextState {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
}
