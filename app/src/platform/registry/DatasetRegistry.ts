export interface DatasetMetadata {
  id: string;
  version: string;
  source: string;
  compiledAt: string;
  language: string;
  surahs?: any[];
}

export class DatasetRegistry {
  private static metadataCache: DatasetMetadata | null = null;
  private static searchIndexCache: any[] | null = null;
  private static surahCache: Map<string, any> = new Map();
  private static translationCache: Map<string, any> = new Map();

  static async loadMetadata(): Promise<DatasetMetadata> {
    if (this.metadataCache) return this.metadataCache;
    // @ts-ignore
    const meta = (await import('../../../content/quran/compiled/metadata.json')).default;
    this.metadataCache = meta;
    return meta;
  }

  static async loadSurah(surahNumber: number): Promise<any> {
    const sNumStr = String(surahNumber).padStart(3, '0');
    if (this.surahCache.has(sNumStr)) return this.surahCache.get(sNumStr);
    
    // Dynamic import allows Vite to chunk each JSON file
    const surah = (await import(`../../../content/quran/compiled/surahs/${sNumStr}.json`)).default;
    this.surahCache.set(sNumStr, surah);
    return surah;
  }

  static async loadTranslation(surahNumber: number, lang: string, author: string): Promise<any> {
    const sNumStr = String(surahNumber).padStart(3, '0');
    const key = `${lang}-${author}-${sNumStr}`;
    if (this.translationCache.has(key)) return this.translationCache.get(key);
    
    const trans = (await import(`../../../content/quran/compiled/translations/${lang}/${author}/${sNumStr}.json`)).default;
    this.translationCache.set(key, trans);
    return trans;
  }

  static async search(query: string): Promise<any[]> {
    if (!this.searchIndexCache) {
      // @ts-ignore
      this.searchIndexCache = (await import('../../../content/quran/compiled/search-index.json')).default;
    }
    const q = query.toLowerCase();
    return this.searchIndexCache!.filter((item: any) => 
      item.english?.toLowerCase().includes(q) || 
      item.urdu?.includes(q) || 
      item.arabic?.includes(q)
    );
  }
}
