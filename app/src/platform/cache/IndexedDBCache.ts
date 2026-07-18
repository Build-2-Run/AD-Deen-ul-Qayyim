import { CacheAdapter } from './CacheAdapter';

interface CacheItem<T> {
  value: T;
  expiresAt: number | null;
}

export class IndexedDBCache implements CacheAdapter {
  private dbName = 'adq_cache_db';
  private storeName = 'adq_store';
  private version = 1;
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      // Return a dummy promise in SSR/Node environments where indexedDB is undefined
      if (typeof indexedDB === 'undefined') {
        resolve(null as any);
        return;
      }
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      
      request.onsuccess = (event: any) => resolve(event.target.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const db = await this.dbPromise;
    if (!db) return null;

    return new Promise((resolve) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = async () => {
        const item: CacheItem<T> | undefined = request.result;
        if (!item) {
          resolve(null);
          return;
        }
        if (item.expiresAt && Date.now() > item.expiresAt) {
          await this.remove(key);
          resolve(null);
          return;
        }
        resolve(item.value);
      };
      request.onerror = () => resolve(null);
    });
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const item: CacheItem<T> = {
        value,
        expiresAt: ttlMs ? Date.now() + ttlMs : null
      };

      const request = store.put(item, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async remove(key: string): Promise<void> {
    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
