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
