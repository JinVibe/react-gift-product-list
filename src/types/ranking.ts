export type GenderFilter = 'all' | 'male' | 'female' | 'teen';

export const rankingTypeOptions = [
  { key: 'wanted', label: '받고 싶어한' },
  { key: 'given', label: '많이 선물한' },
  { key: 'wished', label: '위시로 받은' },
] as const;

export type RankingType = typeof rankingTypeOptions[number]['key'];

export type Product = {
  id: number;
  name: string;
  imageURL: string;
  brandInfo?: { name: string };
  price?: { sellingPrice: number };
  rankingType?: RankingType;
}; 