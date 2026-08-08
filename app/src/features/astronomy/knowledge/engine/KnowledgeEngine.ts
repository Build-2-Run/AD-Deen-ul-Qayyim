import { EducationalPhenomenon, HistoricalAstronomer, ScholarReference } from '../models/knowledge-types';
import astronomers from '../content/islamic-astronomers.json';
import fiqhRefs from '../content/fiqh-references.json';
import { CitationResolver } from './CitationResolver';

export class KnowledgeEngine {
  private citationResolver = new CitationResolver();

  public getAstronomers(): HistoricalAstronomer[] {
    return (astronomers as HistoricalAstronomer[]);
  }

  public getFiqhReferences(): ScholarReference[] {
    return (fiqhRefs as ScholarReference[]);
  }

  public getPhenomenonDetails(phenomenonId: string): EducationalPhenomenon {
    const quran = this.citationResolver.getQuranVerses();
    const hadith = this.citationResolver.getHadiths();

    return {
      id: phenomenonId,
      title: { en: `Educational Context for ${phenomenonId}` },
      category: 'Astronomy & Islamic Knowledge',
      scientificExplanation: { en: 'Explanation of physical celestial phenomenon.' },
      quranCitations: quran,
      hadithCitations: hadith,
      fiqhReferences: (fiqhRefs as ScholarReference[]),
      historicalAstronomers: (astronomers as HistoricalAstronomer[]),
      relatedTerms: ['hilal', 'zawal', 'shafaq']
    };
  }
}
