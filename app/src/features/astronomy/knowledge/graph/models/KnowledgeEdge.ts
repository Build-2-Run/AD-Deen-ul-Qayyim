import { CitationReference } from './KnowledgeNode';

export type RelationshipType =
  | 'DEFINES'
  | 'EXPLAINS_SCIENTIFICALLY'
  | 'GOVERNS_FIQH'
  | 'OBSERVES_CELESTIAL'
  | 'WRITTEN_BY'
  | 'FOUNDATION_FOR'
  | 'CAUSES_PHENOMENON'
  | 'CALCULATES'
  | 'COMPLEMENTS'
  | 'REFERENCES'
  | 'MENTIONS'
  | 'EXPLAINS'
  | 'SUPPORTED_BY'
  | 'DERIVED_FROM'
  | 'RELATED_TO'
  | 'PART_OF'
  | 'LOCATED_AT'
  | 'PRACTICED_IN';

export interface KnowledgeEdge {
  readonly id: string;               // Unique Edge ID
  readonly sourceId: string;         // Source Node ID
  readonly targetId: string;         // Target Node ID
  readonly relationType: RelationshipType;
  readonly description: string;      // Narrative explaining relation
  readonly weight: number;           // Connection strength (0.0 to 1.0)
  readonly isBidirectional: boolean;
  readonly citation?: CitationReference;
}
