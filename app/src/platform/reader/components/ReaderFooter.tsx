import React from 'react';
export const ReaderFooter: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  children ? <footer className="h-10 border-t border-gray-200 dark:border-gray-800 flex items-center px-4 text-sm text-gray-500 bg-white dark:bg-gray-950 z-10">{children}</footer> : null
);
