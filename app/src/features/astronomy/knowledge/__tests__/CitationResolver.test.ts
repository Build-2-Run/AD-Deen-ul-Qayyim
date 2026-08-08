import { describe, it, expect } from 'vitest';
import { CitationResolver } from '../engine/CitationResolver';

describe('CitationResolver Integration Tests', () => {
  const resolver = new CitationResolver();

  it('should retrieve authentic Quran verses', () => {
    const quran = resolver.getQuranVerses();
    expect(quran.length).toBeGreaterThan(0);
    expect(quran[0].arabicText).toBeDefined();
    expect(quran[0].source).toBe('Quran');
  });

  it('should retrieve authentic Hadith citations', () => {
    const hadith = resolver.getHadiths();
    expect(hadith.length).toBeGreaterThan(0);
    expect(hadith[0].authenticity).toBe('Sahih');
  });

  it('should search citations by keyword', () => {
    const res = resolver.searchCitationsByKeyword('crescent');
    expect(res.length).toBeGreaterThan(0);
  });
});
