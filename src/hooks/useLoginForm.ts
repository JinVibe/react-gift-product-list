import { useInput } from "./useInput";
import { useLoginContext } from "../contexts/LoginContext";
import { useLogin } from "./useLogin";
import { toast } from "react-toastify";

interface UseLoginFormOptions {
  onSuccess?: () => void;
}

export function useLoginForm(options?: UseLoginFormOptions) {
  const { login } = useLoginContext();
  const { login: loginApi, isLoading } = useLogin();
  
  const validateEmail = (value: string) => {
    if (!value) return "ID를 입력해주세요.";
    const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(value)) return "ID는 이메일 형식으로 입력해주세요.";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "PW를 입력해주세요.";
    if (value.length < 8) return "PW는 최소 8글자 이상이어야 합니다.";
    return "";
  };

  const emailInput = useInput("", validateEmail);
  const passwordInput = useInput("", validatePassword);

  const isFormValid =
    validateEmail(emailInput.value) === "" &&
    validatePassword(passwordInput.value) === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        // 1. API 요청으로 로그인
        const userInfo = await loginApi({ 
          email: emailInput.value, 
          password: passwordInput.value 
        });
        
        if (userInfo) {
          // 2. Context에 로그인 정보 저장 (스토리지도 함께 저장됨)
          login(userInfo);
          
          // 3. 성공 시 onSuccess 실행
          if (options && options.onSuccess) {
            options.onSuccess();
          }
        }
      } catch (error) {
        // 에러는 useLogin에서 이미 토스트로 처리됨
        console.error("로그인 실패:", error);
      }
    }
  };

  return {
    email: emailInput.value,
    emailError: emailInput.error,
    handleEmailChange: emailInput.handleChange,
    handleEmailBlur: emailInput.handleBlur,

    password: passwordInput.value,
    passwordError: passwordInput.error,
    handlePasswordChange: passwordInput.handleChange,
    handlePasswordBlur: passwordInput.handleBlur,

    isFormValid,
    handleSubmit,
    isLoading,
  };
}
