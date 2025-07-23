import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { Layout } from '@/Components/layout/Layout';
import { useThemeDetail } from '@/hooks/useThemeDetail';
import { useThemeProducts } from '@/hooks/useThemeProducts';
import ThemeProductCard from '@/Components/ThemeProductCard';

const HeroSection = styled.div<{ backgroundColor?: string }>`
  width: 100%;
  min-height: 300px;
  background-color: ${({ backgroundColor }) => backgroundColor || '#f7f7fa'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
`;

const ThemeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 16px;
`;

const ThemeDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  line-height: 1.6;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.2rem;
  color: #e74c3c;
`;

const ProductsSection = styled.div`
  padding: 40px 20px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #666;
`;

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.2rem;
  color: #666;
  text-align: center;
`;

const IntersectionTarget = styled.div`
  height: 20px;
  width: 100%;
`;

const ThemeProducts = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const { themeDetail, loading: themeLoading, error: themeError } = useThemeDetail(Number(themeId));
  const { products, loading: productsLoading, error: productsError, hasMore, loadMore } = useThemeProducts(Number(themeId));
  
  const intersectionRef = useRef<HTMLDivElement>(null);

  // 404 에러 시 홈으로 리다이렉트
  useEffect(() => {
    if (themeError === "Theme not found" || productsError === "Theme not found") {
      navigate('/', { replace: true });
    }
  }, [themeError, productsError, navigate]);

  // Intersection Observer 설정
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !productsLoading) {
      loadMore();
    }
  }, [hasMore, productsLoading, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => {
      if (intersectionRef.current) {
        observer.unobserve(intersectionRef.current);
      }
    };
  }, [handleIntersection]);

  const handleProductClick = (productId: number) => {
    navigate(`/order/${productId}`);
  };

  if (themeLoading) {
    return (
      <Layout>
        <LoadingMessage>테마 정보를 불러오는 중...</LoadingMessage>
      </Layout>
    );
  }

  if (themeError && themeError !== "Theme not found") {
    return (
      <Layout>
        <ErrorMessage>테마 정보를 불러올 수 없습니다.</ErrorMessage>
      </Layout>
    );
  }

  if (!themeDetail) {
    return (
      <Layout>
        <ErrorMessage>테마 정보가 없습니다.</ErrorMessage>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroSection backgroundColor={themeDetail.backgroundColor}>
        <ThemeTitle>{themeDetail.title}</ThemeTitle>
        <ThemeDescription>{themeDetail.description}</ThemeDescription>
      </HeroSection>
      
      <ProductsSection>
        {products.length === 0 && !productsLoading && !productsError ? (
          <EmptyMessage>
            이 테마에 해당하는 상품이 없습니다.
          </EmptyMessage>
        ) : (
          <>
            <ProductsGrid>
              {products.map((product) => (
                <ThemeProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </ProductsGrid>
            
            {productsLoading && (
              <LoadingIndicator>상품을 불러오는 중...</LoadingIndicator>
            )}
            
            {productsError && productsError !== "Theme not found" && (
              <ErrorMessage>상품을 불러올 수 없습니다.</ErrorMessage>
            )}
            
            <IntersectionTarget ref={intersectionRef} />
          </>
        )}
      </ProductsSection>
    </Layout>
  );
};

export default ThemeProducts; 