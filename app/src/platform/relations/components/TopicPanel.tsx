import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationGroup } from './RelationGroup';

export const TopicPanel: React.FC<{ relations: KnowledgeRelation[]; sourceId: string }> = ({ relations, sourceId }) => (
  <RelationGroup title="Themes & Topics" relations={relations} sourceId={sourceId} />
);
