import { useEffect, useState } from "react";
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useRankingProducts } from '../hooks/useRankingProducts';
import type { GenderFilter, RankingType, Product } from '../types/ranking';
import { rankingTypeOptions } from '../types/ranking';

// 상수 및 타입 선언
const VISIBLE_COUNT = 6;

const filterOptions: { key: GenderFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'male', label: '남자' },
  { key: 'female', label: '여자' },
  { key: 'teen', label: '청소년' },
];

// styled-components 선언
const Section = styled.section`
  width: 100%;
  margin: 40px 0 0 0;
`;
const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
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
  background: ${({active}) => active ? '#4A90E2' : '#F0F0F0'};
  color: ${({active}) => active ? '#fff' : '#222'};
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 4px;
  transition: background 0.2s;
`;
const FilterLabel = styled.span`
  font-size: 0.95rem;
  color: #222;
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
  background: #fff;
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
  background: #e74c3c;
  color: #fff;
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
  background: #eee;
  margin-bottom: 14px;
`;
const Brand = styled.span`
  font-weight: bold;
  color: #888;
  margin-bottom: 2px;
  display: block;
`;
const ProductName = styled.p`
  font-weight: bold;
  color: #222;
  line-height: 1.3;
  margin-bottom: 6px;
  word-break: keep-all;
`;
const Price = styled.span`
  font-size: 1.1rem;
  color: #222;
  margin-top: 2px;
  display: block;
`;
const MoreBtn = styled.button`
  display: block;
  margin: 0 auto 0 auto;
  background: #F0F0F0;
  color: #4A90E2;
  border: none;
  border-radius: 24px;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 12px 36px;
  cursor: pointer;
  box-shadow: none;
  transition: background 0.2s;
  &:hover {
    background: #eaf4ff;
  }
`;

const RankingSection = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<GenderFilter>('all');
  const [rankingType, setRankingType] = useState<RankingType>('wanted');
  const [showAll, setShowAll] = useState(false);
  
  // Custom Hook 사용
  const { products, loading, error } = useRankingProducts(filter, rankingType);

  // 필터링된 상품 계산
  const filteredProducts = products?.filter(product => product.rankingType === rankingType) || [];
  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, VISIBLE_COUNT);

  // 상품 카드 클릭 핸들러
  const handleProductClick = (productId: number) => {
    navigate(`/order/${productId}`);
  };

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
      {/* 랭킹 타입 필터 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        {rankingTypeOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setRankingType(opt.key)}
            style={{
              background: rankingType === opt.key ? '#4A90E2' : '#F0F0F0',
              color: rankingType === opt.key ? '#fff' : '#222',
              border: 'none',
              borderRadius: 16,
              padding: '10px 24px',
              margin: '0 8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {/* 상품 리스트 또는 상품 없음 메시지 */}
      {filteredProducts.length === 0 ? (
        <div>상품 목록이 없습니다</div>
      ) : (
        <>
          <Grid>
            {visibleProducts.map((item, idx) => (
              <Card key={item.id} onClick={() => handleProductClick(item.id)}>
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
            ))}
          </Grid>
          {filteredProducts.length > VISIBLE_COUNT && (
            <MoreBtn onClick={() => setShowAll(v => !v)}>
              {showAll ? "접기" : "더보기"}
            </MoreBtn>
          )}
        </>
      )}
    </Section>
  );
};

export default RankingSection;