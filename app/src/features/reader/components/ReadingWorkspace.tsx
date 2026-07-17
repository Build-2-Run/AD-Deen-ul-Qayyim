import { ReactNode } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { ReadingToolbar } from './ReadingToolbar';
import { NodeHeader } from './NodeHeader';
import { NodeMetadata } from './NodeMetadata';
import { NodeReferences } from './NodeReferences';
import { RelatedKnowledge } from './RelatedKnowledge';
import { useReadingSession } from '../hooks/useReadingSession';
import { KnowledgeNode } from '../../../types/knowledge';
import { BreadcrumbItem } from '../types/reader';

interface ReadingWorkspaceProps {
  node: KnowledgeNode;
  breadcrumbs: BreadcrumbItem[];
  arabic?: string;
  translation?: string;
  children?: ReactNode;
}

export function ReadingWorkspace({ node, breadcrumbs, arabic, translation, children }: ReadingWorkspaceProps) {
  const sessionActions = useReadingSession();
  
  const fontClass = [
    'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'
  ][sessionActions.fontSize - 1];

  return (
    <div className={`transition-all duration-500 max-w-5xl mx-auto py-8 px-4 md:px-8 ${sessionActions.isFullscreen ? 'fixed inset-0 z-50 bg-background overflow-y-auto' : ''}`}>
      {!sessionActions.readingMode && <Breadcrumbs items={breadcrumbs} />}
      
      {!sessionActions.readingMode && <ReadingToolbar session={sessionActions} actions={sessionActions} />}
      
      <div className={`${fontClass} transition-all duration-300`}>
        <NodeHeader title={node.title} arabic={arabic} translation={translation} />
        
        <div className="my-10">
          {children}
        </div>
      </div>
      
      {!sessionActions.readingMode && (
        <>
          <NodeMetadata node={node} />
          <NodeReferences references={node.references} />
          <RelatedKnowledge />
        </>
      )}
    </div>
  );
}
