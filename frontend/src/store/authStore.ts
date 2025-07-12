import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';
export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  reputation: number;
  role: 'user' | 'admin';
};
type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
};
export const useAuthStore = create<AuthState>()(persist(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (email, password) => {
    try {
      const response = await api.auth.login(email, password);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true
      });
    } catch (error) {
      throw error;
    }
  },
  register: async (name, email, password) => {
    try {
      const response = await api.auth.register(name, email, password);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true
      });
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },
  updateUser: userData => {
    set(state => ({
      user: state.user ? {
        ...state.user,
        ...userData
      } : null
    }));
  }
}), {
  name: 'auth-storage'
}));