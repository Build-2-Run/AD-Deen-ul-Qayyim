import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function KnowledgeSurface({ children, className = '', onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      className={`bg-surface backdrop-blur-md border border-border rounded-xl p-6 shadow-medium transition-all hover:bg-surface-elevated hover:shadow-glass hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
