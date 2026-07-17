import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';
import { SurahMeta } from '../types/quran-ui';

export function SurahCard({ surah, onClick }: { surah: SurahMeta; onClick: () => void }) {
  return (
    <KnowledgeSurface onClick={onClick} className="flex items-center justify-between group py-5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-surface/50 border border-border flex items-center justify-center text-tx-secondary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
          {surah.id}
        </div>
        <div>
          <Typography variant="body" className="font-bold text-tx-primary group-hover:text-primary transition-colors block leading-tight">{surah.nameTransliterated}</Typography>
          <Typography variant="caption" className="text-tx-secondary block mt-1">{surah.nameEnglish}</Typography>
        </div>
      </div>
      <div className="text-right">
        <Typography variant="h3" className="font-arabic text-tx-primary group-hover:text-primary transition-colors text-2xl">{surah.nameArabic}</Typography>
        <Typography variant="caption" className="text-tx-secondary block mt-1">{surah.totalAyahs} Ayahs</Typography>
      </div>
    </KnowledgeSurface>
  );
}
