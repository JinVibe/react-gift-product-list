import type { GenderFilter, RankingType, Product } from '../types/ranking';

export const fetchRankingProducts = async (filter: GenderFilter, rankingType: RankingType): Promise<Product[]> => {
  const url = filter === 'all' 
    ? `/api/products/ranking?type=${rankingType}` 
    : `/api/products/ranking?gender=${filter}&type=${rankingType}`;
  
  const res = await fetch(url);
  const data = await res.json();
  console.log('[API] /api/products/ranking 응답:', data);
  if (!res.ok) throw new Error("API Error");
  
  const productsData = Array.isArray(data) ? data : data.data || [];
  return productsData;
}; 