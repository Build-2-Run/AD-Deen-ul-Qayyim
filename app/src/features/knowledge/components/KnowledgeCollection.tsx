import { KnowledgeNode } from '../types';
import { KnowledgeCard } from './KnowledgeCard';
import { cn } from '../../../utils/cn';

interface KnowledgeCollectionProps {
  nodes: KnowledgeNode[];
  mode: 'grid' | 'comfortable-list' | 'compact-list';
}

export function KnowledgeCollection({ nodes, mode }: KnowledgeCollectionProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-secondary)]">
        No knowledge nodes found.
      </div>
    );
  }

  // Determine wrapper classes based on mode
  const wrapperClass = cn(
    "w-full",
    mode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    mode === 'comfortable-list' && "flex flex-col gap-12 max-w-4xl mx-auto",
    mode === 'compact-list' && "flex flex-col gap-4 max-w-3xl mx-auto"
  );

  return (
    <div className={wrapperClass}>
      {nodes.map(node => (
        <div key={node.id} className={cn(mode === 'compact-list' && "scale-95 origin-top transform-gpu")}>
          <KnowledgeCard node={node} />
        </div>
      ))}
    </div>
  );
}
