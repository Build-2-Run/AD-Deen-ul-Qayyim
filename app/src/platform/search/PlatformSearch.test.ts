import { describe, it, expect } from 'vitest';
import { PlatformSearch } from './PlatformSearch';

describe('PlatformSearch', () => {
  it('returns empty array for short queries', async () => {
    const results = await PlatformSearch.search('ab');
    expect(results).toEqual([]);
  });
});
