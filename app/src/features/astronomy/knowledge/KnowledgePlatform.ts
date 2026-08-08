import { KnowledgeEngine } from './engine/KnowledgeEngine';
import { CitationResolver } from './engine/CitationResolver';
import { GlossaryEngine } from './engine/GlossaryEngine';
import { EducationalModuleEngine } from './engine/EducationalModuleEngine';
import { AuthenticCitation, EducationalPhenomenon, GlossaryTerm, HistoricalAstronomer, LearningModule } from './models/knowledge-types';

export class KnowledgePlatform {
  private knowledgeEngine = new KnowledgeEngine();
  private citationResolver = new CitationResolver();
  private glossaryEngine = new GlossaryEngine();
  private moduleEngine = new EducationalModuleEngine();

  public getTopic(id: string): EducationalPhenomenon {
    return this.knowledgeEngine.getPhenomenonDetails(id);
  }

  public getEducationalModule(id: string): LearningModule | undefined {
    return this.moduleEngine.getModuleById(id);
  }

  public getAllModules(): LearningModule[] {
    return this.moduleEngine.getAllModules();
  }

  public getRelatedVerses(keyword?: string): AuthenticCitation[] {
    if (!keyword) return this.citationResolver.getQuranVerses();
    return this.citationResolver.searchCitationsByKeyword(keyword).filter(c => c.source === 'Quran');
  }

  public getRelatedHadith(keyword?: string): AuthenticCitation[] {
    if (!keyword) return this.citationResolver.getHadiths();
    return this.citationResolver.searchCitationsByKeyword(keyword).filter(c => c.source === 'Hadith');
  }

  public getGlossary(query?: string, lang: string = 'en'): GlossaryTerm[] {
    if (!query) return this.glossaryEngine.getAllTerms();
    return this.glossaryEngine.searchGlossary(query, lang);
  }

  public getHistoricalAstronomers(): HistoricalAstronomer[] {
    return this.knowledgeEngine.getAstronomers();
  }

  public searchKnowledge(query: string): {
    citations: AuthenticCitation[];
    terms: GlossaryTerm[];
    astronomers: HistoricalAstronomer[];
  } {
    return {
      citations: this.citationResolver.searchCitationsByKeyword(query),
      terms: this.glossaryEngine.searchGlossary(query),
      astronomers: this.knowledgeEngine.getAstronomers().filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.arabicName.includes(query)
      )
    };
  }
}

export const knowledgePlatform = new KnowledgePlatform();
