import { useState, useCallback } from 'react';
import { ReadingSessionState } from '../types/reader';

export function useReadingSession() {
  const [session, setSession] = useState<ReadingSessionState>({
    fontSize: 2,
    readingMode: false,
    currentNodeId: null,
    bookmarks: [],
    scrollPosition: 0,
    isFullscreen: false,
  });

  const increaseFont = useCallback(() => {
    setSession(s => ({ ...s, fontSize: Math.min(s.fontSize + 1, 5) }));
  }, []);

  const decreaseFont = useCallback(() => {
    setSession(s => ({ ...s, fontSize: Math.max(s.fontSize - 1, 1) }));
  }, []);

  const toggleReadingMode = useCallback(() => {
    setSession(s => ({ ...s, readingMode: !s.readingMode }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setSession(s => ({ ...s, isFullscreen: !s.isFullscreen }));
  }, []);

  const toggleBookmark = useCallback((nodeId: string) => {
    setSession(s => {
      const isBookmarked = s.bookmarks.includes(nodeId);
      return {
        ...s,
        bookmarks: isBookmarked 
          ? s.bookmarks.filter(id => id !== nodeId)
          : [...s.bookmarks, nodeId]
      };
    });
  }, []);

  return {
    ...session,
    increaseFont,
    decreaseFont,
    toggleReadingMode,
    toggleFullscreen,
    toggleBookmark,
  };
}
