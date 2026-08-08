import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../design/icons/Icon';
import { QuranBookmark, getBookmarks, toggleBookmark } from '../utils/bookmarks';

interface BookmarksDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function BookmarksDrawer({ open, onClose }: BookmarksDrawerProps) {
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);

  useEffect(() => {
    if (open) setBookmarks(getBookmarks());
  }, [open]);

  if (!open) return null;

  function handleRemove(b: QuranBookmark) {
    const next = toggleBookmark(b);
    setBookmarks(next);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full bg-[#0c1824] border-l border-white/10 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#f5c75d]">Bookmarked Verses</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <Icon name="X" size={20} />
          </button>
        </div>
        {bookmarks.length === 0 ? (
          <p className="text-white/50 text-sm">No bookmarks yet. Tap the star on any ayah to save it here.</p>
        ) : (
          <div className="space-y-3">
            {[...bookmarks]
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((b) => (
                <div key={`${b.surahNumber}:${b.ayahNumber}`} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <Link to={`/quran/${b.surahNumber}/read`} onClick={onClose} className="block mb-2">
                    <p className="font-arabic text-white text-right text-lg" style={{ fontFamily: "'Amiri', serif" }}>
                      {b.arabicPreview}
                    </p>
                    <p className="text-xs text-white/60 mt-1">{b.surahName} — {b.surahNumber}:{b.ayahNumber}</p>
                  </Link>
                  <button onClick={() => handleRemove(b)} className="text-xs text-red-300 hover:text-red-200">
                    Remove
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
