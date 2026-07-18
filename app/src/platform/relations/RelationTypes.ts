export type RelationType = 
  | 'supports' 
  | 'explains' 
  | 'mentions' 
  | 'related' 
  | 'timeline' 
  | 'location' 
  | 'derivedFrom' 
  | 'contrasts' 
  | 'implements' 
  | 'causes' 
  | 'references' 
  | 'partOf';

export interface KnowledgeRelation {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: RelationType;
  priority: number;
  confidence: number;
  evidence?: string;
  references?: string[];
  createdAt: number;
  updatedAt: number;
}
