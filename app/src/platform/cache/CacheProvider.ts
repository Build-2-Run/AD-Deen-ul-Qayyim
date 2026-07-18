import { CacheAdapter } from './CacheAdapter';
import { LocalCache } from './LocalCache';
import { IndexedDBCache } from './IndexedDBCache';

export class CacheProvider {
  private static localAdapter = new LocalCache();
  private static idbAdapter = new IndexedDBCache();
  private static memoryCache = new Map<string, any>();

  static getInstance(): CacheAdapter {
    return {
      get: this.get.bind(this),
      set: this.set.bind(this),
      remove: this.remove.bind(this),
      clear: this.clear.bind(this),
      getSync: this.getSync.bind(this),
      setSync: this.setSync.bind(this)
    };
  }

  static async get<T>(key: string): Promise<T | null> {
    // 1. Memory
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    // 2. LocalStorage
    let val = await this.localAdapter.get<T>(key);
    if (val !== null) {
      this.memoryCache.set(key, val);
      return val;
    }
    // 3. IndexedDB
    val = await this.idbAdapter.get<T>(key);
    if (val !== null) {
      this.memoryCache.set(key, val);
      return val;
    }
    return null;
  }

  static async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    this.memoryCache.set(key, value);
    // Write large data to IndexedDB, small to LocalStorage. We'll write to both for resilience, 
    // or we can optimize later. For now, writing to both maintains hierarchy resilience.
    await Promise.all([
      this.localAdapter.set(key, value, ttlMs),
      this.idbAdapter.set(key, value, ttlMs)
    ]);
  }

  static async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await Promise.all([
      this.localAdapter.remove(key),
      this.idbAdapter.remove(key)
    ]);
  }

  static async clear(): Promise<void> {
    this.memoryCache.clear();
    await Promise.all([
      this.localAdapter.clear(),
      this.idbAdapter.clear()
    ]);
  }

  // Synchronous operations ONLY read/write from Memory -> LocalStorage
  static getSync<T>(key: string): T | null {
    if (this.memoryCache.has(key)) return this.memoryCache.get(key);
    const val = this.localAdapter.getSync<T>(key);
    if (val !== null) {
      this.memoryCache.set(key, val);
    }
    return val;
  }

  static setSync<T>(key: string, value: T, ttlMs?: number): void {
    this.memoryCache.set(key, value);
    this.localAdapter.setSync(key, value, ttlMs);
    // Async fire-and-forget to sync to IndexedDB in background
    this.idbAdapter.set(key, value, ttlMs).catch(() => {});
  }
}
