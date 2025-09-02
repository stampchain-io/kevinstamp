import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface CommunityLoadingStateProps {
  message?: string;
  showProgress?: boolean;
  timeout?: number; // Auto-retry timeout in seconds
  onTimeout?: () => void;
  className?: string;
}

export default function CommunityLoadingState({
  message = "Loading Kevin Depot...",
  showProgress = true,
  timeout = 30, // 30 seconds
  onTimeout,
  className
}: CommunityLoadingStateProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [timeRemaining, setTimeRemaining] = useState(timeout);

  // Animated progress and messages
  useEffect(() => {
    const messages = [
      "Initializing connection...",
      "Scanning for Kevin content...",
      "Fetching memes and videos...",
      "Processing community data...",
      "Almost ready..."
    ];

    let messageIndex = 0;
    let progressValue = 0;

    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 15 + 5; // Random progress increment
      if (progressValue > 100) progressValue = 100;

      setProgress(progressValue);

      // Change message at certain progress points
      if (progressValue > 20 && messageIndex === 0) {
        messageIndex = 1;
        setCurrentMessage(messages[1]);
      } else if (progressValue > 40 && messageIndex === 1) {
        messageIndex = 2;
        setCurrentMessage(messages[2]);
      } else if (progressValue > 70 && messageIndex === 2) {
        messageIndex = 3;
        setCurrentMessage(messages[3]);
      } else if (progressValue > 90 && messageIndex === 3) {
        messageIndex = 4;
        setCurrentMessage(messages[4]);
      }
    }, 500);

    // Countdown timer
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          onTimeout?.();
          clearInterval(timerInterval);
          clearInterval(progressInterval);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
    };
  }, [onTimeout]);

  return (
    <div className={cn(
      "terminal-window p-6 text-center",
      className
    )}>
      {/* KEVIN-themed loading animation */}
      <div className="relative mb-6">
        {/* Outer rotating ring */}
        <div className="w-16 h-16 border-4 border-kevin-neon border-t-transparent rounded-full animate-spin mx-auto"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-2 bg-kevin-orange rounded-full animate-pulse opacity-30"></div>

        {/* Center KEVIN text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-pixel text-kevin-orange text-xs animate-pulse">
            K3V1N
          </div>
        </div>
      </div>

      {/* Loading Message */}
      <h3 className="font-pixel text-xl text-kevin-orange mb-3">
        {currentMessage}
      </h3>

      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-4">
          <div className="w-full bg-kevin-graphite rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-kevin-orange to-kevin-neon transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-kevin-mint mt-1">
            {Math.round(progress)}% complete
          </div>
        </div>
      )}

      {/* Status Messages */}
      <div className="space-y-2 text-sm text-kevin-mint mb-4">
        <div>&gt; Establishing connection to Kevin Depot...</div>
        <div>&gt; Scanning for fresh community content...</div>
        <div>&gt; Processing memes, videos, and GIFs...</div>
        {timeRemaining > 0 && (
          <div>&gt; Auto-retry in {timeRemaining} seconds...</div>
        )}
      </div>

      {/* Loading Dots Animation */}
      <div className="flex justify-center space-x-2 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-kevin-neon rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>

      {/* Timeout Warning */}
      {timeRemaining <= 10 && timeRemaining > 0 && (
        <div className="bg-yellow-900/30 border border-yellow-500 rounded p-3 mb-4">
          <div className="text-yellow-200 text-sm">
            ⚠️ Taking longer than expected... Will retry automatically in {timeRemaining} seconds
          </div>
        </div>
      )}

      {/* Connection Info */}
      <div className="text-xs text-kevin-steel border-t border-kevin-graphite pt-4">
        <div>🔗 Connecting to: memedepot.com/d/kevin-depot</div>
        <div>⏱️  Timeout: {timeout} seconds</div>
        <div>📊 Status: Attempting connection...</div>
      </div>
    </div>
  );
}

// Specialized loading states for different phases
export function CommunityConnectionState({ onCancel }: { onCancel?: () => void }) {
  return (
    <CommunityLoadingState
      message="Connecting to Kevin Depot..."
      timeout={15}
      onTimeout={onCancel}
    />
  );
}

export function CommunityProcessingState() {
  return (
    <CommunityLoadingState
      message="Processing community content..."
      timeout={60}
      showProgress={true}
    />
  );
}

export function CommunityRetryState({ onRetry }: { onRetry?: () => void }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onRetry?.();
    }
  }, [countdown, onRetry]);

  return (
    <div className="terminal-window p-6 text-center">
      <div className="text-4xl mb-4">🔄</div>
      <h3 className="font-pixel text-xl text-kevin-orange mb-3">
        RETRYING CONNECTION
      </h3>
      <p className="text-kevin-mint mb-4">
        Previous attempt failed. Retrying in...
      </p>
      <div className="text-4xl font-pixel text-kevin-neon mb-4">
        {countdown}
      </div>
      <div className="text-xs text-kevin-steel">
        Auto-retry enabled • Click to cancel
      </div>
    </div>
  );
}

// Skeleton loading for gallery grid
export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="gallery-item bg-black border-2 border-kevin-graphite p-2 animate-pulse">
          {/* Image skeleton */}
          <div className="w-full h-32 bg-kevin-graphite rounded mb-2"></div>

          {/* Text skeletons */}
          <div className="space-y-2">
            <div className="h-3 bg-kevin-graphite rounded"></div>
            <div className="h-2 bg-kevin-graphite rounded w-3/4"></div>
            <div className="h-2 bg-kevin-graphite rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
