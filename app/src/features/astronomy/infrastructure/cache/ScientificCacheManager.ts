export interface CacheEntry<T> {
  readonly key: string;
  readonly value: T;
  readonly createdAtMs: number;
  readonly ttlMs: number;
  readonly isLazy: boolean;
}

export class ScientificCacheManager {
  private static instance: ScientificCacheManager;
  private memoryCache = new Map<string, CacheEntry<unknown>>();

  private constructor() {}

  public static getInstance(): ScientificCacheManager {
    if (!ScientificCacheManager.instance) {
      ScientificCacheManager.instance = new ScientificCacheManager();
    }
    return ScientificCacheManager.instance;
  }

  public set<T>(key: string, value: T, ttlMs: number = 3600000, isLazy: boolean = false): void {
    this.memoryCache.set(key, {
      key,
      value,
      createdAtMs: Date.now(),
      ttlMs,
      isLazy
    });
  }

  public get<T>(key: string): T | undefined {
    const entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;

    if (Date.now() - entry.createdAtMs > entry.ttlMs) {
      this.memoryCache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  public getOrLoad<T>(key: string, loader: () => T, ttlMs?: number): T {
    const cached = this.get<T>(key);
    if (cached !== undefined) return cached;

    const value = loader();
    this.set(key, value, ttlMs, true);
    return value;
  }

  public clear(): void {
    this.memoryCache.clear();
  }

  public size(): number {
    return this.memoryCache.size;
  }
}
