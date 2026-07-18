import { useState, useEffect, useCallback } from 'react';
import { CacheProvider } from '../../../platform/cache/CacheProvider';

export interface ReadingProgress {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  lastOpened: number;
  percentage: number;
}

export interface Bookmark {
  id: string;
  type: 'Surah' | 'Ayah';
  title: string;
  timestamp: number;
  url: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  timestamp: number;
  url: string;
}

const STORAGE_KEY = 'adq_quran_experience';

export function useQuranExperience() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [activity, setActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const cache = CacheProvider.getInstance();
    if (cache.getSync) {
      const data = cache.getSync<any>(STORAGE_KEY);
      if (data) {
        setProgress(data.progress || null);
        setBookmarks(data.bookmarks || []);
        setActivity(data.activity || []);
      }
    }
  }, []);

  const saveState = useCallback((p: ReadingProgress | null, b: Bookmark[], a: RecentActivity[]) => {
    const cache = CacheProvider.getInstance();
    if (cache.setSync) {
      cache.setSync(STORAGE_KEY, { progress: p, bookmarks: b, activity: a });
    }
    setProgress(p);
    setBookmarks(b);
    setActivity(a);
  }, []);

  const updateProgress = useCallback((newProgress: ReadingProgress) => {
    saveState(newProgress, bookmarks, activity);
  }, [bookmarks, activity, saveState]);

  const addBookmark = useCallback((bookmark: Bookmark) => {
    const exists = bookmarks.find(b => b.id === bookmark.id);
    if (exists) return; // already bookmarked
    saveState(progress, [bookmark, ...bookmarks], activity);
  }, [progress, bookmarks, activity, saveState]);

  const removeBookmark = useCallback((id: string) => {
    saveState(progress, bookmarks.filter(b => b.id !== id), activity);
  }, [progress, bookmarks, activity, saveState]);

  const logActivity = useCallback((newActivity: Omit<RecentActivity, 'timestamp'>) => {
    const filtered = activity.filter(a => a.id !== newActivity.id);
    const updated = [{ ...newActivity, timestamp: Date.now() }, ...filtered].slice(0, 10); // Keep last 10
    saveState(progress, bookmarks, updated);
  }, [progress, bookmarks, activity, saveState]);

  return {
    progress,
    bookmarks,
    activity,
    updateProgress,
    addBookmark,
    removeBookmark,
    logActivity
  };
}
