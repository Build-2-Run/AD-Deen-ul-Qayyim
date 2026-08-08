import { Flex } from '../../../design/primitives/Flex';
import { Caption } from '../../../design/typography/BasicText';
import { Icon } from '../../../design/icons/Icon';
import { BreadcrumbItem } from '../types';
import { Fragment } from 'react';

interface KnowledgeBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function KnowledgeBreadcrumb({ items }: KnowledgeBreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <Flex align="center" className="gap-2 mb-2 overflow-x-auto pb-1 hide-scrollbar">
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <Caption className="text-[#f5c75d] whitespace-nowrap uppercase tracking-widest font-bold text-[10px] hover:underline cursor-pointer transition-colors">
            {item.label}
          </Caption>
          {index < items.length - 1 && (
            <Icon name="ChevronRight" size={12} className="text-[#f5c75d]/50 flex-shrink-0" />
          )}
        </Fragment>
      ))}
    </Flex>
  );
}
