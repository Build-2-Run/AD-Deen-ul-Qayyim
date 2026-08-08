import { Flex } from '../../../design/primitives/Flex';
import { Stack } from '../../../design/primitives/Stack';
import { Heading } from '../../../design/typography/Heading';
import { Caption } from '../../../design/typography/BasicText';
import { KnowledgeBreadcrumb } from './KnowledgeBreadcrumb';
import { BreadcrumbItem } from '../types';

interface KnowledgeHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function KnowledgeHeader({ title, subtitle, breadcrumbs }: KnowledgeHeaderProps) {
  return (
    <Stack space={2} className="mb-4">
      {breadcrumbs && <KnowledgeBreadcrumb items={breadcrumbs} />}
      <Flex direction="col" className="gap-1">
        <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl leading-tight" style={{ textShadow: '0 0 12px rgba(245,199,93,0.3)' }}>{title}</Heading>
        {subtitle && <Caption className="text-white/70 text-sm">{subtitle}</Caption>}
      </Flex>
    </Stack>
  );
}
