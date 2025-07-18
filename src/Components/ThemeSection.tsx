import { useEffect, useState } from "react";
import styled from '@emotion/styled';

type Theme = {
  id?: number;
  themeId?: number;
  name: string;
  image?: string;
  imageURL?: string;
};

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const CategoryImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  object-fit: cover;
  background: #f7f7fa;
  margin-bottom: 10px;
  border: none;
`;
const CategoryName = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #222;
  text-align: center;
  letter-spacing: -0.2px;
  white-space: nowrap;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 32px 0;
  justify-items: center;
  margin-top: 24px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const ThemeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const ThemeImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: #f7f7fa;
  margin-bottom: 12px;
`;
const ThemeName = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #222;
  text-align: center;
`;

const ThemeSection = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
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
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <ThemeGrid>
      {themes.map((theme) => (
        <CategoryItem key={theme.themeId || theme.id}>
          <CategoryImage src={theme.image || theme.imageURL || '/default-image.png'} alt={theme.name} />
          <CategoryName>{theme.name}</CategoryName>
        </CategoryItem>
      ))}
    </ThemeGrid>
  );
};

export default ThemeSection; 