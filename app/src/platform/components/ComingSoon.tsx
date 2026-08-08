import { PageContainer, ContentContainer } from '../../design/layout/Containers';
import { Heading } from '../../design/typography/Heading';
import { Body } from '../../design/typography/BasicText';

export const ComingSoon = ({ title }: { title: string }) => (
  <PageContainer>
    <ContentContainer className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Heading level={1} size="4xl" className="mb-4">{title}</Heading>
      <div className="bg-[var(--surface)] px-6 py-3 rounded-full border border-[var(--border)] mt-4">
        <Body variant="secondary">Module In Development</Body>
      </div>
    </ContentContainer>
  </PageContainer>
);
