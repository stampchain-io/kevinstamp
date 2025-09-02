import React from 'react';
import { useLazyImage } from '../hooks/useIntersectionObserver';
import { cn } from '../lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  showLoadingIndicator?: boolean;
  fallbackSrc?: string;
}

export default function LazyImage({
  src,
  alt,
  placeholder,
  className,
  containerClassName,
  showLoadingIndicator = false,
  fallbackSrc,
  ...props
}: LazyImageProps) {
  const { ref, src: imageSrc, isLoaded, hasError, shouldLoad } = useLazyImage(src, placeholder);

  // Default placeholder with KEVIN theme
  const defaultPlaceholder = placeholder || `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a1a1a"/>
      <text x="50%" y="50%" font-family="monospace" font-size="16" fill="#ff6b35" text-anchor="middle" dy=".3em">K3V1N</text>
      <text x="50%" y="70%" font-family="monospace" font-size="12" fill="#00ff88" text-anchor="middle" dy=".3em">Loading...</text>
    </svg>
  `)}`;

  return (
    <div className={cn("relative overflow-hidden", containerClassName)} ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Loading indicator */}
      {showLoadingIndicator && shouldLoad && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-kevin-charcoal">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-kevin-neon border-t-transparent rounded-full animate-spin"></div>
            <span className="text-kevin-mint text-xs font-pixel">Loading...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-kevin-charcoal border-2 border-red-500">
          <div className="text-center p-4">
            <div className="text-red-400 text-2xl mb-2">⚠️</div>
            <div className="text-red-300 text-xs font-pixel">Failed to load</div>
            {fallbackSrc && (
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-xs text-kevin-orange hover:text-kevin-neon underline"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={hasError && fallbackSrc ? fallbackSrc : imageSrc || defaultPlaceholder}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-60",
          hasError ? "filter grayscale" : "",
          className
        )}
        style={{
          imageRendering: 'pixelated',
          ...props.style
        }}
        {...props}
      />

      {/* Success indicator (dev mode only) */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"
             title="Image loaded successfully"></div>
      )}
    </div>
  );
}

// Specialized component for gallery images
export function GalleryLazyImage({ src, alt, ...props }: LazyImageProps) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      placeholder={`data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#1a1a1a"/>
          <rect x="50%" y="50%" width="100" height="8" fill="#ff6b35" transform="translate(-50, -4)"/>
          <text x="50%" y="70%" font-family="monospace" font-size="12" fill="#00ff88" text-anchor="middle" dy=".3em">KEVIN</text>
        </svg>
      `)}`}
      className="w-full h-32 object-contain pixel-perfect transition-transform duration-200 hover:scale-105 bg-kevin-charcoal"
      showLoadingIndicator={false}
      loading="lazy"
      {...props}
    />
  );
}

// Hook for preloading images
export function useImagePreloader() {
  const preloadImage = React.useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const preloadImages = React.useCallback(async (srcs: string[]): Promise<void[]> => {
    return Promise.all(srcs.map(src => preloadImage(src)));
  }, [preloadImage]);

  return { preloadImage, preloadImages };
}
