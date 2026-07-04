import { create } from "zustand";
import { User } from "@/types";

interface Impersonator {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  impersonator: Impersonator | null;
  originalToken: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string, impersonator?: Impersonator | null) => void;
  setImpersonator: (impersonator: Impersonator | null) => void;
  setOriginalToken: (token: string | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  impersonator: null,
  originalToken: typeof window !== "undefined" ? localStorage.getItem("originalToken") : null,
  isLoading: true,

  setAuth: (user, token, impersonator = null) => {
    localStorage.setItem("token", token);
    set({ user, token, impersonator, isLoading: false });
  },

  setImpersonator: (impersonator) => {
    set({ impersonator });
  },

  setOriginalToken: (token) => {
    if (token) {
      localStorage.setItem("originalToken", token);
    } else {
      localStorage.removeItem("originalToken");
    }
    set({ originalToken: token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("originalToken");
    set({ user: null, token: null, impersonator: null, originalToken: null, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
