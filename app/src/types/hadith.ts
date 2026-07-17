import { KnowledgeNode } from './knowledge';
import { EvidenceLevel } from './common';

export interface HadithNode extends KnowledgeNode {
  narrator: string;
  arabicText: string;
  grading: EvidenceLevel;
  collection: string;
  hadithNumber: number;
}
