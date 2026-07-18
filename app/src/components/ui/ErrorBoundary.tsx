import { Component, ErrorInfo, ReactNode } from 'react';
import { Typography } from './Typography';
import { Retry } from './Retry';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="p-8 border border-red-500/30 bg-red-500/5 rounded-xl text-center mx-auto max-w-lg mt-8" role="alert">
          <Typography variant="h3" className="text-red-600 dark:text-red-400 mb-2">Something went wrong.</Typography>
          <Typography variant="body" className="text-gray-600 dark:text-gray-400 mb-6">{this.state.error?.message}</Typography>
          <Retry onRetry={() => this.setState({ hasError: false, error: null })} />
        </div>
      );
    }
    return this.props.children;
  }
}
