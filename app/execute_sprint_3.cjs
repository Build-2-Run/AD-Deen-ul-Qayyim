const fs = require('fs');
const path = require('path');

const write = (relPath, content) => {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
};

write('src/features/reader/types/reader.ts', `
export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface ReadingSessionState {
  fontSize: number;
  readingMode: boolean;
  currentNodeId: string | null;
  bookmarks: string[];
  scrollPosition: number;
  isFullscreen: boolean;
}
`);

write('src/features/reader/hooks/useReadingSession.ts', `
import { useState, useCallback } from 'react';
import { ReadingSessionState } from '../types/reader';

export function useReadingSession() {
  const [session, setSession] = useState<ReadingSessionState>({
    fontSize: 2,
    readingMode: false,
    currentNodeId: null,
    bookmarks: [],
    scrollPosition: 0,
    isFullscreen: false,
  });

  const increaseFont = useCallback(() => {
    setSession(s => ({ ...s, fontSize: Math.min(s.fontSize + 1, 5) }));
  }, []);

  const decreaseFont = useCallback(() => {
    setSession(s => ({ ...s, fontSize: Math.max(s.fontSize - 1, 1) }));
  }, []);

  const toggleReadingMode = useCallback(() => {
    setSession(s => ({ ...s, readingMode: !s.readingMode }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setSession(s => ({ ...s, isFullscreen: !s.isFullscreen }));
  }, []);

  const toggleBookmark = useCallback((nodeId: string) => {
    setSession(s => {
      const isBookmarked = s.bookmarks.includes(nodeId);
      return {
        ...s,
        bookmarks: isBookmarked 
          ? s.bookmarks.filter(id => id !== nodeId)
          : [...s.bookmarks, nodeId]
      };
    });
  }, []);

  return {
    ...session,
    increaseFont,
    decreaseFont,
    toggleReadingMode,
    toggleFullscreen,
    toggleBookmark,
  };
}
`);

write('src/features/reader/components/Breadcrumbs.tsx', `
import { Typography } from '../../../components/ui/Typography';
import { BreadcrumbItem } from '../types/reader';

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-tx-secondary text-sm">↓</span>}
          <Typography variant="caption" className={\`uppercase tracking-wider font-bold \${index === items.length - 1 ? 'text-primary' : 'text-tx-secondary cursor-pointer hover:text-primary transition-colors'}\`}>
            {item.label}
          </Typography>
        </div>
      ))}
    </div>
  );
}
`);

write('src/features/reader/components/ReadingToolbar.tsx', `
export function ReadingToolbar({ session, actions }: any) {
  const btnClass = "p-2 rounded-lg bg-surface hover:bg-surface-elevated text-tx-secondary hover:text-primary border border-border transition-colors text-sm font-medium";
  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-b border-border/50 mb-6">
      <button className={btnClass} onClick={actions.decreaseFont} title="Decrease Font">A-</button>
      <button className={btnClass} onClick={actions.increaseFont} title="Increase Font">A+</button>
      <div className="h-6 w-px bg-border mx-2"></div>
      <button className={btnClass} title="Copy">Copy</button>
      <button className={btnClass} onClick={() => actions.toggleBookmark('mock-id')} title="Bookmark">
        {session.bookmarks.includes('mock-id') ? 'Bookmarked' : 'Bookmark'}
      </button>
      <button className={btnClass} title="Share (Placeholder)">Share</button>
      <div className="h-6 w-px bg-border mx-2"></div>
      <button className={btnClass} onClick={actions.toggleFullscreen} title="Fullscreen">Fullscreen</button>
      <button className={btnClass} onClick={actions.toggleReadingMode} title="Reading Mode">
        {session.readingMode ? 'Exit Reading Mode' : 'Reading Mode'}
      </button>
    </div>
  );
}
`);

write('src/features/reader/components/NodeHeader.tsx', `
import { Typography } from '../../../components/ui/Typography';

export function NodeHeader({ title, arabic, translation }: { title: string, arabic?: string, translation?: string }) {
  return (
    <div className="mb-10 text-center md:text-left">
      <Typography variant="h1" className="text-tx-primary mb-4 text-4xl">{title}</Typography>
      {arabic && (
        <Typography variant="h2" className="text-tx-primary font-arabic text-3xl mb-4 leading-loose text-right md:text-left">
          {arabic}
        </Typography>
      )}
      {translation && (
        <Typography variant="body" className="text-tx-secondary text-lg leading-relaxed border-l-4 border-primary pl-4">
          {translation}
        </Typography>
      )}
    </div>
  );
}
`);

write('src/features/reader/components/NodeMetadata.tsx', `
import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';
import { KnowledgeNode } from '../../../types/knowledge';

export function NodeMetadata({ node }: { node: KnowledgeNode }) {
  return (
    <KnowledgeSurface className="my-8 bg-surface-elevated/30">
      <Typography variant="h3" className="text-tx-primary mb-4 text-lg border-b border-border pb-2">Knowledge Metadata</Typography>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Typography variant="caption" className="text-tx-secondary block">Category</Typography>
          <Typography variant="body" className="text-tx-primary font-bold">{node.category}</Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-tx-secondary block">Status</Typography>
          <Typography variant="body" className="text-tx-primary font-bold">{node.status}</Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-tx-secondary block">Tags</Typography>
          <Typography variant="body" className="text-tx-primary font-bold">
            {node.tags?.map(t => t.label).join(', ') || 'None'}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-tx-secondary block">ID</Typography>
          <Typography variant="caption" className="text-tx-secondary font-mono">{node.id}</Typography>
        </div>
      </div>
    </KnowledgeSurface>
  );
}
`);

write('src/features/reader/components/NodeReferences.tsx', `
import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';
import { Reference } from '../../../types/common';

export function NodeReferences({ references }: { references?: Reference[] }) {
  if (!references || references.length === 0) {
    return (
      <KnowledgeSurface className="my-8 border-dashed">
        <Typography variant="h3" className="text-tx-primary mb-2 text-lg">References</Typography>
        <Typography variant="caption" className="text-tx-secondary">No formal references attached.</Typography>
      </KnowledgeSurface>
    );
  }

  return (
    <KnowledgeSurface className="my-8">
      <Typography variant="h3" className="text-tx-primary mb-4 text-lg border-b border-border pb-2">References</Typography>
      <ul className="list-disc pl-5 space-y-2">
        {references.map(ref => (
          <li key={ref.id} className="text-tx-secondary">
            <span className="text-tx-primary font-bold">{ref.title}</span> 
            {ref.volume && \` - Vol \${ref.volume}\`}
            {ref.page && \`, Page \${ref.page}\`}
          </li>
        ))}
      </ul>
    </KnowledgeSurface>
  );
}
`);

write('src/features/reader/components/RelatedKnowledge.tsx', `
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
`);

write('src/features/reader/components/ReadingWorkspace.tsx', `
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
    <div className={\`transition-all duration-500 max-w-5xl mx-auto py-8 px-4 md:px-8 \${sessionActions.isFullscreen ? 'fixed inset-0 z-50 bg-background overflow-y-auto' : ''}\`}>
      {!sessionActions.readingMode && <Breadcrumbs items={breadcrumbs} />}
      
      {!sessionActions.readingMode && <ReadingToolbar session={sessionActions} actions={sessionActions} />}
      
      <div className={\`\${fontClass} transition-all duration-300\`}>
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
`);

write('src/features/reader/README.md', `
# Reading Workspace Feature

This directory encapsulates the universal \`ReadingWorkspace\`. It acts as a super-component container meant to wrap any core content piece (Quran Surah, Hadith, History article, Fiqh ruling).

By abstracting this layout, we guarantee that the UX across all modules of AD-Deen-ul-Qayyim is 100% consistent. It provides standardized breadcrumbs, reading modes, toolbars, metadata inspection, citations, and related knowledge discovery.
`);

write('../docs/Engineering/Phase-7-Reading-Workspace.md', `
# AD-Deen-ul-Qayyim

# Phase 7: Reading Workspace (Sprint 3)

## Overview
We built the universal \`ReadingWorkspace\`—the core presentation shell that will be used to display any individual Knowledge Node (be it Quran, Hadith, Seerah, etc.) across the entire application.

This guarantees that every domain module shares a perfectly consistent interface. 

---

## 1. Component Hierarchy
- \`ReadingWorkspace\`: The master layout wrapper. Controls fullscreen status and integrates the hook.
  - \`Breadcrumbs\`: A hierarchical navigation path (e.g. Home > Quran > Al-Fatihah).
  - \`ReadingToolbar\`: Universal actions (A+, A-, Copy, Bookmark, Fullscreen, Reading Mode).
  - \`NodeHeader\`: Primary typography container supporting Title, Arabic text, and primary translation.
  - \`Main Content\`: Injected via React \`children\` (e.g., AyahViewer from the Quran module).
  - \`NodeMetadata\`: Exposes Graph attributes (Status, Category, Tags, Internal ID).
  - \`NodeReferences\`: A clean list of citations conforming to the \`Reference\` type.
  - \`RelatedKnowledge\`: A navigational springboard highlighting connections like "Related Hadith", "Related Tafsir", and "Related Topics".

---

## 2. useReadingSession Hook
An internal state manager created to handle reader preferences:
- \`fontSize\`: Number 1-5 that directly controls Tailwind text size classes on the reading container.
- \`readingMode\`: A boolean. When activated, all chrome (breadcrumbs, toolbars, metadata, connections) disappears, leaving only the primary text for an immersive, distraction-free experience.
- \`isFullscreen\`: Breaks the component out of the layout shell into an absolute fixed overlay.
- \`bookmarks\`: Maintains local state for bookmarked node IDs (placeholder for future persistent auth).

---

## 3. Reusability and Future Integrations
The workspace takes a fully typed \`KnowledgeNode\` as its primary prop. Because every domain module (QuranNode, HadithNode, HistoryNode) explicitly extends \`KnowledgeNode\`, this workspace is strictly type-compatible with the entirety of the platform's content out of the box.

When the Graph Engine is completed, clicking on the "Related Topics" or "Related Tafsir" cards will simply dispatch a router navigation event, loading the new Node into this exact same Workspace.
`);

console.log('Sprint 3 Reading Workspace generated successfully.');
