import type { GenderFilter, RankingType, Product } from "../types/ranking";

const targetTypeMap: Record<GenderFilter, string> = {
  all: "ALL",
  male: "MALE",
  female: "FEMALE",
  teen: "TEEN",
};

const rankTypeMap: Record<RankingType, string> = {
  wanted: "MANY_WISH",
  given: "MANY_RECEIVE",
  wished: "MANY_WISH_RECEIVE",
};

export const fetchRankingProducts = async (
  filter: GenderFilter,
  rankingType: RankingType,
): Promise<Product[]> => {
  const url = `/api/products/ranking?targetType=${targetTypeMap[filter]}&rankType=${rankTypeMap[rankingType]}`;

  const res = await fetch(url);
  const data = await res.json();
  console.log("[API] /api/products/ranking 응답:", data);
  if (!res.ok) throw new Error("API Error");

  const productsData = Array.isArray(data) ? data : data.data || [];
  return productsData;
};
