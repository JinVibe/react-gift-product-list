import styled from '@emotion/styled'
import React, { useEffect, useState } from "react";

type Theme = {
  id?: number;
  themeId?: number;
  name: string;
  image?: string;
};

const SectionWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 32px 0 0 0;
`

const Title = styled.h2`
  ${({ theme }) => theme.typography.title1Bold};
  color: ${({ theme }) => theme.colors.gray.gray900};
  margin-bottom: 24px;
  letter-spacing: -1px;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 32px 0;
  justify-items: center;
  align-items: center;
  width: 100%;
  @media (max-width: 600px) {
    gap: 20px 0;
  }
`

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const CategoryImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  object-fit: cover;
  background: ${({ theme }) => theme.colors.gray.gray100};
  margin-bottom: 10px;
  border: none;
`

const CategoryName = styled.div`
  ${({ theme }) => theme.typography.body1Bold};
  color: ${({ theme }) => theme.colors.gray.gray900};
  text-align: center;
  letter-spacing: -0.2px;
  white-space: nowrap;
`

const ThemeSection = () => {
  const [themes, setThemes] = useState<Theme[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("/api/themes")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setThemes(data);
        } else if (Array.isArray(data.data)) {
          setThemes(data.data);
        } else if (Array.isArray(data.themes)) {
          setThemes(data.themes);
        } else {
          setThemes([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setThemes(null);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error || !Array.isArray(themes) || themes.length === 0) {
    return null;
  }

  return (
    <SectionWrapper>
      <Title>선물 테마</Title>
      <GridContainer>
        {themes.map((theme) => (
          <CategoryItem key={theme.themeId || theme.id}>
            <CategoryImage src={theme.image} alt={theme.name} />
            <CategoryName>{theme.name}</CategoryName>
          </CategoryItem>
        ))}
      </GridContainer>
    </SectionWrapper>
  );
};

export default ThemeSection; 