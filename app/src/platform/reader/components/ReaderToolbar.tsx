import React from 'react';
export interface ReaderToolbarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  visible: boolean;
  onClick: () => void;
}

export const ReaderToolbar: React.FC<{ children?: React.ReactNode, items?: ReaderToolbarItem[] }> = ({ children, items }) => (
  (children || items) ? (
    <div className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-10 gap-2">
      {items?.filter(i => i.visible).map(item => (
        <button
          key={item.id}
          disabled={!item.enabled}
          onClick={item.onClick}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center"
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
      {children}
    </div>
  ) : null
);
