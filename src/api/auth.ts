import type { LoginRequest, LoginResponse, LoginError } from '../types/auth';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '로그인에 실패했습니다.' }));
    const error: LoginError = {
      message: errorData.message || '로그인에 실패했습니다.',
      status: response.status,
    };
    throw error;
  }

  return response.json();
}; 