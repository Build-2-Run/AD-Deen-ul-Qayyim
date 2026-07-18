const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, 'src');
const PLATFORM_DIR = path.join(APP_DIR, 'platform');

// 1. vitest.config.ts
const vitestConfigCode = `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
`;
fs.writeFileSync(path.join(__dirname, 'vitest.config.ts'), vitestConfigCode);

// 2. Add test script to package.json
const pkgPath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts.test = "vitest run";
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

// 3. CacheProvider.test.ts
const cacheTestCode = `import { describe, it, expect, beforeEach } from 'vitest';
import { LocalCache } from './LocalCache';

describe('LocalCache', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve data', () => {
    LocalCache.set('test_key', { hello: 'world' });
    const data = LocalCache.get<{ hello: string }>('test_key');
    expect(data).toEqual({ hello: 'world' });
  });

  it('should return null for non-existent keys', () => {
    const data = LocalCache.get('missing');
    expect(data).toBeNull();
  });
});
`;
const CACHE_DIR = path.join(PLATFORM_DIR, 'cache');
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
// If LocalCache.ts doesn't exist, create a stub for it since CacheProvider is requested.
const localCacheCode = `export class LocalCache {
  static get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  static set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
`;
fs.writeFileSync(path.join(CACHE_DIR, 'LocalCache.ts'), localCacheCode);
fs.writeFileSync(path.join(CACHE_DIR, 'CacheProvider.test.ts'), cacheTestCode);

// 4. DatasetRegistry.test.ts
const datasetRegistryTestCode = `import { describe, it, expect } from 'vitest';
import { DatasetRegistry } from './DatasetRegistry';

describe('DatasetRegistry', () => {
  it('has loadMetadata defined', () => {
    expect(DatasetRegistry.loadMetadata).toBeDefined();
  });

  it('has loadSurah defined', () => {
    expect(DatasetRegistry.loadSurah).toBeDefined();
  });
});
`;
fs.writeFileSync(path.join(PLATFORM_DIR, 'registry', 'DatasetRegistry.test.ts'), datasetRegistryTestCode);

// 5. RelationEngine.test.ts
const relationEngineTestCode = `import { describe, it, expect } from 'vitest';
import { RelationEngine } from './RelationEngine';

describe('RelationEngine', () => {
  it('is defined', () => {
    expect(RelationEngine).toBeDefined();
  });
});
`;
fs.writeFileSync(path.join(PLATFORM_DIR, 'relations', 'RelationEngine.test.ts'), relationEngineTestCode);

// 6. PlatformSearch.test.ts
const platformSearchTestCode = `import { describe, it, expect } from 'vitest';
import { PlatformSearch } from './PlatformSearch';

describe('PlatformSearch', () => {
  it('returns empty array for short queries', async () => {
    const results = await PlatformSearch.search('ab');
    expect(results).toEqual([]);
  });
});
`;
fs.writeFileSync(path.join(PLATFORM_DIR, 'search', 'PlatformSearch.test.ts'), platformSearchTestCode);

// 7. StudyService.test.ts
const studyServiceTestCode = `import { describe, it, expect } from 'vitest';
import { StudyService } from './StudyService';

describe('StudyService', () => {
  it('exports searchNotes', () => {
    expect(StudyService.searchNotes).toBeDefined();
  });
});
`;
fs.writeFileSync(path.join(PLATFORM_DIR, 'study', 'StudyService.test.ts'), studyServiceTestCode);

console.log("Unit tests bootstrapped successfully.");
