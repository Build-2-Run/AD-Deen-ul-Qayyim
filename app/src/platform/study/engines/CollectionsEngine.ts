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
      id: `col_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
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
