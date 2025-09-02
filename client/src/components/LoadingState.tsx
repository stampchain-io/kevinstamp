import React from 'react';
import { cn } from '../lib/utils';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showProgress?: boolean;
}

export default function LoadingState({
  message = "Loading...",
  size = 'md',
  className,
  showProgress = false
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4",
      className
    )}>
      {/* KEVIN-themed loading spinner */}
      <div className="relative mb-4">
        <div className={cn(
          "border-2 border-kevin-neon border-t-transparent rounded-full animate-spin",
          sizeClasses[size]
        )} />

        {/* Inner rotating element for extra KEVIN flair */}
        <div className={cn(
          "absolute inset-1 border border-kevin-orange border-b-transparent rounded-full animate-spin",
          sizeClasses[size]
        )}
        style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>

      {/* Loading message */}
      <div className={cn(
        "font-terminal text-kevin-mint text-center",
        textSizeClasses[size]
      )}>
        <div>&gt; {message}</div>
        {showProgress && (
          <div className="mt-2 text-xs opacity-75">
            &gt; Processing KEVIN data...
          </div>
        )}
      </div>

      {/* Progress dots animation */}
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 bg-kevin-orange rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Specialized loading states for different use cases
export function DataLoadingState({ resource = "data" }: { resource?: string }) {
  return (
    <LoadingState
      message={`Loading ${resource}...`}
      showProgress={true}
    />
  );
}

export function ApiLoadingState({ endpoint }: { endpoint: string }) {
  return (
    <div className="terminal-window p-4">
      <div className="font-terminal text-kevin-neon text-sm">
        <div>&gt; Querying {endpoint}...</div>
        <div>&gt; Establishing connection...</div>
        <div>&gt; Processing response...</div>
      </div>
      <LoadingState size="sm" className="mt-3" />
    </div>
  );
}

export function StampLoadingState() {
  return (
    <div className="bg-black bg-opacity-50 border border-kevin-orange p-6 rounded-lg text-center">
      <LoadingState
        message="Loading KEVIN stamps..."
        size="lg"
      />
      <div className="mt-4 font-terminal text-xs text-kevin-mint">
        &gt; Scanning Bitcoin blockchain...
        <br />
        &gt; Manifesting stamp collection...
        <br />
        &gt; FEATURE_NOT_BUG.EXE
      </div>
    </div>
  );
}
