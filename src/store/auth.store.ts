import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
   isVerified: boolean;
  setAuth: (user: User, token: string) => void;
   setVerified: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isVerified: false,

  setAuth: (user, token) =>
    set({ user, token }),

  setVerified: (value) =>
    set({ isVerified: value }),

  logout: () =>
    set({
      user: null,
      token: null,
      isVerified: false,
    }),
}));