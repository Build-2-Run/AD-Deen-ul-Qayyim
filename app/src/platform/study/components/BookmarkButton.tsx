import React, { useState, useEffect } from 'react';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { StudyService } from '../StudyService';

interface BookmarkButtonProps {
  nodeId: string;
  title: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ nodeId, title }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    let mounted = true;
    StudyService.getBookmarkByNode(nodeId).then(bm => {
      if (mounted) setIsBookmarked(!!bm);
    });

    const unsubCreated = StudyService.subscribe('BookmarkCreated', (e: any) => {
      if (mounted && e.payload.nodeId === nodeId) setIsBookmarked(true);
    });
    
    const unsubDeleted = StudyService.subscribe('BookmarkDeleted', () => {
      if (mounted) {
        StudyService.getBookmarkByNode(nodeId).then(bm => setIsBookmarked(!!bm));
      }
    });

    return () => {
      mounted = false;
      unsubCreated();
      unsubDeleted();
    };
  }, [nodeId]);

  const handleToggle = async () => {
    await StudyService.toggleBookmark(nodeId, title);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isBookmarked ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <BookmarkIcon className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  );
};
