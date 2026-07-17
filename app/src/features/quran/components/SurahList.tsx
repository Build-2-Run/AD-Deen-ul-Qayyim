import { Grid } from '../../../components/layout/Grid';
import { SurahCard } from './SurahCard';
import type { QuranNode } from '../../../types/quran';

export function SurahList({ nodes, onSelect }: { nodes: QuranNode[]; onSelect: (id: string) => void }) {
  return (
    <Grid cols={1} mdCols={2} lgCols={3} gap={4}>
      {nodes.map((node) => (
        <SurahCard key={node.id} node={node} onClick={() => onSelect(node.id)} />
      ))}
    </Grid>
  );
}
