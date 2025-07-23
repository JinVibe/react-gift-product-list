import { useState, useEffect, useCallback } from 'react';
import { fetchThemeProducts } from '../api/themes';
import type { ThemeProduct } from '../api/themes';

export const useThemeProducts = (themeId: number) => {
  const [products, setProducts] = useState<ThemeProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchThemeProducts(themeId, cursor, 10);
      
      setProducts(prev => [...prev, ...data.list]);
      setCursor(data.cursor);
      setHasMore(data.hasMoreList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [themeId, cursor, loading, hasMore]);

  // 테마가 변경되면 초기화
  useEffect(() => {
    setProducts([]);
    setCursor(0);
    setHasMore(true);
    setError(null);
  }, [themeId]);

  // 초기 로딩
  useEffect(() => {
    if (products.length === 0 && !loading) {
      loadMore();
    }
  }, [loadMore, products.length, loading]);

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore,
  };
}; 