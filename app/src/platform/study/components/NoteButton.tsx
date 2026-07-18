import React from 'react';
import { BookOpen } from 'lucide-react';
import { useReader } from '../../reader/useReader';

export const NoteButton: React.FC = () => {
  const { toggleSidebar } = useReader();

  return (
    <button
      onClick={() => toggleSidebar()} // Or a specific trigger to open the NotesPanel in the sidebar
      className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle Notes"
      title="Toggle Notes"
    >
      <BookOpen className="w-5 h-5" />
    </button>
  );
};
