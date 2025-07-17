import React, { useEffect, useState } from "react";

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
  image: string;
  // 필요한 필드 추가
};

const RankingSection = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<GenderFilter>('all');

  useEffect(() => {
    setLoading(true);
    setError(false);
    // 필터에 따라 API 쿼리 파라미터 추가
    const url = filter === 'all' ? '/api/products/ranking' : `/api/products/ranking?gender=${filter}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [filter]);

  // 다음 단계에서 로딩/에러/데이터 없음 처리 추가 예정

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      {/* 필터 UI */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: filter === opt.key ? '#f7e244' : '#eee',
              fontWeight: filter === opt.key ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {/* 상품 랭킹 목록 렌더링 */}
      {products && products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};

export default RankingSection;