import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationCard } from './RelationCard';

export const RelationGroup: React.FC<{ title: string; relations: KnowledgeRelation[]; sourceId: string }> = ({ title, relations, sourceId }) => {
  if (relations.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">{title}</h3>
      <div className="space-y-2">
        {relations.map(r => (
          <RelationCard key={r.id} relation={r} targetId={r.sourceNodeId === sourceId ? r.targetNodeId : r.sourceNodeId} />
        ))}
      </div>
    </div>
  );
}
