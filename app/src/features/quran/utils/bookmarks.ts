export interface QuranBookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicPreview: string;
  timestamp: number;
}

const KEY = 'adq-quran-bookmarks';

export function getBookmarks(): QuranBookmark[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QuranBookmark[];
  } catch {
    return [];
  }
}

export function isBookmarked(surahNumber: number, ayahNumber: number): boolean {
  return getBookmarks().some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
}

export function toggleBookmark(bookmark: Omit<QuranBookmark, 'timestamp'>): QuranBookmark[] {
  const existing = getBookmarks();
  const idx = existing.findIndex((b) => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber);
  const next = idx >= 0
    ? existing.filter((_, i) => i !== idx)
    : [...existing, { ...bookmark, timestamp: Date.now() }];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
