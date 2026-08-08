import { Component, ErrorInfo, ReactNode } from 'react';
import { PageContainer, ContentContainer } from '../../design/layout/Containers';
import { Heading } from '../../design/typography/Heading';
import { Body } from '../../design/typography/BasicText';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SharedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in module:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <PageContainer>
          <ContentContainer className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <Heading level={2} size="2xl" className="mb-4 text-red-500">Module Error</Heading>
            <Body variant="secondary" className="max-w-md mx-auto mb-8">
              We encountered a problem loading this part of the application.
            </Body>
            {this.state.error && (
              <pre className="text-left text-xs bg-[var(--surface)] p-4 rounded-lg border border-[var(--border)] overflow-auto max-w-2xl text-[var(--text-secondary)]">
                {this.state.error.message}
              </pre>
            )}
            <button 
              className="mt-8 px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </ContentContainer>
        </PageContainer>
      );
    }

    return this.props.children;
  }
}
