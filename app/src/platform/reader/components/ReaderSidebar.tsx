import React from 'react';
import { useReader } from '../useReader';

export const ReaderSidebar: React.FC<{ children?: React.ReactNode, slot: 'left' | 'right' }> = ({ children, slot }) => {
  const { isSidebarOpen, activeSidebarSlot } = useReader();
  if (!isSidebarOpen || activeSidebarSlot !== slot || !children) return null;

  return (
    <aside className={`w-80 border-${slot === 'left' ? 'r' : 'l'} border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 h-full overflow-y-auto flex-shrink-0 z-20 shadow-xl`}>
      {children}
    </aside>
  );
};
