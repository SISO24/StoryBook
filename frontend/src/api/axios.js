import axios from "axios";
import useAuthStore from "../store/AuthStore";

const api = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 403 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const response = await axios.post("/api/auth/refresh", {
          refreshToken,
        });
        const newAccessToken = response.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export default api;
