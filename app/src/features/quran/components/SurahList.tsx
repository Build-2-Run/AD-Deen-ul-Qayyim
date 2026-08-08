import { Grid } from '../../../design/primitives/Grid';
import { SurahCard } from './SurahCard';
import type { QuranNode } from '../../../types/quran';

export function SurahList({ nodes, onSelect }: { nodes: QuranNode[]; onSelect: (id: string) => void }) {
  return (
    <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3" gap={6}>
      {nodes.map((node) => (
        <SurahCard key={node.id} node={node} onClick={() => onSelect(node.id)} />
      ))}
    </Grid>
  );
}
