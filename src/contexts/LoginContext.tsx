import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { UserInfo } from "../types/auth";

interface LoginContextType {
  user: UserInfo | null;
  isLoggedIn: boolean;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

// 데이터 유효성 검증 함수
const isValidUserInfo = (data: unknown): data is UserInfo => {
  return (
    typeof data === "object" &&
    data !== null &&
    "authToken" in data &&
    "email" in data &&
    "name" in data &&
    typeof (data as any).authToken === "string" &&
    typeof (data as any).email === "string" &&
    typeof (data as any).name === "string"
  );
};

export function LoginProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);

  // 로그인 상태를 boolean으로 계산
  const isLoggedIn = !!user;

  useEffect(() => {
    const stored = sessionStorage.getItem("userInfo");
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        // 데이터 유효성 검증
        if (isValidUserInfo(parsedData)) {
          setUser(parsedData);
        } else {
          console.warn("저장된 사용자 데이터가 유효하지 않습니다:", parsedData);
          sessionStorage.removeItem("userInfo");
          setUser(null);
        }
      } catch (e) {
        console.error("사용자 데이터 파싱 중 오류 발생:", e);
        sessionStorage.removeItem("userInfo");
        setUser(null);
      }
    }
  }, []);

  // login 함수 메모이제이션
  const login = useCallback((userInfo: UserInfo) => {
    setUser(userInfo);
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, []);

  // logout 함수 메모이제이션
  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("userInfo");
  }, []);

  // Context value 메모이제이션
  const contextValue = useMemo(
    () => ({
      user,
      isLoggedIn,
      login,
      logout,
    }),
    [user, isLoggedIn, login, logout],
  );

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLoginContext() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error(
      "useLoginContext는 LoginProvider 안에서만 사용해야 합니다.",
    );
  }
  return context;
}
