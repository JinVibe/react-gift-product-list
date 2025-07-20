import { useState, useEffect } from 'react';
import { fetchRankingProducts } from '../api/ranking';
import type { GenderFilter, RankingType, Product } from '../types/ranking';

export const useRankingProducts = (filter: GenderFilter, rankingType: RankingType) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetchRankingProducts(filter, rankingType)
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter, rankingType]);

  return { products, loading, error };
}; 