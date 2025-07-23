import { useState, useEffect } from 'react';
import { fetchThemeDetail } from '../api/themes';
import type { ThemeDetail } from '../api/themes';

export const useThemeDetail = (themeId: number) => {
  const [themeDetail, setThemeDetail] = useState<ThemeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchThemeDetail(themeId)
      .then((data) => {
        setThemeDetail(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [themeId]);

  return { themeDetail, loading, error };
}; 