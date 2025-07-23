import styled from "@emotion/styled";
import { useThemes } from "../hooks/useThemes";
import { useNavigate } from "react-router-dom";

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
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
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
  const { themes, loading, error } = useThemes();
  const navigate = useNavigate();

  if (loading) {
    return <div>테마를 불러오는 중...</div>;
  }

  if (error || !themes) {
    return <div>테마를 불러올 수 없습니다.</div>;
  }

  const handleThemeClick = (themeId: number) => {
    navigate(`/themes/${themeId}`);
  };

  return (
    <ThemeGrid>
      {themes.map((theme, idx) => (
        <ThemeCard 
          key={theme.themeId ?? idx}
          onClick={() => handleThemeClick(theme.themeId)}
        >
          <ThemeImage
            src={theme.image || "/default-image.png"}
            alt={theme.name}
          />
          <ThemeName>{theme.name}</ThemeName>
        </ThemeCard>
      ))}
    </ThemeGrid>
  );
};

export default ThemeSection;
