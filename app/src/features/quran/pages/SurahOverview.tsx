import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption } from '../../../design/typography/BasicText';
import { Flex } from '../../../design/primitives/Flex';
import { Icon } from '../../../design/icons/Icon';
import { useSurah } from '../hooks/useQuran';
import { QuranAdapter } from '../adapters';
import { ActionBar } from '../../knowledge/components/ActionBar';

export function SurahOverview() {
  const { surahId } = useParams<{ surahId: string }>();
  const navigate = useNavigate();
  const surahNumber = parseInt(surahId || '1', 10);
  
  const { surah, loading, error } = useSurah(surahNumber);

  if (loading) return <div className="p-12 text-center text-[var(--text-secondary)]">Loading Surah...</div>;
  if (error || !surah) return <div className="p-12 text-center text-red-500">Failed to load Surah. {error?.message}</div>;

  const node = QuranAdapter.toSurahNode(surah);

  return (
    <PageContainer>
      <ContentContainer>
        <div className="mb-8">
          <Link to="/quran" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6">
            <Icon name="ArrowLeft" size={16} />
            Back to Quran
          </Link>

          <Flex align="center" justify="between" className="mb-4">
            <div className="flex flex-col">
              <Caption className="text-[var(--primary)] uppercase tracking-widest font-bold mb-2">
                Surah {surah.number}
              </Caption>
              <Heading level={1} size="4xl" className="mb-2">{surah.name.transliteration}</Heading>
              <Heading level={2} size="xl" className="text-[var(--text-secondary)] font-normal">{surah.name.english}</Heading>
            </div>
            <Heading level={1} size="4xl" className="font-arabic text-[var(--text-primary)]">
              {surah.name.arabic}
            </Heading>
          </Flex>

          <Flex align="center" className="gap-6 text-sm text-[var(--text-secondary)] py-4 border-y border-[var(--border)] my-6">
            <Flex align="center" className="gap-2">
              <Icon name="MapPin" size={16} />
              {surah.revelation.type}
            </Flex>
            <Flex align="center" className="gap-2">
              <Icon name="List" size={16} />
              {surah.ayahCount} Ayahs
            </Flex>
          </Flex>

          <Flex className="gap-4">
            <button 
              onClick={() => navigate(`/quran/${surah.number}/read`)}
              className="flex-1 py-4 bg-[var(--primary)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
            >
              <Icon name="BookOpen" size={24} />
              Begin Reading
            </button>
          </Flex>
        </div>

        {/* Action Bar for the Surah Node */}
        <div className="mb-12">
          <ActionBar node={node} />
        </div>

        {/* Future Plugs / Placeholders */}
        <div className="space-y-6">
          <Heading level={3} size="lg" className="mb-4">Explore (Coming Soon)</Heading>
          
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] opacity-50 cursor-not-allowed">
            <Flex align="center" className="gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                <Icon name="Book" size={24} className="text-[var(--text-secondary)]" />
              </div>
              <div>
                <Heading level={4} size="lg">Tafsir & Commentary</Heading>
                <Body variant="secondary" className="text-sm">Deep dive into classical exegesis.</Body>
              </div>
            </Flex>
          </div>

          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] opacity-50 cursor-not-allowed">
            <Flex align="center" className="gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                <Icon name="Headphones" size={24} className="text-[var(--text-secondary)]" />
              </div>
              <div>
                <Heading level={4} size="lg">Audio Recitation</Heading>
                <Body variant="secondary" className="text-sm">Listen to various world-renowned Qaris.</Body>
              </div>
            </Flex>
          </div>
          
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] opacity-50 cursor-not-allowed">
            <Flex align="center" className="gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                <Icon name="Hash" size={24} className="text-[var(--text-secondary)]" />
              </div>
              <div>
                <Heading level={4} size="lg">Themes & Topics</Heading>
                <Body variant="secondary" className="text-sm">Explore the core concepts discussed in this Surah.</Body>
              </div>
            </Flex>
          </div>
        </div>

      </ContentContainer>
    </PageContainer>
  );
}
