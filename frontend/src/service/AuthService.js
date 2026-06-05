import { loginApi, logoutApi, signupApi, getMeApi } from "../api/auth.api";
import useAuthStore from "../store/AuthStore";

export const loginService = async (email, password) => {
  const response = await loginApi({ email, password });
  const { accessToken, refreshToken, user } = response.data;
  useAuthStore.getState().setAuth(user, accessToken, refreshToken);
  return user;
};

export const signupService = async (email, password) => {
  const response = await signupApi({ email, password });
  const { accessToken, refreshToken, user } = response.data;
  useAuthStore.getState().setAuth(user, accessToken, refreshToken);
  return user;
};

export const logoutService = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  try {
    await logoutApi(refreshToken);
  } finally {
    useAuthStore.getState().logout();
  }
};

export const getMeService = async () => {
  const response = await getMeApi();
  return response.data;
};
