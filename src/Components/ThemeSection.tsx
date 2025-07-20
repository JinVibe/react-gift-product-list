import { useEffect, useState } from "react";

type Theme = {
  id: number;
  name: string;
};

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
    <div>
      {/* 테마 목록 렌더링 */}
      {themes && themes.map((theme) => (
        <div key={theme.id}>{theme.name}</div>
      ))}
    </div>
  );
};

export default ThemeSection; 