// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FallbackProps } from 'react-error-boundary';

interface Props {
  children?: ReactNode;
  FallbackComponent: React.ComponentType<FallbackProps>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
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

  private resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      return <this.props.FallbackComponent 
        error={this.state.error}
        resetErrorBoundary={this.resetErrorBoundary}
      />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;