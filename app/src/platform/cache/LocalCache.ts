import { CacheAdapter } from './CacheAdapter';

interface CacheItem<T> {
  value: T;
  expiresAt: number | null;
}

export class LocalCache implements CacheAdapter {
  async get<T>(key: string): Promise<T | null> {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    
    try {
      const item: CacheItem<T> = JSON.parse(raw);
      if (item.expiresAt && Date.now() > item.expiresAt) {
        await this.remove(key);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    const item: CacheItem<T> = {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }

  getSync<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      const item: CacheItem<T> = JSON.parse(raw);
      if (item.expiresAt && Date.now() > item.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  }

  setSync<T>(key: string, value: T, ttlMs?: number): void {
    const item: CacheItem<T> = {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
}
