import { CacheAdapter } from './CacheAdapter';
import { LocalCache } from './LocalCache';

export class CacheProvider {
  private static instance: CacheAdapter = new LocalCache();

  static getInstance(): CacheAdapter {
    return this.instance;
  }

  static setAdapter(adapter: CacheAdapter) {
    this.instance = adapter;
  }
}
