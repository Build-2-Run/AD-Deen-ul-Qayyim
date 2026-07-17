import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';

interface AyahProps {
  ayahNumber: number;
  arabic: string;
  translation: string;
}

export function AyahCard({ ayahNumber, arabic, translation }: AyahProps) {
  return (
    <KnowledgeSurface className="mb-4">
      <div className="flex justify-between items-start mb-6 gap-6">
        <div className="w-8 h-8 rounded-full border border-border/60 bg-surface flex-shrink-0 flex items-center justify-center text-xs font-bold text-tx-secondary">
          {ayahNumber}
        </div>
        <Typography variant="h2" className="font-arabic text-right leading-loose text-tx-primary text-3xl">
          {arabic}
        </Typography>
      </div>
      <div className="pt-4 border-t border-border/40">
        <Typography variant="body" className="text-tx-secondary leading-relaxed text-lg">
          {translation}
        </Typography>
      </div>
    </KnowledgeSurface>
  );
}
