import { GlossaryTerm } from '../models/knowledge-types';
import terms from '../content/scientific-glossary.json';

export class GlossaryEngine {
  private glossaryMap = new Map<string, GlossaryTerm>();

  constructor() {
    for (const t of terms as GlossaryTerm[]) {
      this.glossaryMap.set(t.id, t);
    }
  }

  public getTermById(id: string): GlossaryTerm | undefined {
    return this.glossaryMap.get(id);
  }

  public getAllTerms(): GlossaryTerm[] {
    return (terms as GlossaryTerm[]);
  }

  public searchGlossary(query: string, lang: string = 'en'): GlossaryTerm[] {
    const q = query.toLowerCase();
    return (terms as GlossaryTerm[]).filter(t => {
      return (
        t.termEnglish.toLowerCase().includes(q) ||
        t.termArabic.includes(q) ||
        (t.scientificDefinition[lang] && t.scientificDefinition[lang].toLowerCase().includes(q))
      );
    });
  }
}
