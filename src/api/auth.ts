import type { LoginRequest, LoginResponse, LoginError } from "../types/auth";

export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  console.log("[API] /api/login 응답:", data);

  if (!response.ok) {
    const error: LoginError = {
      message: data.message || "로그인에 실패했습니다.",
      status: response.status,
    };
    throw error;
  }

  return data;
};
