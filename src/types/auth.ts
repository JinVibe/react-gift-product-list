export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  authToken: string;
  email: string;
  name: string;
}

export interface UserInfo {
  authToken: string;
  email: string;
  name: string;
}

export interface LoginError {
  message: string;
  status?: number;
} 