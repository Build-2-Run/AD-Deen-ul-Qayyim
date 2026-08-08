import { useEffect, useState } from 'react';
import { Icon } from '../../../design/icons/Icon';
import { isBookmarked, toggleBookmark } from '../utils/bookmarks';

interface BookmarkButtonProps {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicPreview: string;
}

export function BookmarkButton({ surahNumber, surahName, ayahNumber, arabicPreview }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(surahNumber, ayahNumber));
  }, [surahNumber, ayahNumber]);

  function handleClick() {
    toggleBookmark({ surahNumber, surahName, ayahNumber, arabicPreview });
    setBookmarked((b) => !b);
  }

  return (
    <button
      onClick={handleClick}
      aria-pressed={bookmarked}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
        bookmarked ? 'text-[#f5c75d]' : 'text-white/50 hover:text-white'
      }`}
    >
      <Icon name="Star" size={16} />
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}
