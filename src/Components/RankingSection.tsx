import React, { useEffect, useState } from "react";
import styled from '@emotion/styled';

// 필터 타입 및 옵션 정의
type GenderFilter = 'all' | 'male' | 'female' | 'teen';
const filterOptions: { key: GenderFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'male', label: '남자' },
  { key: 'female', label: '여자' },
  { key: 'teen', label: '청소년' },
];

type Product = {
  id: number;
  name: string;
  imageURL: string;
  brandInfo?: { name: string };
  price?: { sellingPrice: number };
};

const Section = styled.section`
  width: 100%;
  margin: 40px 0 0 0;
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.title1Bold};
  color: ${({ theme }) => theme.colors.gray.gray900};
  margin-bottom: 18px;
  text-align: left;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 18px;
  justify-content: center;
`;

const FilterBtn = styled.button<{active?: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({active, theme}) => active ? theme.colors.blue.blue700 : theme.colors.gray.gray100};
  color: ${({active, theme}) => active ? theme.colors.gray.gray00 : theme.colors.gray.gray900};
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: none;
  margin-bottom: 4px;
  transition: background 0.2s;
`;

const FilterLabel = styled.span`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.gray.gray900};
  margin-top: 2px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 16px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: ${({ theme }) => theme.colors.gray.gray00};
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  padding: 18px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  cursor: pointer;
`;

const RankBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${({ theme }) => theme.colors.red.red600};
  color: ${({ theme }) => theme.colors.gray.gray00};
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 8px;
  padding: 2px 10px;
  z-index: 2;
`;

const ProductImg = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 12px;
  object-fit: cover;
  background: ${({ theme }) => theme.colors.gray.gray200};
  margin-bottom: 14px;
`;

const Brand = styled.span`
  ${({ theme }) => theme.typography.label1Bold};
  color: ${({ theme }) => theme.colors.gray.gray600};
  margin-bottom: 2px;
  display: block;
`;

const ProductName = styled.p`
  ${({ theme }) => theme.typography.body1Bold};
  color: ${({ theme }) => theme.colors.gray.gray900};
  line-height: 1.3;
  margin-bottom: 6px;
  word-break: keep-all;
`;

const Price = styled.span`
  ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.colors.gray.gray900};
  margin-top: 2px;
  display: block;
`;

const MoreBtn = styled.button`
  display: block;
  margin: 0 auto 0 auto;
  background: ${({ theme }) => theme.colors.gray.gray100};
  color: ${({ theme }) => theme.colors.blue.blue700};
  border: none;
  border-radius: 24px;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 12px 36px;
  cursor: pointer;
  box-shadow: none;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.blue.blue100};
  }
`;

const RankingSection = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<GenderFilter>('all');
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 6;

  useEffect(() => {
    setLoading(true);
    setError(false);
    const url = filter === 'all' ? '/api/products/ranking' : `/api/products/ranking?gender=${filter}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        const productsData = Array.isArray(data) ? data : data.data || [];
        console.log('[RankingSection] API 응답:', data);
        console.log('[RankingSection] productsData:', productsData);
        setProducts(productsData);
        setLoading(false);
        setShowAll(false); // 필터 변경 시 자동으로 접기
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [filter]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error || !Array.isArray(products)) {
    return <div>상품 목록이 없습니다</div>;
  }

  if (products.length === 0) {
    return <div>상품 목록이 없습니다</div>;
  }

  const visibleProducts = showAll ? products : products.slice(0, VISIBLE_COUNT);

  return (
    <Section>
      <Title>실시간 급상승 선물랭킹</Title>
      <FilterRow>
        {filterOptions.map(opt => (
          <FilterBtn
            key={opt.key}
            active={filter === opt.key}
            onClick={() => setFilter(opt.key)}
          >
            <FilterLabel>{opt.label}</FilterLabel>
          </FilterBtn>
        ))}
      </FilterRow>
      <Grid>
        {visibleProducts.map((item, idx) => {
          console.log('[RankingSection] product item:', item);
          return (
            <Card key={item.id}>
              <RankBadge>{idx + 1}</RankBadge>
              <ProductImg src={item.imageURL} alt={item.name} />
              <Brand>{item.brandInfo?.name}</Brand>
              <ProductName>{item.name}</ProductName>
              <Price>
                {typeof item.price?.sellingPrice === "number"
                  ? item.price.sellingPrice.toLocaleString()
                  : "가격 정보 없음"
                }원
              </Price>
            </Card>
          );
        })}
      </Grid>
      {products.length > VISIBLE_COUNT && (
        <MoreBtn onClick={() => setShowAll(v => !v)}>
          {showAll ? "접기" : "더보기"}
        </MoreBtn>
      )}
    </Section>
  );
};

export default RankingSection;