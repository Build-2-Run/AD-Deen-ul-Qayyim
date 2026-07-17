import { Component, ErrorInfo, ReactNode } from 'react';
import { Typography } from './Typography';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 border border-red-500/30 bg-red-500/10 rounded-xl text-center">
          <Typography variant="h3" className="text-red-500 mb-2">Unable to load Quran data.</Typography>
          <Typography variant="body" className="text-tx-secondary mb-4">{this.state.error?.message}</Typography>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-surface text-tx-primary rounded-lg border border-border hover:bg-surface-elevated transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
