
import React from 'react';
import { ReaderProvider } from './ReaderProvider';
import { ReaderHeader } from './components/ReaderHeader';
import { ReaderToolbar } from './components/ReaderToolbar';
import { ReaderSidebar } from './components/ReaderSidebar';
import { ReaderFooter } from './components/ReaderFooter';
import { ReaderContent } from './components/ReaderContent';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

interface ReaderLayoutProps {
  header?: React.ReactNode;
  toolbar?: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  bottomPanel?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const ReaderLayoutInner: React.FC<ReaderLayoutProps> = (props) => {
  useKeyboardShortcuts();
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      {props.leftSidebar && <ReaderSidebar slot="left">{props.leftSidebar}</ReaderSidebar>}
      
      <div className="flex-1 flex flex-col min-w-0">
        <ReaderHeader>{props.header}</ReaderHeader>
        <ReaderToolbar>{props.toolbar}</ReaderToolbar>
        
        <ReaderContent>{props.children}</ReaderContent>
        
        <ReaderFooter>{props.footer}</ReaderFooter>
      </div>

      {props.rightSidebar && <ReaderSidebar slot="right">{props.rightSidebar}</ReaderSidebar>}
      {props.bottomPanel && <div className="absolute bottom-0 w-full z-20">{props.bottomPanel}</div>}
    </div>
  );
};

export const ReaderLayout: React.FC<ReaderLayoutProps> = (props) => {
  return (
    <ReaderProvider>
      <ReaderLayoutInner {...props} />
    </ReaderProvider>
  );
};
