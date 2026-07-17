import React from 'react';

export function Section({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <section className={`py-12 md:py-24 px-4 max-w-7xl mx-auto ${className}`}>{children}</section>;
}
