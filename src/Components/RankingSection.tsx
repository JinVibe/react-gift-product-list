import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("/api/products/ranking")
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
  }, []);

  // 다음 단계에서 로딩/에러/데이터 없음 처리 추가 예정

  return (
    <div>
      {/* 상품 랭킹 목록 렌더링 */}
      {products && products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};

export default RankingSection;