import { KnowledgeDomainType, MultilingualNames } from '../models/UniversalNode';

export interface OntologyConcept {
  readonly id: string;               // Canonical Ontology ID e.g. "adq:ontology:concept:prayer"
  readonly slug: string;             // e.g. "prayer", "fasting", "water", "intention"
  readonly domain: KnowledgeDomainType;
  readonly names: MultilingualNames;
  readonly aliases: ReadonlyArray<string>;
  readonly description: string;
}
