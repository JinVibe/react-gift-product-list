import type { GenderFilter, RankingType, Product } from '../types/ranking';

export const fetchRankingProducts = async (filter: GenderFilter, rankingType: RankingType): Promise<Product[]> => {
  const url = filter === 'all' 
    ? `/api/products/ranking?type=${rankingType}` 
    : `/api/products/ranking?gender=${filter}&type=${rankingType}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("API Error");
  
  const data = await res.json();
  const productsData = Array.isArray(data) ? data : data.data || [];
  
  // 비즈니스 로직: rankingType 추가
  const rankingTypes = ['wanted', 'given', 'wished'] as const;
  return productsData.map((p: Product, i: number) => ({
    ...p,
    rankingType: rankingTypes[i % rankingTypes.length]
  }));
}; 