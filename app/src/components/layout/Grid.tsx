import React from 'react';

export function Grid({ children, cols = 1, mdCols = 2, lgCols = 3, gap = 6, className = '' }: { children: React.ReactNode, cols?: number, mdCols?: number, lgCols?: number, gap?: number, className?: string }) {
  return <div className={`grid grid-cols-${cols} md:grid-cols-${mdCols} lg:grid-cols-${lgCols} gap-${gap} ${className}`}>{children}</div>;
}
