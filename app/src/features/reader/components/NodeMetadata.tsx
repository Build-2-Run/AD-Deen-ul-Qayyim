import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';
import { KnowledgeNode } from '../../../types/knowledge';

export function NodeMetadata({ node }: { node: KnowledgeNode }) {
  return (
    <KnowledgeSurface className="my-8 bg-surface-elevated/30">
      <Typography variant="h3" className="text-tx-primary mb-4 text-lg border-b border-border pb-2">Knowledge Metadata</Typography>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Typography variant="caption" className="text-tx-secondary block">Category</Typography>
          <Typography variant="body" className="text-tx-primary font-bold">{node.category}</Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-tx-secondary block">Status</Typography>
          <Typography variant="body" className="text-tx-primary font-bold">{node.status}</Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-tx-secondary block">Tags</Typography>
          <Typography variant="body" className="text-tx-primary font-bold">
            {node.tags?.map(t => t.label).join(', ') || 'None'}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-tx-secondary block">ID</Typography>
          <Typography variant="caption" className="text-tx-secondary font-mono">{node.id}</Typography>
        </div>
      </div>
    </KnowledgeSurface>
  );
}
