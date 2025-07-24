import { useEffect, useRef, useCallback, useState } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
}

export const useIntersectionObserver = (
  callback: (isIntersecting: boolean) => void,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
  const {
    root = null,
    rootMargin = '100px',
    threshold = 0.1,
    enabled = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const intersecting = entry.isIntersecting;
      setIsIntersecting(intersecting);
      callback(intersecting);
    },
    [callback]
  );

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [handleIntersection, root, rootMargin, threshold, enabled]);

  return { ref, isIntersecting };
}; 