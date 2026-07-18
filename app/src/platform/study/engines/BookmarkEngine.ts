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
      id: `bm_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
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
