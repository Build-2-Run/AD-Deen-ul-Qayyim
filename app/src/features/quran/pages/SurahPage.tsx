import { Typography } from '../../../components/ui/Typography';
import { Section } from '../../../components/layout/Section';
import { Bismillah } from '../components/Bismillah';
import { AyahViewer } from '../components/AyahViewer';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';

export function SurahPage() {
  const ayahs = [
    { number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  ];

  return (
    <Section className="animate-in fade-in duration-500 max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <Typography variant="h1" className="text-tx-primary font-arabic mb-3 text-5xl">الفاتحة</Typography>
        <Typography variant="body" className="text-primary uppercase tracking-widest text-sm font-bold">Al-Fatihah</Typography>
      </div>

      <Bismillah />
      
      <div className="mt-8 mb-12">
        <KnowledgeSurface className="bg-surface-elevated/50 border-dashed text-center py-6">
          <Typography variant="h3" className="text-tx-primary mb-1">Surah Information</Typography>
          <Typography variant="caption" className="text-tx-secondary">Metadata and contextual details will appear here.</Typography>
        </KnowledgeSurface>
      </div>

      <div className="mt-10">
        <AyahViewer ayahs={ayahs} />
      </div>

      <div className="mt-16 space-y-6">
        <KnowledgeSurface className="border-dashed text-center py-6">
          <Typography variant="h3" className="text-tx-primary mb-1">Knowledge Connections</Typography>
          <Typography variant="caption" className="text-tx-secondary">(Placeholder) Links to Hadith and Tafsir.</Typography>
        </KnowledgeSurface>

        <KnowledgeSurface className="border-dashed text-center py-6">
          <Typography variant="h3" className="text-tx-primary mb-1">References</Typography>
          <Typography variant="caption" className="text-tx-secondary">(Placeholder) Source citations and evidence levels.</Typography>
        </KnowledgeSurface>

        <KnowledgeSurface className="border-dashed text-center py-6">
          <Typography variant="h3" className="text-tx-primary mb-1">Related Topics</Typography>
          <Typography variant="caption" className="text-tx-secondary">(Placeholder) Tags and historical categories.</Typography>
        </KnowledgeSurface>

        <div className="text-center py-8">
          <Typography variant="caption" className="text-tx-secondary">Revision Information (Placeholder) - Verified Status: Draft</Typography>
        </div>
      </div>
    </Section>
  );
}
