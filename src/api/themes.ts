export interface Theme {
  themeId: number;
  name: string;
  image: string;
}

export interface ThemesResponse {
  data: Theme[];
}

export const fetchThemes = async (): Promise<Theme[]> => {
  const response = await fetch('/api/themes');
  const data = await response.json();
  console.log('[API] /api/themes 응답:', data);
  
  if (!response.ok) throw new Error("API Error");
  
  return data.data || [];
}; 