import { useEffect, useState } from "react";
import styled from "@emotion/styled";

type Theme = {
  id?: number;
  themeId?: number;
  name: string;
  imageURL?: string;
};

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // 모바일 2열
  gap: 20px 0;
  justify-items: center;
  align-items: center;
  width: 100%;

  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const ThemeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 110px;
  width: 100%;
`;

const ThemeImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  object-fit: cover;
  background: #f7f7fa;
  margin-bottom: 8px;
  border: none;
`;

const ThemeName = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #222;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 100px;
`;

const ThemeSection = () => {
  const [themes, setThemes] = useState<Theme[]>([]);

  useEffect(() => {
    fetch("/api/products/ranking")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        console.log("[API] /api/products/ranking 응답:", data);
        if (Array.isArray(data)) {
          setThemes(data);
        } else if (Array.isArray(data.data)) {
          setThemes(data.data);
        } else if (Array.isArray(data.products)) {
          setThemes(data.products);
        } else {
          setThemes([]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ThemeGrid>
      {themes.map((theme, idx) => (
        <ThemeCard key={theme.id ?? theme.themeId ?? theme.name ?? idx}>
          <ThemeImage
            src={theme.imageURL || "/default-image.png"}
            alt={theme.name}
          />
          <ThemeName>{theme.name}</ThemeName>
        </ThemeCard>
      ))}
    </ThemeGrid>
  );
};

export default ThemeSection;
