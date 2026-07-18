export interface CacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  
  // Synchronous fallbacks for React initial state (e.g. ReaderPreferences)
  getSync?<T>(key: string): T | null;
  setSync?<T>(key: string, value: T): void;
}
