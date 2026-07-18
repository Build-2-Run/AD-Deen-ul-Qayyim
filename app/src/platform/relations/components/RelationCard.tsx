import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';

export const RelationCard: React.FC<{ relation: KnowledgeRelation; targetId: string }> = ({ relation, targetId }) => (
  <div className="p-3 border rounded-lg hover:border-emerald-500 transition-colors bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between">
    <div>
      <h4 className="font-medium text-gray-900 dark:text-gray-100">{targetId.replace(/^[^-]+-/, '')}</h4>
      <span className="text-xs text-gray-500 uppercase tracking-wider">{relation.relationType}</span>
    </div>
    <div className="text-xs text-gray-400">
      Conf: {Math.round(relation.confidence * 100)}%
    </div>
  </div>
);
