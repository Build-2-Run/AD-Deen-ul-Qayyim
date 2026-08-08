import { AuthenticCitation } from '../models/knowledge-types';
import quranCitations from '../content/quran-astronomy-map.json';
import hadithCitations from '../content/hadith-astronomy-map.json';

export class CitationResolver {
  private citationsMap = new Map<string, AuthenticCitation>();

  constructor() {
    for (const c of quranCitations as AuthenticCitation[]) {
      this.citationsMap.set(c.id, c);
    }
    for (const h of hadithCitations as AuthenticCitation[]) {
      this.citationsMap.set(h.id, h);
    }
  }

  public getCitationById(id: string): AuthenticCitation | undefined {
    return this.citationsMap.get(id);
  }

  public getQuranVerses(): AuthenticCitation[] {
    return (quranCitations as AuthenticCitation[]);
  }

  public getHadiths(): AuthenticCitation[] {
    return (hadithCitations as AuthenticCitation[]);
  }

  public searchCitationsByKeyword(keyword: string): AuthenticCitation[] {
    const term = keyword.toLowerCase();
    const results: AuthenticCitation[] = [];
    for (const c of this.citationsMap.values()) {
      if (
        c.reference.toLowerCase().includes(term) ||
        c.arabicText.includes(term) ||
        Object.values(c.translations).some(t => t.toLowerCase().includes(term)) ||
        c.keywords.some(k => k.toLowerCase().includes(term))
      ) {
        results.push(c);
      }
    }
    return results;
  }
}
