import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/Components/layout/Layout";
import { useLogin } from "@/hooks/useLogin";
import { useState } from "react";

const LoginWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
  width: 100%;
  padding: 32px 0 24px 0;
  box-sizing: border-box;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 48px;
  letter-spacing: 1px;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (min-width: 720px) {
    max-width: 400px;
    gap: 32px;
  }
`;

const Input = styled.input`
  width: 100%;
  font-size: 1.2rem;
  padding: 18px 0 8px 0;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  outline: none;
  color: #222;
  background: transparent;
  &::placeholder {
    color: #b0b3ba;
    font-size: 1.2rem;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 1.6rem;
  margin-top: -24px;
  margin-bottom: 8px;
  min-height: 24px;
`;

const LoginButton = styled.button`
  width: 100%;
  background: #f7e244;
  color: #222;
  font-size: 1.2rem;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  padding: 18px 0;
  margin-top: 24px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #ffe14a;
  }
  &:disabled {
    background: #f0f0f0;
    color: #b0b3ba;
    cursor: not-allowed;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("비밀번호는 6자 이상이어야 합니다.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) validateEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) validatePassword(e.target.value);
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    validatePassword(password);
  };

  const isFormValid = email && password && !emailError && !passwordError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    const userInfo = await login({ email, password });

    if (userInfo) {
      const redirect = location.state?.redirect;
      if (redirect) {
        navigate(redirect);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <Layout>
      <LoginWrapper>
        <Logo>kakao</Logo>
        <Form onSubmit={handleSubmit}>
          {/* 이메일 입력 필드 */}
          <Input
            type="email"
            placeholder="이메일"
            autoComplete="username"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
          />
          <ErrorMessage>{emailError}</ErrorMessage>
          {/* 비밀번호 입력 필드 */}
          <Input
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
          />
          <ErrorMessage>{passwordError}</ErrorMessage>
          <LoginButton type="submit" disabled={!isFormValid || isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </LoginButton>
        </Form>
      </LoginWrapper>
    </Layout>
  );
};

export default Login;
