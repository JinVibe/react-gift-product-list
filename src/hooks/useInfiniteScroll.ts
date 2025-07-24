import { useCallback } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseInfiniteScrollOptions {
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export const useInfiniteScroll = (
  onLoadMore: () => void,
  hasMore: boolean,
  loading: boolean,
  error?: any,
  options: UseInfiniteScrollOptions = {}
) => {
  const { enabled = true, rootMargin = '100px', threshold = 0.1 } = options;

  const handleIntersection = useCallback(
    (isIntersecting: boolean) => {
      if (isIntersecting && hasMore && !loading && !error && enabled) {
        onLoadMore();
      }
    },
    [hasMore, loading, error, enabled, onLoadMore]
  );

  const { ref, isIntersecting } = useIntersectionObserver(handleIntersection, {
    rootMargin,
    threshold,
    enabled,
  });

  return { ref, isIntersecting };
}; 