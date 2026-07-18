import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationGroup } from './RelationGroup';

export const TimelinePanel: React.FC<{ relations: KnowledgeRelation[]; sourceId: string }> = ({ relations, sourceId }) => (
  <RelationGroup title="Timeline" relations={relations} sourceId={sourceId} />
);
