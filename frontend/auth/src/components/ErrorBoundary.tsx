import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Auth ErrorBoundary caught error]:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            padding: '2.5rem',
            margin: '2rem auto',
            maxWidth: '500px',
            backgroundColor: '#111726',
            borderRadius: '12px',
            border: '1px solid #dc2626',
            color: '#f8fafc',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>⚠️</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Authentication Error</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            We encountered an unexpected problem during authentication.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
