import React, { useEffect, useState } from "react";

// 테마 타입 정의 (필요에 따라 수정)
type Theme = {
  id: number;
  name: string;
  // 필요한 필드 추가
};

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
        setThemes(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // 다음 단계에서 로딩/에러/데이터 없음 처리 추가 예정

  if (loading) {
    return <div>로딩 중...</div>; // 또는 스피너 등 원하는 로딩 UI로 변경 가능
  }

  return (
    <div>
      {/* 테마 목록 렌더링 */}
      {themes && themes.map((theme) => (
        <div key={theme.id}>{theme.name}</div>
      ))}
    </div>
  );
};

export default ThemeSection; 