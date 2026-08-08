import { OntologyConcept } from './OntologyConcept';
import { OntologyRegistry } from './OntologyRegistry';

export class OntologyResolver {
  private registry: OntologyRegistry;

  constructor(registry = OntologyRegistry.getInstance()) {
    this.registry = registry;
  }

  public resolveConcept(termOrAlias: string): OntologyConcept | undefined {
    if (!termOrAlias) return undefined;
    const cleanTerm = termOrAlias.trim();

    // 1. Direct ID match
    if (cleanTerm.startsWith('adq:ontology:concept:')) {
      const concept = this.registry.getConcept(cleanTerm);
      if (concept) return concept;
    }

    // 2. Slug match
    const slugMatch = this.registry.getConceptBySlug(cleanTerm.toLowerCase());
    if (slugMatch) return slugMatch;

    // 3. Alias match
    const aliasMatch = this.registry.getConceptByAlias(cleanTerm);
    if (aliasMatch) return aliasMatch;

    return undefined;
  }

  public resolveConceptId(termOrAlias: string): string | undefined {
    const concept = this.resolveConcept(termOrAlias);
    return concept?.id;
  }
}
