import React from 'react';
export const ReaderHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  children ? <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 bg-white dark:bg-gray-950 z-10">{children}</header> : null
);
