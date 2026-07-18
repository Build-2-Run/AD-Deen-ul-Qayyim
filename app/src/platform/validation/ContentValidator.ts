export class ContentValidator {
  static validate(dataset: any) {
    console.log(`Validating dataset: ${dataset.metadata.id}`);
    
    this.validateMetadata(dataset.metadata);
    
    const nodeIds = new Set<string>();
    
    // Dataset can be Quran (has normalizedSurahs) or Hadith (has books)
    if (dataset.normalizedSurahs) {
      this.validateQuran(dataset, nodeIds);
    } else if (dataset.books) {
      this.validateHadith(dataset, nodeIds);
    } else {
      throw new Error("Unknown dataset format");
    }

    console.log(`Validation complete for ${dataset.metadata.id}. Unique nodes: ${nodeIds.size}`);
  }

  private static validateMetadata(metadata: any) {
    const required = ['id', 'name', 'source', 'version', 'language', 'compilerVersion', 'schemaVersion'];
    for (const req of required) {
      if (!metadata[req]) {
        console.warn(`[Schema Warning] Metadata missing required field: ${req}`);
      }
    }
  }

  private static validateQuran(dataset: any, nodeIds: Set<string>) {
    dataset.normalizedSurahs.forEach((surah: any) => {
      surah.ayahs.forEach((ayah: any) => {
        const id = `quran:surah:${surah.metadata.id}:ayah:${ayah.number}`;
        
        // 1. Duplicate detection
        if (nodeIds.has(id)) {
          throw new Error(`[Duplicate Error] Duplicate node ID found: ${id}`);
        }
        nodeIds.add(id);

        // 2. Schema Validator
        if (!ayah.arabic) throw new Error(`[Schema Error] Node ${id} missing arabic text`);
      });
    });
  }

  private static validateHadith(dataset: any, nodeIds: Set<string>) {
    dataset.books.forEach((book: any) => {
      book.hadiths.forEach((h: any) => {
        const id = h.id; // already normalized to hadith:bukhari:book:1:hadith:1
        
        if (nodeIds.has(id)) {
          throw new Error(`[Duplicate Error] Duplicate node ID found: ${id}`);
        }
        nodeIds.add(id);

        if (!h.arabic) throw new Error(`[Schema Error] Node ${id} missing arabic text`);

        // 3. Semantic / Relation Validator
        if (h.relations && Array.isArray(h.relations)) {
          h.relations.forEach((rel: string) => {
            if (!this.isValidCanonicalId(rel)) {
              console.warn(`[Semantic Warning] Node ${id} has malformed relation ID: ${rel}`);
            }
            // In a real semantic validator, we would check if 'rel' exists in a global index.
          });
        }
      });
    });
  }

  private static isValidCanonicalId(id: string): boolean {
    const parts = id.split(':');
    if (parts.length < 3) return false;
    const domain = parts[0];
    if (!['quran', 'hadith', 'tafsir', 'person', 'place', 'event', 'topic', 'concept'].includes(domain)) {
      return false;
    }
    return true;
  }
}
