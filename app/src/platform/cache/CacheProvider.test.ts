import { describe, it, expect, beforeEach } from 'vitest';
import { LocalCache } from './LocalCache';

describe('LocalCache', () => {
  let cache: LocalCache;

  beforeEach(() => {
    localStorage.clear();
    cache = new LocalCache();
  });

  it('should store and retrieve data', async () => {
    await cache.set('test_key', { hello: 'world' });
    const data = await cache.get<{ hello: string }>('test_key');
    expect(data).toEqual({ hello: 'world' });
  });

  it('should return null for non-existent keys', async () => {
    const data = await cache.get('missing');
    expect(data).toBeNull();
  });
});

