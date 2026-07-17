import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';

export function RelatedKnowledge() {
  const placeholders = [
    { type: 'Related Hadith', desc: 'Narrations providing context or commentary.' },
    { type: 'Related Tafsir', desc: 'Classical exegesis and scholarly interpretations.' },
    { type: 'Related History', desc: 'Events occurring simultaneously.' },
    { type: 'Related Topics', desc: 'Broader categorical associations.' },
    { type: 'Related People', desc: 'Key figures mentioned.' },
    { type: 'Related Places', desc: 'Geographical context.' }
  ];

  return (
    <KnowledgeSurface className="my-8 border-t-4 border-t-primary">
      <Typography variant="h3" className="text-tx-primary mb-6 text-xl">Explore Related Knowledge</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {placeholders.map((item, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-surface border border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
            <Typography variant="body" className="text-tx-primary font-bold mb-1 group-hover:text-primary transition-colors">{item.type}</Typography>
            <Typography variant="caption" className="text-tx-secondary">{item.desc}</Typography>
          </div>
        ))}
      </div>
    </KnowledgeSurface>
  );
}
