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
