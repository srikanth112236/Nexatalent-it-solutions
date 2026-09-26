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
    console.error('[Website ErrorBoundary caught error]:', error, errorInfo);
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
            maxWidth: '600px',
            backgroundColor: '#111726',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            border: '1px solid #dc2626',
            color: '#f8fafc',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#ef4444' }}>⚠️</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Something went wrong</h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            An unexpected error occurred in the NexaTalent public portal.
          </p>
          {this.state.error && (
            <pre
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#090d16',
                borderRadius: '6px',
                fontSize: '0.825rem',
                color: '#f87171',
                overflowX: 'auto',
                marginBottom: '1.5rem',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
