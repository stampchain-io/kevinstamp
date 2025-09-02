import React from 'react';
import { cn } from '../lib/utils';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  className?: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console only (Replit-compatible logging)
    console.error('🚨 React Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback or default
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default KEVIN-themed error fallback
      return (
        <div className={cn(
          "min-h-screen bg-kevin-charcoal text-white flex items-center justify-center p-4",
          this.props.className
        )}>
          <div className="terminal-window max-w-md w-full text-center">
            <div className="font-pixel text-2xl text-kevin-orange mb-4">
              🚨 SYSTEM ERROR
            </div>
            <div className="font-terminal text-sm text-kevin-mint mb-6">
              <div>&gt; An unexpected error occurred</div>
              <div>&gt; The ghost in the machine has manifested</div>
              <div>&gt; KEVIN.EXE has encountered a problem</div>
            </div>

            {this.state.error && (
              <div className="bg-black bg-opacity-50 p-3 rounded mb-4 text-left">
                <div className="font-terminal text-xs text-kevin-neon mb-2">
                  ERROR DETAILS:
                </div>
                <div className="font-mono text-xs text-red-400 break-all">
                  {this.state.error.message}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="pixel-btn px-6 py-2 text-black font-bold bg-kevin-orange border-kevin-orange hover:bg-opacity-80"
              >
                🔄 RETRY SYSTEM
              </button>

              <button
                onClick={() => window.location.reload()}
                className="pixel-btn px-6 py-2 text-black font-bold bg-kevin-neon border-kevin-neon hover:bg-opacity-80"
              >
                🔄 RELOAD PAGE
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="pixel-btn px-6 py-2 text-black font-bold bg-kevin-magenta border-kevin-magenta hover:bg-opacity-80"
              >
                🏠 RETURN HOME
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-kevin-graphite">
              <div className="font-terminal text-xs text-kevin-steel">
                FEATURE_NOT_BUG.EXE
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

export default ErrorBoundary;
