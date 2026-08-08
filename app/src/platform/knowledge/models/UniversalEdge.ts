import { UniversalCitation } from './UniversalNode';

export type UniversalRelationType =
  | 'explains'
  | 'references'
  | 'fulfills'
  | 'governs'
  | 'mentions'
  | 'occurred at'
  | 'created by'
  | 'discovered by'
  | 'related to'
  | 'prerequisite of'
  | 'consequence of'
  | 'scientific explanation of'
  | 'historical context of'
  | 'linguistic meaning of'
  | 'legal ruling for'
  | 'connected to'
  | 'compares with'
  | 'located at'
  | 'part of';

export interface UniversalEdge {
  readonly id: string;               // Unique Edge ID e.g. "edge:water->wudu"
  readonly sourceId: string;         // Source Node ID
  readonly targetId: string;         // Target Node ID
  readonly relationType: UniversalRelationType;
  readonly narrative: string;        // Explanatory narrative linking source to target
  readonly weight: number;           // Connection strength (0.0 to 1.0)
  readonly isBidirectional: boolean;
  readonly citation?: UniversalCitation;
}
