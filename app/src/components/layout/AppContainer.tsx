import React from 'react';

export function AppContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`min-h-screen bg-background text-tx-primary transition-colors duration-300 ${className}`}>{children}</div>;
}
