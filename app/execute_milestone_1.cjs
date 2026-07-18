const fs = require('fs');
const path = require('path');

const write = (relPath, content) => {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
};

// 1. Scaffold src/platform/
const platformDirs = [
  'reader', 'navigation', 'search', 'bookmarks', 'settings',
  'statistics', 'translation', 'fonts', 'registry', 'caching'
];
platformDirs.forEach(d => fs.mkdirSync(path.join(__dirname, 'src/platform', d), { recursive: true }));

// 2. Migrate src/data to src/content
if (fs.existsSync(path.join(__dirname, 'src/data'))) {
  fs.cpSync(path.join(__dirname, 'src/data'), path.join(__dirname, 'src/content'), { recursive: true });
  fs.rmSync(path.join(__dirname, 'src/data'), { recursive: true, force: true });
}

// Update imports
const useQuranPath = path.join(__dirname, 'src/features/quran/hooks/useQuran.ts');
if (fs.existsSync(useQuranPath)) {
  let content = fs.readFileSync(useQuranPath, 'utf8');
  content = content.replace(/..\/..\/..\/data\//g, '../../../content/');
  fs.writeFileSync(useQuranPath, content);
}

// 3. DatasetRegistry.ts
write('src/platform/registry/DatasetRegistry.ts', `
export interface DatasetMetadata {
  id: string;
  version: string;
  source: string;
  translation?: string;
  compiledAt: string;
  checksum: string;
  language: string;
}

export class DatasetRegistry {
  private static datasets: Map<string, DatasetMetadata> = new Map();

  static register(metadata: DatasetMetadata) {
    this.datasets.set(metadata.id, metadata);
  }

  static getDataset(id: string): DatasetMetadata | undefined {
    return this.datasets.get(id);
  }

  static listDatasets(): DatasetMetadata[] {
    return Array.from(this.datasets.values());
  }

  static getVersion(id: string): string | undefined {
    return this.datasets.get(id)?.version;
  }
}
`);

// 4. TranslationRegistry.ts
write('src/platform/translation/TranslationRegistry.ts', `
export interface TranslationMetadata {
  id: string;
  language: string;
  name: string;
  translator: string;
  isRtl: boolean;
}

export class TranslationRegistry {
  private static translations: Map<string, TranslationMetadata> = new Map();
  private static defaultId: string = 'en.sahih';

  static register(metadata: TranslationMetadata) {
    this.translations.set(metadata.id, metadata);
  }

  static get(id: string): TranslationMetadata | undefined {
    return this.translations.get(id);
  }

  static setDefault(id: string) {
    this.defaultId = id;
  }

  static getDefault(): TranslationMetadata | undefined {
    return this.translations.get(this.defaultId);
  }

  static listTranslations(): TranslationMetadata[] {
    return Array.from(this.translations.values());
  }
}
`);

// 5. FontRegistry.ts
write('src/platform/fonts/FontRegistry.ts', `
export interface FontMetadata {
  id: string;
  name: string;
  family: string;
  fallback: string;
  isArabic: boolean;
}

export class FontRegistry {
  private static fonts: Map<string, FontMetadata> = new Map();

  static register(metadata: FontMetadata) {
    this.fonts.set(metadata.id, metadata);
  }

  static get(id: string): FontMetadata | undefined {
    return this.fonts.get(id);
  }

  static listArabicFonts(): FontMetadata[] {
    return Array.from(this.fonts.values()).filter(f => f.isArabic);
  }

  static listLatinFonts(): FontMetadata[] {
    return Array.from(this.fonts.values()).filter(f => !f.isArabic);
  }
}

// Pre-register standard fonts
FontRegistry.register({ id: 'uthmani', name: 'Uthmani Script', family: 'KFGQPC Uthmanic Script', fallback: 'serif', isArabic: true });
FontRegistry.register({ id: 'amiri', name: 'Amiri', family: 'Amiri', fallback: 'serif', isArabic: true });
FontRegistry.register({ id: 'inter', name: 'Inter', family: 'Inter', fallback: 'sans-serif', isArabic: false });
`);

console.log('Milestone 1 scaffolded.');
