import { useState } from 'react';
import { toast } from 'react-toastify';
import { login } from '../api/auth';
import { setUserInfo } from '../utils/storage';
import type { LoginRequest, UserInfo } from '../types/auth';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginRequest): Promise<UserInfo | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(credentials);
      
      // UserInfo를 storage에 저장
      const userInfo: UserInfo = {
        authToken: response.data.authToken,
        email: response.data.email,
        name: response.data.name,
      };
      setUserInfo(userInfo);
      
      toast.success('로그인에 성공했습니다!');
      return userInfo;
    } catch (err: any) {
      const errorMessage = err.message || '로그인에 실패했습니다.';
      setError(errorMessage);
      
      // 4XX 에러 시 Toast로 에러 메시지 표시
      if (err.status && err.status >= 400 && err.status < 500) {
        toast.error(errorMessage);
      } else {
        toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    login: handleLogin,
  };
}; 