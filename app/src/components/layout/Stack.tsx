import React from 'react';

export function Stack({ children, spacing = 4, className = '' }: { children: React.ReactNode, spacing?: number, className?: string }) {
  return <div className={`flex flex-col gap-${spacing} ${className}`}>{children}</div>;
}
