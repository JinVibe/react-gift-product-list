import { useState, useEffect } from 'react';
import { fetchThemeDetail } from '../api/themes';
import type { ThemeDetail } from '../api/themes';
import type { AppError } from '../constants/errors';

export const useThemeDetail = (themeId: number) => {
  const [themeDetail, setThemeDetail] = useState<ThemeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchThemeDetail(themeId)
      .then((data) => {
        setThemeDetail(data);
      })
      .catch((err: AppError) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [themeId]);

  return { themeDetail, loading, error };
}; 