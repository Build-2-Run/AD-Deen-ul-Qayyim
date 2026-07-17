import { KnowledgeNode } from './knowledge';
import { Location, TimelineEvent } from './common';

export interface HistoryNode extends KnowledgeNode {
  location?: Location;
  eventTimeline?: TimelineEvent;
  keyFigures?: string[];
}
