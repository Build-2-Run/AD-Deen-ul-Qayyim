import { useState, useCallback } from 'react';


// Mock state singleton for simplicity across components without a top-level provider
// In a real app, this would be Redux, Zustand, or a React Context.
const mockState = {
  bookmarks: new Set<string>(),
  notes: new Map<string, string>(), // nodeId -> note content
  collections: new Map<string, string[]>([ // collectionId -> nodeId[]
    ['favorites', []],
    ['study-list', []]
  ]),
  history: [] as string[] // nodeId[]
};

export function useLibrary() {
  // We use a simple trigger to force re-renders in components consuming this hook
  const [, setTrigger] = useState(0);

  const toggleBookmark = useCallback((nodeId: string) => {
    if (mockState.bookmarks.has(nodeId)) {
      mockState.bookmarks.delete(nodeId);
    } else {
      mockState.bookmarks.add(nodeId);
    }
    setTrigger(prev => prev + 1);
  }, []);

  const isBookmarked = useCallback((nodeId: string) => {
    return mockState.bookmarks.has(nodeId);
  }, []);

  const saveNote = useCallback((nodeId: string, content: string) => {
    if (content.trim() === '') {
      mockState.notes.delete(nodeId);
    } else {
      mockState.notes.set(nodeId, content);
    }
    setTrigger(prev => prev + 1);
  }, []);

  const getNote = useCallback((nodeId: string) => {
    return mockState.notes.get(nodeId);
  }, []);

  const addToHistory = useCallback((nodeId: string) => {
    mockState.history = [nodeId, ...mockState.history.filter(id => id !== nodeId)].slice(0, 50);
    setTrigger(prev => prev + 1);
  }, []);

  const getCollections = useCallback(() => {
    return Array.from(mockState.collections.entries()).map(([id, nodes]) => ({ id, nodes }));
  }, []);

  const toggleInCollection = useCallback((collectionId: string, nodeId: string) => {
    const list = mockState.collections.get(collectionId) || [];
    if (list.includes(nodeId)) {
      mockState.collections.set(collectionId, list.filter(id => id !== nodeId));
    } else {
      mockState.collections.set(collectionId, [...list, nodeId]);
    }
    setTrigger(prev => prev + 1);
  }, []);

  const isInCollection = useCallback((collectionId: string, nodeId: string) => {
    const list = mockState.collections.get(collectionId) || [];
    return list.includes(nodeId);
  }, []);

  const createCollection = useCallback((name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (!mockState.collections.has(id)) {
      mockState.collections.set(id, []);
      setTrigger(prev => prev + 1);
    }
  }, []);

  return {
    bookmarks: Array.from(mockState.bookmarks),
    history: mockState.history,
    toggleBookmark,
    isBookmarked,
    saveNote,
    getNote,
    addToHistory,
    getCollections,
    toggleInCollection,
    isInCollection,
    createCollection
  };
}
