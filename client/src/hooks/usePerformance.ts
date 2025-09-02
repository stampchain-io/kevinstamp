import { useEffect, useState } from 'react';

// Client-side performance monitoring hook
export function usePerformance() {
  const [metrics, setMetrics] = useState<{
    loadTime?: number;
    domContentLoaded?: number;
    firstPaint?: number;
    largestContentfulPaint?: number;
  }>({});

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const updateMetrics = () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (perfData) {
        setMetrics({
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          firstPaint: perfData.responseEnd - perfData.requestStart,
        });
      }
    };

    // Use requestIdleCallback for non-blocking performance monitoring
    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateMetrics);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(updateMetrics, 100);
    }

    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: lastEntry.startTime
          }));
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        return () => lcpObserver.disconnect();
      } catch (e) {
        // Silently fail if LCP is not supported
        console.log('LCP monitoring not supported');
      }
    }
  }, []);

  // Log metrics for development (Replit-compatible)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && Object.keys(metrics).length > 0) {
      console.log('🚀 KEVIN Performance Metrics:', metrics);
    }
  }, [metrics]);

  return metrics;
}

// Utility function for tracking page views (client-side only)
export function trackPageView(page: string) {
  if (typeof window === 'undefined') return;

  console.log(`📊 Page view: ${page}`, {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
}

// Utility function for tracking user interactions (client-side only)
export function trackInteraction(action: string, details?: any) {
  if (typeof window === 'undefined') return;

  console.log(`👆 User interaction: ${action}`, {
    timestamp: new Date().toISOString(),
    details
  });
}

// Hook for monitoring component render performance
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();

    return () => {
      const renderTime = performance.now() - startTime;
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
}
