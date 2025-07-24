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
  options: UseInfiniteScrollOptions = {}
) => {
  const { enabled = true, rootMargin = '100px', threshold = 0.1 } = options;

  const handleIntersection = useCallback(
    (isIntersecting: boolean) => {
      if (isIntersecting && hasMore && !loading && enabled) {
        onLoadMore();
      }
    },
    [hasMore, loading, enabled, onLoadMore]
  );

  const { ref, isIntersecting } = useIntersectionObserver(handleIntersection, {
    rootMargin,
    threshold,
    enabled,
  });

  return { ref, isIntersecting };
}; 