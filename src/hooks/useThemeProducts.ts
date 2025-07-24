import { useState, useEffect, useCallback } from 'react';
import { fetchThemeProducts } from '../api/themes';
import type { ThemeProduct } from '../api/themes';
import type { AppError } from '../constants/errors';

export const useThemeProducts = (themeId: number) => {
  const [products, setProducts] = useState<ThemeProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || error) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchThemeProducts(themeId, cursor, 10);
      
      setProducts(prev => [...prev, ...data.list]);
      setCursor(data.cursor);
      setHasMore(data.hasMoreList);
      setInitialized(true);
    } catch (err: any) {
      setError(err);
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, [themeId, cursor, loading, hasMore, error]);

  // 테마가 변경되면 초기화
  useEffect(() => {
    setProducts([]);
    setCursor(0);
    setHasMore(true);
    setError(null);
    setInitialized(false);
  }, [themeId]);

  // 초기 로딩 (에러가 없을 때만)
  useEffect(() => {
    if (!initialized && !loading && !error) {
      loadMore();
    }
  }, [loadMore, initialized, loading, error]);

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore,
  };
}; 