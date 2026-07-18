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
      <div className={`mx-auto ${widthClass} p-4 sm:p-8 lg:p-12 pb-32 transition-all duration-300`}>
        {children}
      </div>
    </main>
  );
};
