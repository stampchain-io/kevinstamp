import { useEffect, useRef, useState } from 'react';

// Hook for intersection observer - lazy loading images
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
}

// Specialized hook for lazy image loading
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (hasIntersected && !isLoaded) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        setHasError(false);
      };
      img.onerror = () => {
        setHasError(true);
        // Keep placeholder if available, otherwise show error state
        if (!placeholder) {
          setImageSrc('');
        }
      };
    }
  }, [hasIntersected, src, isLoaded, placeholder]);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    hasError,
    shouldLoad: hasIntersected
  };
}

// Hook for observing multiple elements
export function useMultipleIntersectionObserver(count: number, options?: IntersectionObserverInit) {
  const [intersectingElements, setIntersectingElements] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLElement | null)[]>(Array(count).fill(null));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newIntersecting = new Set(intersectingElements);

        entries.forEach((entry) => {
          const index = refs.current.indexOf(entry.target as HTMLElement);
          if (index !== -1) {
            if (entry.isIntersecting) {
              newIntersecting.add(index);
            } else {
              newIntersecting.delete(index);
            }
          }
        });

        setIntersectingElements(newIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [count, intersectingElements, options]);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  };

  const isIntersecting = (index: number) => intersectingElements.has(index);

  return { setRef, isIntersecting, intersectingCount: intersectingElements.size };
}
