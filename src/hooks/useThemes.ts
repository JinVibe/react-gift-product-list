import { useState, useEffect } from 'react';
import { fetchThemes } from '../api/themes';
import type { Theme } from '../api/themes';

export const useThemes = () => {
  const [themes, setThemes] = useState<Theme[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetchThemes()
      .then((data) => {
        setThemes(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { themes, loading, error };
}; 