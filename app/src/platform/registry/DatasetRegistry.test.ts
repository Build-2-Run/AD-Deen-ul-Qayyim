import { describe, it, expect } from 'vitest';
import { DatasetRegistry } from './DatasetRegistry';

describe('DatasetRegistry', () => {
  it('has loadMetadata defined', () => {
    expect(DatasetRegistry.loadMetadata).toBeDefined();
  });

  it('has loadSurah defined', () => {
    expect(DatasetRegistry.loadSurah).toBeDefined();
  });
});
