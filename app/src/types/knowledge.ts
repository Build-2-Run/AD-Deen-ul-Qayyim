import { NodeStatus, Tag, Reference, Media, Translation } from './common';

export interface KnowledgeNode {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: NodeStatus;
  description?: string;
  learningStage?: string;
  tags?: Tag[];
  references?: Reference[];
  media?: Media[];
  translations?: Translation[];
  relatedNodes?: string[];
}

export interface KnowledgeConnection {
  sourceNodeId: string;
  targetNodeId: string;
  connectionType: 'Supports' | 'Explains' | 'Causes' | 'Mentions' | 'Located In' | 'Expands' | 'Timeline';
  context?: string;
}

export interface KnowledgeCollection {
  id: string;
  title: string;
  orderedNodeIds: string[];
  description?: string;
}
