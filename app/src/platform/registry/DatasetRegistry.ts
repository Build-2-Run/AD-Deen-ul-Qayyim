export interface DatasetMetadata {
  id?: string;
  version?: string;
  source?: string;
  compiledAt?: string;
  language?: string;
  surahs?: any[];
}

export class DatasetRegistry {
  private static metadataCache: DatasetMetadata | null = null;
  private static searchIndexCache: any[] | null = null;
  private static surahCache: Map<string, any> = new Map();
  private static translationCache: Map<string, any> = new Map();
  private static collectionCache: Map<string, any> = new Map();
  private static nodeCache: Map<string, any> = new Map();

  static async loadMetadata(): Promise<DatasetMetadata> {
    if (this.metadataCache) return this.metadataCache;
    // @ts-ignore
    const meta = (await import('../../content/quran/compiled/metadata.json')).default;
    this.metadataCache = meta;
    return meta;
  }

  static async loadSurah(surahNumber: number): Promise<any> {
    const sNumStr = String(surahNumber).padStart(3, '0');
    if (this.surahCache.has(sNumStr)) return this.surahCache.get(sNumStr);
    
    // Dynamic import allows Vite to chunk each JSON file
    const surah = (await import(`../../content/quran/compiled/surahs/${sNumStr}.json`)).default;
    this.surahCache.set(sNumStr, surah);
    return surah;
  }

  static async loadTranslation(surahNumber: number, lang: string, author: string): Promise<any> {
    const sNumStr = String(surahNumber).padStart(3, '0');
    const key = `${lang}-${author}-${sNumStr}`;
    if (this.translationCache.has(key)) return this.translationCache.get(key);
    
    const trans = (await import(`../../content/quran/compiled/translations/${lang}/${author}/${sNumStr}.json`)).default;
    this.translationCache.set(key, trans);
    return trans;
  }

  static async loadCollection(collectionId: string): Promise<any> {
    if (this.collectionCache.has(collectionId)) return this.collectionCache.get(collectionId);
    
    let metadata;
    if (collectionId === 'quran') {
       metadata = await this.loadMetadata();
    } else {
       // Assume it's a hadith collection for now based on domain knowledge
       metadata = (await import(`../../content/hadith/compiled/collections/${collectionId}/metadata.json`)).default;
    }
    
    this.collectionCache.set(collectionId, metadata);
    return metadata;
  }

  static async loadNode(nodeId: string): Promise<any> {
    if (this.nodeCache.has(nodeId)) return this.nodeCache.get(nodeId);

    // hadith:bukhari:1:1
    const parts = nodeId.split(':');
    if (parts[0] === 'hadith') {
      const collection = parts[1];
      const book = parts[2];
      const bookStr = book.padStart(3, '0');
      const bookData = (await import(`../../content/hadith/compiled/collections/${collection}/book-${bookStr}.json`)).default;
      
      const node = bookData.hadiths.find((h: any) => h.id === nodeId);
      if (node) {
        this.nodeCache.set(nodeId, node);
        return node;
      }
    }
    
    return null;
  }

  static async search(query: string): Promise<any[]> {
    if (!this.searchIndexCache) {
      // Load and merge search indexes
      const quranIndex = (await import('../../content/quran/compiled/search-index.json')).default;
      let hadithIndex: any[] = [];
      try {
        hadithIndex = (await import('../../content/hadith/compiled/search-index-bukhari.json')).default;
      } catch (e) {
        console.warn("Hadith search index not found");
      }
      this.searchIndexCache = [...quranIndex, ...hadithIndex];
    }
    const q = query.toLowerCase();
    return this.searchIndexCache!.filter((item: any) => 
      item.english?.toLowerCase().includes(q) || 
      item.urdu?.includes(q) || 
      item.arabic?.includes(q)
    );
  }
}
