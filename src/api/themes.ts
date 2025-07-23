export interface Theme {
  themeId: number;
  name: string;
  image: string;
}

export interface ThemeDetail {
  themeId: number;
  name: string;
  title: string;
  description: string;
  backgroundColor: string;
}

export interface ThemesResponse {
  data: Theme[];
}

export interface ThemeDetailResponse {
  data: ThemeDetail;
}

export const fetchThemes = async (): Promise<Theme[]> => {
  const response = await fetch('/api/themes');
  const data = await response.json();
  console.log('[API] /api/themes 응답:', data);
  
  if (!response.ok) throw new Error("API Error");
  
  return data.data || [];
};

export const fetchThemeDetail = async (themeId: number): Promise<ThemeDetail> => {
  const response = await fetch(`/api/themes/${themeId}/info`);
  const data = await response.json();
  console.log(`[API] /api/themes/${themeId}/info 응답:`, data);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Theme not found");
    }
    throw new Error("API Error");
  }
  
  return data.data;
}; 