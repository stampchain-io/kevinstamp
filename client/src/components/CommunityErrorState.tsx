import React from 'react';
import { cn } from '../lib/utils';
import { APIError } from '../lib/api/communityClient';

interface CommunityErrorStateProps {
  error: APIError;
  onRetry?: () => void;
  className?: string;
}

export default function CommunityErrorState({
  error,
  onRetry,
  className
}: CommunityErrorStateProps) {
  const getErrorDisplay = () => {
    switch (error.code) {
      case 'TIMEOUT':
        return {
          icon: '⏰',
          title: 'Connection Timeout',
          message: 'The connection to Kevin Depot took too long. This might be due to network issues.',
          suggestion: 'Try again in a few moments',
          severity: 'warning' as const
        };

      case 'NETWORK_ERROR':
        return {
          icon: '🌐',
          title: 'Network Connection Failed',
          message: 'Unable to connect to Kevin Depot. Please check your internet connection.',
          suggestion: 'Check your network connection and try again',
          severity: 'error' as const
        };

      case 'HTTP_404':
        return {
          icon: '🔍',
          title: 'Content Not Found',
          message: 'The Kevin Depot page could not be found. It might have moved.',
          suggestion: 'The page might be temporarily unavailable',
          severity: 'warning' as const
        };

      case 'HTTP_500':
      case 'HTTP_502':
      case 'HTTP_503':
        return {
          icon: '🛠️',
          title: 'Server Maintenance',
          message: 'Kevin Depot is currently undergoing maintenance.',
          suggestion: 'Please try again later',
          severity: 'info' as const
        };

      case 'CORS_ERROR':
        return {
          icon: '🔒',
          title: 'Browser Security Block',
          message: 'Your browser blocked the connection to Kevin Depot for security reasons.',
          suggestion: 'Using static community content instead',
          severity: 'info' as const
        };

      default:
        return {
          icon: '⚠️',
          title: 'Connection Issue',
          message: error.message || 'Unable to load community content',
          suggestion: 'Showing cached content if available',
          severity: 'warning' as const
        };
    }
  };

  const display = getErrorDisplay();

  const severityStyles = {
    error: 'border-red-500 bg-red-900/20 text-red-100',
    warning: 'border-yellow-500 bg-yellow-900/20 text-yellow-100',
    info: 'border-blue-500 bg-blue-900/20 text-blue-100'
  };

  return (
    <div className={cn(
      "terminal-window p-6 text-center",
      severityStyles[display.severity],
      className
    )}>
      {/* Error Icon */}
      <div className="text-4xl mb-4 animate-pulse">
        {display.icon}
      </div>

      {/* Error Title */}
      <h3 className="font-pixel text-xl text-kevin-orange mb-3">
        {display.title}
      </h3>

      {/* Error Message */}
      <p className="text-white mb-4 leading-relaxed">
        {display.message}
      </p>

      {/* Suggestion */}
      <p className="text-sm text-kevin-mint mb-6 italic">
        💡 {display.suggestion}
      </p>

      {/* Error Details (in development/debug mode) */}
      {process.env.NODE_ENV === 'development' && error.details && (
        <details className="mb-6 text-left">
          <summary className="cursor-pointer text-kevin-cyan hover:text-white font-pixel text-sm">
            🔧 Technical Details
          </summary>
          <pre className="mt-2 p-3 bg-black rounded text-xs overflow-auto max-h-32">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        </details>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="pixel-btn px-6 py-2 text-black bg-kevin-orange border-kevin-orange hover:bg-opacity-80 transition-colors"
          >
            🔄 RETRY CONNECTION
          </button>
        )}

        <a
          href="https://memedepot.com/d/kevin-depot"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-btn px-6 py-2 text-black bg-kevin-neon border-kevin-neon hover:bg-opacity-80 transition-colors"
        >
          🌐 VISIT KEVIN DEPOT
        </a>
      </div>

      {/* Status Info */}
      <div className="mt-6 pt-4 border-t border-kevin-graphite">
        <div className="text-xs text-kevin-steel">
          <div>Last attempt: {new Date().toLocaleTimeString()}</div>
          <div>Error Code: {error.code}</div>
          {error.retryable && (
            <div className="text-green-400 mt-1">
              ✅ This error is retryable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Specialized error components for different scenarios
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <CommunityErrorState
      error={{
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        retryable: true
      }}
      onRetry={onRetry}
    />
  );
}

export function TimeoutErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <CommunityErrorState
      error={{
        code: 'TIMEOUT',
        message: 'Connection timed out',
        retryable: true
      }}
      onRetry={onRetry}
    />
  );
}

export function ServerErrorState() {
  return (
    <CommunityErrorState
      error={{
        code: 'HTTP_503',
        message: 'Kevin Depot is temporarily unavailable',
        retryable: false
      }}
    />
  );
}
