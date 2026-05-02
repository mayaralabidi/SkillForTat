import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api, { getApiErrorMessage } from "../api";

const storage = createJSONStorage(() => ({
  getItem: (name) =>
    typeof localStorage === "undefined" ? null : localStorage.getItem(name),
  setItem: (name, value) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(name);
    }
  },
}));

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      login: async (credentials) => {
        set({ loading: true, error: null });

        try {
          const { data } = await api.post("/auth/login", credentials);
          set({
            user: data.user,
            token: data.token,
            loading: false,
            error: null,
          });
          return data;
        } catch (error) {
          set({ loading: false, error: getApiErrorMessage(error) });
          throw error;
        }
      },
      register: async (credentials) => {
        set({ loading: true, error: null });

        try {
          const { data } = await api.post("/auth/register", credentials);
          set({
            user: data.user,
            token: data.token,
            loading: false,
            error: null,
          });
          return data;
        } catch (error) {
          set({ loading: false, error: getApiErrorMessage(error) });
          throw error;
        }
      },
      logout: () => set({ user: null, token: null, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "skillfortat-auth",
      storage,
    },
  ),
);

export default useAuthStore;
