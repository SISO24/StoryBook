import { create } from "zustand";
import { persist } from "zustand/middleware";
import { refreshTokenApi } from "../api/auth.api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setAccessToken: (accessToken) => set({ accessToken }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "storybook-auth",
      partialState: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);

export default useAuthStore;
