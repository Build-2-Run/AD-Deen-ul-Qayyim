import { OntologyConcept } from './OntologyConcept';
import { INITIAL_ONTOLOGY_CONCEPTS } from './OntologyAliases';

export class OntologyRegistry {
  private static instance: OntologyRegistry;
  private concepts = new Map<string, OntologyConcept>();
  private slugIndex = new Map<string, string>(); // slug -> conceptId
  private aliasMap = new Map<string, string>();  // alias -> conceptId

  constructor() {
    this.seedInitialConcepts();
  }

  public static getInstance(): OntologyRegistry {
    if (!OntologyRegistry.instance) {
      OntologyRegistry.instance = new OntologyRegistry();
    }
    return OntologyRegistry.instance;
  }

  private seedInitialConcepts(): void {
    for (const concept of INITIAL_ONTOLOGY_CONCEPTS) {
      if (!this.concepts.has(concept.id)) {
        this.registerConcept(concept);
      }
    }
  }

  public registerConcept(concept: OntologyConcept): void {
    if (!concept.id.startsWith('adq:ontology:concept:')) {
      throw new Error(
        `Invalid Ontology ID Error: Concept ID '${concept.id}' must start with 'adq:ontology:concept:'.`
      );
    }

    if (this.concepts.has(concept.id)) {
      throw new Error(
        `Duplicate Ontology Concept Error: Concept ID '${concept.id}' is already registered.`
      );
    }

    if (this.slugIndex.has(concept.slug)) {
      throw new Error(
        `Duplicate Ontology Slug Error: Slug '${concept.slug}' is already registered to concept '${this.slugIndex.get(concept.slug)}'.`
      );
    }

    // Check alias collisions
    for (const alias of concept.aliases) {
      const lowerAlias = alias.toLowerCase().trim();
      if (this.aliasMap.has(lowerAlias) && this.aliasMap.get(lowerAlias) !== concept.id) {
        throw new Error(
          `Alias Collision Error: Alias '${alias}' for concept '${concept.id}' is already registered to concept '${this.aliasMap.get(lowerAlias)}'.`
        );
      }
    }

    const frozenConcept = Object.freeze({ ...concept });
    this.concepts.set(concept.id, frozenConcept);
    this.slugIndex.set(concept.slug, concept.id);

    for (const alias of concept.aliases) {
      const lowerAlias = alias.toLowerCase().trim();
      this.aliasMap.set(lowerAlias, concept.id);
    }
  }

  public getConcept(id: string): OntologyConcept | undefined {
    return this.concepts.get(id);
  }

  public getConceptBySlug(slug: string): OntologyConcept | undefined {
    const id = this.slugIndex.get(slug);
    return id ? this.concepts.get(id) : undefined;
  }

  public getConceptByAlias(alias: string): OntologyConcept | undefined {
    const lowerAlias = alias.toLowerCase().trim();
    const id = this.aliasMap.get(lowerAlias);
    return id ? this.concepts.get(id) : undefined;
  }

  public getAllConcepts(): ReadonlyArray<OntologyConcept> {
    return Array.from(this.concepts.values());
  }

  public clear(): void {
    this.concepts.clear();
    this.slugIndex.clear();
    this.aliasMap.clear();
  }

  public resetToDefaults(): void {
    this.clear();
    this.seedInitialConcepts();
  }

  public size(): number {
    return this.concepts.size;
  }
}
