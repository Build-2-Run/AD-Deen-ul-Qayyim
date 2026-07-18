import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationGroup } from './RelationGroup';

export const PeoplePanel: React.FC<{ relations: KnowledgeRelation[]; sourceId: string }> = ({ relations, sourceId }) => (
  <RelationGroup title="Related People" relations={relations} sourceId={sourceId} />
);
