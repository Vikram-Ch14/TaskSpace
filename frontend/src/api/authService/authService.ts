import { axiosInstance } from "@/pages/config/axios";
import type { LoginForm } from "@/pages/Login/LoginForm";
import type { SignupForm } from "@/pages/Signup/SignupForm";

enum Authentication {
  base = `/api/user`,
}

const registerUserUrl = () => `${Authentication.base}/register`;

const loginUserUrl = () => `${Authentication.base}/login`;

export const loginUser = async (user: LoginForm) => {
  const response = await axiosInstance.post(loginUserUrl(), user);
  return response.data;
};

export const createUser = async (user: SignupForm) => {
  const response = await axiosInstance.post(registerUserUrl(), user);
  return response.data;
};
