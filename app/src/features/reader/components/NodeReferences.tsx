import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';
import { Reference } from '../../../types/common';

export function NodeReferences({ references }: { references?: Reference[] }) {
  if (!references || references.length === 0) {
    return (
      <KnowledgeSurface className="my-8 border-dashed">
        <Typography variant="h3" className="text-tx-primary mb-2 text-lg">References</Typography>
        <Typography variant="caption" className="text-tx-secondary">No formal references attached.</Typography>
      </KnowledgeSurface>
    );
  }

  return (
    <KnowledgeSurface className="my-8">
      <Typography variant="h3" className="text-tx-primary mb-4 text-lg border-b border-border pb-2">References</Typography>
      <ul className="list-disc pl-5 space-y-2">
        {references.map(ref => (
          <li key={ref.id} className="text-tx-secondary">
            <span className="text-tx-primary font-bold">{ref.title}</span> 
            {ref.volume && ` - Vol ${ref.volume}`}
            {ref.page && `, Page ${ref.page}`}
          </li>
        ))}
      </ul>
    </KnowledgeSurface>
  );
}
