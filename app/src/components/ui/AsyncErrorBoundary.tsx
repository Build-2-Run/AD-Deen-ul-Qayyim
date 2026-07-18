import { Component, ErrorInfo, ReactNode } from 'react';
import { Typography } from './Typography';
import { Retry } from './Retry';

interface Props {
  children?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AsyncErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Async Error Caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg" role="alert">
          <Typography variant="h3" className="text-gray-800 dark:text-gray-200 mb-2">Failed to load content</Typography>
          <Typography variant="body" className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{this.state.error?.message}</Typography>
          <Retry onRetry={this.handleRetry} />
        </div>
      );
    }
    return this.props.children;
  }
}
