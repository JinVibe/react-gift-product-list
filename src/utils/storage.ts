import type { UserInfo } from "../types/auth";

const USER_INFO_KEY = "userInfo";

export const setUserInfo = (userInfo: UserInfo): void => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

export const getUserInfo = (): UserInfo | null => {
  try {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to parse user info from localStorage:", error);
    return null;
  }
};

export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_INFO_KEY);
};
