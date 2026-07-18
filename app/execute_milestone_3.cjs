const fs = require('fs');
const path = require('path');

const write = (relPath, content) => {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
};

// 1. EventBus
write('src/platform/events/EventBus.ts', `
type EventHandler<T = any> = (payload: T) => void;

export type PlatformEventType = 
  | 'BookmarkCreated' | 'BookmarkDeleted'
  | 'NoteCreated' | 'NoteUpdated' | 'NoteDeleted'
  | 'HighlightCreated' | 'HighlightDeleted'
  | 'CollectionCreated' | 'CollectionDeleted'
  | 'ReadingStarted' | 'ReadingFinished'
  | 'ReaderPreferenceChanged' | 'TranslationChanged';

export interface PlatformEvent<T = any> {
  type: PlatformEventType;
  payload: T;
  timestamp: number;
}

class EventBusService {
  private listeners: Map<PlatformEventType, Set<EventHandler>> = new Map();

  subscribe<T>(type: PlatformEventType, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);
    return () => this.listeners.get(type)?.delete(handler);
  }

  publish<T>(type: PlatformEventType, payload: T): void {
    const event: PlatformEvent<T> = { type, payload, timestamp: Date.now() };
    console.debug(\`[EventBus] \${type}\`, payload);
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (e) {
          console.error(\`[EventBus] Error in handler for \${type}:\`, e);
        }
      });
    }
  }
}

export const EventBus = new EventBusService();
`);

// 2. Study Engines
write('src/platform/study/engines/BookmarkEngine.ts', `
import { CacheProvider } from '../../cache/CacheProvider';
import { EventBus } from '../../events/EventBus';

export interface Bookmark {
  id: string;
  nodeId: string;
  datasetId?: string;
  module?: string;
  location?: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  folder?: string;
  tags?: string[];
}

export class BookmarkEngine {
  private static CACHE_KEY = 'platform_bookmarks';

  static async listBookmarks(): Promise<Bookmark[]> {
    const cache = CacheProvider.getInstance();
    const data = await cache.get<Bookmark[]>(this.CACHE_KEY);
    return data || [];
  }

  static async getBookmark(id: string): Promise<Bookmark | null> {
    const bookmarks = await this.listBookmarks();
    return bookmarks.find(b => b.id === id) || null;
  }

  static async getBookmarkByNode(nodeId: string): Promise<Bookmark | null> {
    const bookmarks = await this.listBookmarks();
    return bookmarks.find(b => b.nodeId === nodeId) || null;
  }

  static async addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bookmark> {
    const bookmarks = await this.listBookmarks();
    const newBookmark: Bookmark = {
      ...bookmark,
      id: \`bm_\${Date.now()}_\${Math.random().toString(36).substring(2,9)}\`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    bookmarks.push(newBookmark);
    await CacheProvider.getInstance().set(this.CACHE_KEY, bookmarks);
    EventBus.publish('BookmarkCreated', newBookmark);
    return newBookmark;
  }

  static async removeBookmark(id: string): Promise<void> {
    const bookmarks = await this.listBookmarks();
    const filtered = bookmarks.filter(b => b.id !== id);
    if (filtered.length !== bookmarks.length) {
      await CacheProvider.getInstance().set(this.CACHE_KEY, filtered);
      EventBus.publish('BookmarkDeleted', { id });
    }
  }

  static async toggleBookmark(nodeId: string, title: string): Promise<boolean> {
    const existing = await this.getBookmarkByNode(nodeId);
    if (existing) {
      await this.removeBookmark(existing.id);
      return false; // Not bookmarked anymore
    } else {
      await this.addBookmark({ nodeId, title });
      return true; // Is bookmarked now
    }
  }

  static async searchBookmarks(query: string): Promise<Bookmark[]> {
    const bookmarks = await this.listBookmarks();
    const lowerQuery = query.toLowerCase();
    return bookmarks.filter(b => 
      b.title.toLowerCase().includes(lowerQuery) || 
      b.tags?.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }
}
`);

write('src/platform/study/engines/NotesEngine.ts', `
import { CacheProvider } from '../../cache/CacheProvider';
import { EventBus } from '../../events/EventBus';

export interface ReadingNote {
  id: string;
  nodeId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export class NotesEngine {
  private static CACHE_KEY = 'platform_notes';

  static async listNotes(): Promise<ReadingNote[]> {
    const data = await CacheProvider.getInstance().get<ReadingNote[]>(this.CACHE_KEY);
    return data || [];
  }

  static async getNote(id: string): Promise<ReadingNote | null> {
    const notes = await this.listNotes();
    return notes.find(n => n.id === id) || null;
  }

  static async getNotesByNode(nodeId: string): Promise<ReadingNote[]> {
    const notes = await this.listNotes();
    return notes.filter(n => n.nodeId === nodeId);
  }

  static async createNote(note: Omit<ReadingNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReadingNote> {
    const notes = await this.listNotes();
    const newNote: ReadingNote = {
      ...note,
      id: \`note_\${Date.now()}_\${Math.random().toString(36).substring(2,9)}\`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    notes.push(newNote);
    await CacheProvider.getInstance().set(this.CACHE_KEY, notes);
    EventBus.publish('NoteCreated', newNote);
    return newNote;
  }

  static async updateNote(id: string, updates: Partial<Omit<ReadingNote, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ReadingNote | null> {
    const notes = await this.listNotes();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return null;

    const updatedNote = { ...notes[idx], ...updates, updatedAt: Date.now() };
    notes[idx] = updatedNote;
    await CacheProvider.getInstance().set(this.CACHE_KEY, notes);
    EventBus.publish('NoteUpdated', updatedNote);
    return updatedNote;
  }

  static async deleteNote(id: string): Promise<void> {
    const notes = await this.listNotes();
    const filtered = notes.filter(n => n.id !== id);
    if (filtered.length !== notes.length) {
      await CacheProvider.getInstance().set(this.CACHE_KEY, filtered);
      EventBus.publish('NoteDeleted', { id });
    }
  }

  static async searchNotes(query: string): Promise<ReadingNote[]> {
    const notes = await this.listNotes();
    const lowerQuery = query.toLowerCase();
    return notes.filter(n => 
      n.title.toLowerCase().includes(lowerQuery) || 
      n.content.toLowerCase().includes(lowerQuery) ||
      n.tags?.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }
}
`);

write('src/platform/study/engines/HighlightsEngine.ts', `
import { CacheProvider } from '../../cache/CacheProvider';
import { EventBus } from '../../events/EventBus';

export type HighlightColor = 'Yellow' | 'Green' | 'Blue' | 'Red' | 'Purple';

export interface Highlight {
  id: string;
  nodeId: string;
  ayahNumber?: number;
  selectedText: string;
  color: HighlightColor;
  createdAt: number;
}

export class HighlightsEngine {
  private static CACHE_KEY = 'platform_highlights';

  static async listHighlights(): Promise<Highlight[]> {
    const data = await CacheProvider.getInstance().get<Highlight[]>(this.CACHE_KEY);
    return data || [];
  }

  static async getHighlightsByNode(nodeId: string): Promise<Highlight[]> {
    const highlights = await this.listHighlights();
    return highlights.filter(h => h.nodeId === nodeId);
  }

  static async addHighlight(highlight: Omit<Highlight, 'id' | 'createdAt'>): Promise<Highlight> {
    const highlights = await this.listHighlights();
    const newHighlight: Highlight = {
      ...highlight,
      id: \`hl_\${Date.now()}_\${Math.random().toString(36).substring(2,9)}\`,
      createdAt: Date.now()
    };
    highlights.push(newHighlight);
    await CacheProvider.getInstance().set(this.CACHE_KEY, highlights);
    EventBus.publish('HighlightCreated', newHighlight);
    return newHighlight;
  }

  static async removeHighlight(id: string): Promise<void> {
    const highlights = await this.listHighlights();
    const filtered = highlights.filter(h => h.id !== id);
    if (filtered.length !== highlights.length) {
      await CacheProvider.getInstance().set(this.CACHE_KEY, filtered);
      EventBus.publish('HighlightDeleted', { id });
    }
  }
}
`);

write('src/platform/study/engines/CollectionsEngine.ts', `
import { CacheProvider } from '../../cache/CacheProvider';
import { EventBus } from '../../events/EventBus';

export interface CollectionItem {
  id: string;
  type: 'bookmark' | 'note' | 'highlight' | 'node';
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  items: CollectionItem[];
  createdAt: number;
}

export class CollectionsEngine {
  private static CACHE_KEY = 'platform_collections';

  static async listCollections(): Promise<Collection[]> {
    const data = await CacheProvider.getInstance().get<Collection[]>(this.CACHE_KEY);
    return data || [];
  }

  static async getCollection(id: string): Promise<Collection | null> {
    const collections = await this.listCollections();
    return collections.find(c => c.id === id) || null;
  }

  static async createCollection(collection: Omit<Collection, 'id' | 'items' | 'createdAt'>): Promise<Collection> {
    const collections = await this.listCollections();
    const newCollection: Collection = {
      ...collection,
      id: \`col_\${Date.now()}_\${Math.random().toString(36).substring(2,9)}\`,
      items: [],
      createdAt: Date.now()
    };
    collections.push(newCollection);
    await CacheProvider.getInstance().set(this.CACHE_KEY, collections);
    EventBus.publish('CollectionCreated', newCollection);
    return newCollection;
  }

  static async addItem(collectionId: string, item: CollectionItem): Promise<void> {
    const collections = await this.listCollections();
    const idx = collections.findIndex(c => c.id === collectionId);
    if (idx !== -1) {
      if (!collections[idx].items.some(i => i.id === item.id && i.type === item.type)) {
        collections[idx].items.push(item);
        await CacheProvider.getInstance().set(this.CACHE_KEY, collections);
      }
    }
  }

  static async removeItem(collectionId: string, itemId: string, itemType: string): Promise<void> {
    const collections = await this.listCollections();
    const idx = collections.findIndex(c => c.id === collectionId);
    if (idx !== -1) {
      collections[idx].items = collections[idx].items.filter(i => !(i.id === itemId && i.type === itemType));
      await CacheProvider.getInstance().set(this.CACHE_KEY, collections);
    }
  }

  static async deleteCollection(id: string): Promise<void> {
    const collections = await this.listCollections();
    const filtered = collections.filter(c => c.id !== id);
    if (filtered.length !== collections.length) {
      await CacheProvider.getInstance().set(this.CACHE_KEY, filtered);
      EventBus.publish('CollectionDeleted', { id });
    }
  }
}
`);

// 3. Study Service Façade
write('src/platform/study/StudyService.ts', `
import { BookmarkEngine, Bookmark } from './engines/BookmarkEngine';
import { NotesEngine, ReadingNote } from './engines/NotesEngine';
import { HighlightsEngine, Highlight, HighlightColor } from './engines/HighlightsEngine';
import { CollectionsEngine, Collection, CollectionItem } from './engines/CollectionsEngine';
import { EventBus } from '../events/EventBus';

export class StudyService {
  // EventBus Exposer for UI Subscriptions
  static subscribe = EventBus.subscribe.bind(EventBus);

  // Bookmarks
  static getBookmarkByNode = BookmarkEngine.getBookmarkByNode.bind(BookmarkEngine);
  static listBookmarks = BookmarkEngine.listBookmarks.bind(BookmarkEngine);
  static toggleBookmark = BookmarkEngine.toggleBookmark.bind(BookmarkEngine);
  static searchBookmarks = BookmarkEngine.searchBookmarks.bind(BookmarkEngine);

  // Notes
  static listNotes = NotesEngine.listNotes.bind(NotesEngine);
  static getNotesByNode = NotesEngine.getNotesByNode.bind(NotesEngine);
  static createNote = NotesEngine.createNote.bind(NotesEngine);
  static updateNote = NotesEngine.updateNote.bind(NotesEngine);
  static deleteNote = NotesEngine.deleteNote.bind(NotesEngine);
  static searchNotes = NotesEngine.searchNotes.bind(NotesEngine);

  // Highlights
  static getHighlightsByNode = HighlightsEngine.getHighlightsByNode.bind(HighlightsEngine);
  static addHighlight = HighlightsEngine.addHighlight.bind(HighlightsEngine);
  static removeHighlight = HighlightsEngine.removeHighlight.bind(HighlightsEngine);

  // Collections
  static listCollections = CollectionsEngine.listCollections.bind(CollectionsEngine);
  static createCollection = CollectionsEngine.createCollection.bind(CollectionsEngine);
  static deleteCollection = CollectionsEngine.deleteCollection.bind(CollectionsEngine);
  static addItemToCollection = CollectionsEngine.addItem.bind(CollectionsEngine);
  static removeItemFromCollection = CollectionsEngine.removeItem.bind(CollectionsEngine);
}
`);

// 4. Platform Search
write('src/platform/search/PlatformSearch.ts', `
import { DatasetRegistry } from '../registry/DatasetRegistry';
import { StudyService } from '../study/StudyService';

export interface SearchResult {
  id: string;
  title: string;
  type: 'node' | 'bookmark' | 'note' | 'collection';
  preview?: string;
}

export class PlatformSearch {
  static async search(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 3) return [];
    
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Notes
    const notes = await StudyService.searchNotes(lowerQuery);
    notes.forEach(note => {
      results.push({
        id: note.id,
        title: note.title || 'Untitled Note',
        type: 'note',
        preview: note.content.substring(0, 100) + '...'
      });
    });

    // Search Bookmarks
    const bookmarks = await StudyService.searchBookmarks(lowerQuery);
    bookmarks.forEach(bm => {
      results.push({
        id: bm.id,
        title: bm.title,
        type: 'bookmark'
      });
    });

    // Search Dataset Registry (Nodes)
    // NOTE: This assumes DatasetRegistry has a synchronous or fast search.
    const nodes = DatasetRegistry.search(lowerQuery);
    nodes.forEach(node => {
      results.push({
        id: node.id,
        title: node.title,
        type: 'node',
        preview: node.preview
      });
    });

    return results;
  }
}
`);

// 5. UI Components
write('src/platform/study/components/BookmarkButton.tsx', `
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
      className={\`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 \${isBookmarked ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}\`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <BookmarkIcon className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  );
};
`);

write('src/platform/study/components/NotesPanel.tsx', `
import React, { useState, useEffect } from 'react';
import { X, Save, Edit2, Trash2 } from 'lucide-react';
import { StudyService } from '../StudyService';
import { ReadingNote } from '../engines/NotesEngine';

interface NotesPanelProps {
  nodeId: string;
  onClose: () => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ nodeId, onClose }) => {
  const [notes, setNotes] = useState<ReadingNote[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchNotes = async () => {
      const result = await StudyService.getNotesByNode(nodeId);
      if (mounted) setNotes(result);
    };
    fetchNotes();

    const refresh = () => fetchNotes();
    const unsubCreated = StudyService.subscribe('NoteCreated', refresh);
    const unsubUpdated = StudyService.subscribe('NoteUpdated', refresh);
    const unsubDeleted = StudyService.subscribe('NoteDeleted', refresh);

    return () => {
      mounted = false;
      unsubCreated();
      unsubUpdated();
      unsubDeleted();
    };
  }, [nodeId]);

  const handleSave = async () => {
    if (!content.trim()) return;
    await StudyService.createNote({
      nodeId,
      title: title.trim() || 'Untitled Note',
      content: content.trim()
    });
    setIsComposing(false);
    setTitle('');
    setContent('');
  };

  const handleDelete = async (id: string) => {
    await StudyService.deleteNote(id);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl w-80">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Notes</h2>
        <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notes.length === 0 && !isComposing ? (
          <div className="text-center text-sm text-gray-500 py-8">
            No notes for this section yet.
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{note.title}</h3>
                <button onClick={() => handleDelete(note.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}

        {isComposing && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-lg space-y-3">
            <input 
              type="text" 
              placeholder="Note Title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-transparent border-b border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 outline-none text-sm font-medium pb-1 text-gray-900 dark:text-gray-100"
            />
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-transparent outline-none resize-none h-32 text-sm text-gray-700 dark:text-gray-300"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsComposing(false)} className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center">
                <Save className="w-3 h-3 mr-1" /> Save
              </button>
            </div>
          </div>
        )}
      </div>

      {!isComposing && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setIsComposing(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      )}
    </div>
  );
};
`);

write('src/platform/study/components/HighlightPalette.tsx', `
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
          className={\`w-6 h-6 rounded-full \${c.bg} hover:ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-gray-400 transition-all\`}
          title={\`Highlight \${c.name}\`}
        />
      ))}
    </div>
  );
};
`);

console.log('Milestone 3 Study Platform components generated successfully.');
