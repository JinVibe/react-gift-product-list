import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import { Layout } from '@/Components/layout/Layout';
import { useThemeDetail } from '@/hooks/useThemeDetail';
import { useThemeProducts } from '@/hooks/useThemeProducts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import ProductCard from '@/Components/ProductCard';
import { ERROR_CODES } from '@/constants/errors';

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
  
  const { ref: intersectionRef } = useInfiniteScroll(loadMore, hasMore, productsLoading, productsError);

  // 404 에러 시 홈으로 리다이렉트
  useEffect(() => {
    if (themeError?.code === ERROR_CODES.NOT_FOUND || productsError?.code === ERROR_CODES.NOT_FOUND) {
      navigate('/', { replace: true });
    }
  }, [themeError, productsError, navigate]);

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

  if (themeError && themeError.code !== ERROR_CODES.NOT_FOUND) {
    return (
      <Layout>
        <ErrorMessage>{themeError.message}</ErrorMessage>
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
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </ProductsGrid>
            
            {productsLoading && (
              <LoadingIndicator>상품을 불러오는 중...</LoadingIndicator>
            )}
            
            {productsError && productsError.code !== ERROR_CODES.NOT_FOUND && (
              <ErrorMessage>{productsError.message}</ErrorMessage>
            )}
            
            <IntersectionTarget ref={intersectionRef} />
          </>
        )}
      </ProductsSection>
    </Layout>
  );
};

export default ThemeProducts; 