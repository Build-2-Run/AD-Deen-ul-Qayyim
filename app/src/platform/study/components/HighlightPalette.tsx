import React from 'react';

export const HighlightPalette: React.FC<{ onSelectColor: (color: string) => void }> = ({ onSelectColor }) => {
  const colors = [
    { name: 'Yellow', bg: 'bg-yellow-200 dark:bg-yellow-900' },
    { name: 'Green', bg: 'bg-green-200 dark:bg-green-900' },
    { name: 'Blue', bg: 'bg-blue-200 dark:bg-blue-900' },
    { name: 'Red', bg: 'bg-red-200 dark:bg-red-900' },
    { name: 'Purple', bg: 'bg-purple-200 dark:bg-purple-900' }
  ];

  return (
    <div className="flex space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
      {colors.map(c => (
        <button
          key={c.name}
          onClick={() => onSelectColor(c.name)}
          className={`w-6 h-6 rounded-full ${c.bg} hover:ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-gray-400 transition-all`}
          title={`Highlight ${c.name}`}
        />
      ))}
    </div>
  );
};
