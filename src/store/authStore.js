import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      login: (token, user) => set({ token, isAuthenticated: true, user }),
      logout: () => set({ token: null, isAuthenticated: false, user: null }),
    }),
    { name: "auth", getStorage: () => localStorage }
  )
);

export default useAuthStore;
