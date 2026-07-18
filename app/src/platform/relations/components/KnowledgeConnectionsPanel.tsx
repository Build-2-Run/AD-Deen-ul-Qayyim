import React from 'react';
import { useKnowledgeConnections } from '../hooks/useKnowledgeConnections';
import { TopicPanel } from './TopicPanel';
import { PlacesPanel } from './PlacesPanel';
import { PeoplePanel } from './PeoplePanel';
import { ReferencePanel } from './ReferencePanel';
import { TimelinePanel } from './TimelinePanel';
import { RelationGroup } from './RelationGroup';

export const KnowledgeConnectionsPanel: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const connections = useKnowledgeConnections(nodeId);

  const total = Object.values(connections).reduce((acc, curr) => acc + curr.length, 0);

  if (total === 0) {
    return (
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4">Related Knowledge</h3>
        <p className="text-sm text-gray-500">No connections available for this item.</p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h3 className="font-semibold text-lg mb-4">Related Knowledge</h3>
      <TopicPanel relations={connections.topics} sourceId={nodeId} />
      <PlacesPanel relations={connections.places} sourceId={nodeId} />
      <PeoplePanel relations={connections.people} sourceId={nodeId} />
      <ReferencePanel relations={connections.references} sourceId={nodeId} />
      <TimelinePanel relations={connections.timeline} sourceId={nodeId} />
      <RelationGroup title="Other Connections" relations={connections.other} sourceId={nodeId} />
    </div>
  );
};
