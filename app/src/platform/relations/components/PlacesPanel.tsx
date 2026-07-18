import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationGroup } from './RelationGroup';

export const PlacesPanel: React.FC<{ relations: KnowledgeRelation[]; sourceId: string }> = ({ relations, sourceId }) => (
  <RelationGroup title="Locations & Places" relations={relations} sourceId={sourceId} />
);
