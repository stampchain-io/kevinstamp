import React, { useEffect, useState } from 'react';

// Performance optimization component for Core Web Vitals
export default function PerformanceOptimizer() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark when the page becomes interactive
    const handleLoad = () => {
      setIsLoaded(true);

      // Report Core Web Vitals (simplified)
      try {
        // Use Performance API directly for basic metrics
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          console.log('Performance metrics:', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstPaint: perfData.responseEnd - perfData.requestStart
          });
        }
      } catch (err) {
        console.warn('Performance monitoring not available:', err);
      }

      // Preload critical resources
      preloadCriticalResources();

      // Enable passive listeners for better scroll performance
      enablePassiveListeners();
    };

    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Lazy load non-critical scripts
        lazyLoadScripts();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(lazyLoadScripts, 2000);
    }

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Preload critical resources
  const preloadCriticalResources = () => {
    // Preload hero images
    const heroImages = [
      '/kevin-original.png',
      // Add other critical images
    ];

    heroImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });

    // Preconnect to external domains
    const domains = [
      'https://stampchain.io',
      'https://openstamp.io',
      'https://memedepot.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };

  // Enable passive listeners for better scroll performance
  const enablePassiveListeners = () => {
    // Add passive listeners to scroll events
    const options = { passive: true, capture: false };

    document.addEventListener('touchstart', () => {}, options);
    document.addEventListener('touchmove', () => {}, options);
    document.addEventListener('wheel', () => {}, options);
  };

  // Lazy load non-critical scripts
  const lazyLoadScripts = () => {
    // Load analytics after page becomes interactive
    if (!(window as any).gtag && process.env.NODE_ENV === 'production') {
      loadGoogleAnalytics();
    }

    // Load social media widgets
    loadSocialWidgets();
  };

  // Load Google Analytics with performance optimizations
  const loadGoogleAnalytics = () => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    };
  };

  // Load social media widgets lazily
  const loadSocialWidgets = () => {
    // Twitter widget
    const twitterScript = document.createElement('script');
    twitterScript.src = 'https://platform.twitter.com/widgets.js';
    twitterScript.async = true;
    twitterScript.defer = true;
    document.body.appendChild(twitterScript);

    // Facebook SDK (if needed)
    // const fbScript = document.createElement('script');
    // fbScript.src = 'https://connect.facebook.net/en_US/sdk.js';
    // fbScript.async = true;
    // fbScript.defer = true;
    // document.body.appendChild(fbScript);
  };

  // Resource hints for better performance
  useEffect(() => {
    // Add resource hints to document head
    const hints = [
      { rel: 'dns-prefetch', href: '//stampchain.io' },
      { rel: 'dns-prefetch', href: '//openstamp.io' },
      { rel: 'dns-prefetch', href: '//memedepot.com' },
      { rel: 'preconnect', href: '//fonts.googleapis.com', crossorigin: true },
      { rel: 'preconnect', href: '//fonts.gstatic.com', crossorigin: true }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossorigin) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }, []);

  return null; // This component doesn't render anything
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  useEffect(() => {
    // Monitor Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      // Report LCP to analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'LCP',
          value: Math.round(lastEntry.startTime),
          custom_map: { metric_value: lastEntry.startTime }
        });
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Fallback for browsers that don't support LCP
    }

    return () => observer.disconnect();
  }, []);
}

// Image optimization component
export function OptimizedImage({ src, alt, className, loading = 'lazy', ...props }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
      loading={loading}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      decoding="async"
      fetchpriority={loading === 'eager' ? 'high' : 'auto'}
      {...props}
    />
  );
}

// Critical CSS inlining component
export function CriticalCSSInjector({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Extract critical CSS for above-the-fold content
    const extractCriticalCSS = () => {
      // This would typically use a library like 'critical'
      // For now, we'll preload the main CSS
      const link = document.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;
      if (link) {
        link.rel = 'preload';
        link.as = 'style';
        link.onload = () => {
          link.rel = 'stylesheet';
        };
      }
    };

    extractCriticalCSS();
  }, []);

  return <>{children}</>;
}
