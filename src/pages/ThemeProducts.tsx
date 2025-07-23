import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import { Layout } from '@/Components/layout/Layout';
import { useThemeDetail } from '@/hooks/useThemeDetail';

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

const ThemeProducts = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const { themeDetail, loading, error } = useThemeDetail(Number(themeId));

  // 404 에러 시 홈으로 리다이렉트
  useEffect(() => {
    if (error === "Theme not found") {
      navigate('/', { replace: true });
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <Layout>
        <LoadingMessage>테마 정보를 불러오는 중...</LoadingMessage>
      </Layout>
    );
  }

  if (error && error !== "Theme not found") {
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
      
      {/* 여기에 상품 목록과 페이지네이션이 추가될 예정 */}
      <div style={{ padding: '40px 20px' }}>
        <h2>상품 목록 (테마: {themeDetail.name})</h2>
        <p>Intersection Observer API를 사용한 페이지네이션이 여기에 구현됩니다.</p>
      </div>
    </Layout>
  );
};

export default ThemeProducts; 