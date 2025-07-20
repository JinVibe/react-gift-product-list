import { useEffect, useState } from "react";

type Theme = {
  id: number;
  name: string;
};

const ThemeSection = () => {
  const [themes, setThemes] = useState<Theme[]>([]);

  useEffect(() => {
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
        // setError(true); // This line was removed as per the edit hint.
      })
      .finally(() => {
        // setLoading(false); // This line was removed as per the edit hint.
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