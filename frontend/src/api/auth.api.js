import api from "./axios";

export const loginApi = (data) => api.post("/auth/login", data);

export const signupApi = (data) => api.post("/auth/signup", data);

export const logoutApi = (refreshToken) =>
  api.post("/auth/logout", { refreshToken });

export const refreshTokenApi = (refreshToken) =>
  api.post("/auth/refresh", { refreshToken });

export const getMeApi = () => api.get("/user/me");
