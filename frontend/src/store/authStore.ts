import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './userStore';

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Login using userStore
      login: async (email, password) => {
        const user = useUserStore.getState().findUserByEmail(email);
        if (!user) throw new Error('User not found');

        set({
          user,
          token: 'mock-token',
          isAuthenticated: true,
        });
      },

      // Register + store in userStore + login
      register: async (name, email, password) => {
        const id = Date.now().toString();
        const newUser: User = {
          id,
          name,
          username: email.split('@')[0],
          email,
          avatar: '',
          reputation: 0,
          role: 'user',
        };

        useUserStore.getState().addUser(newUser);

        set({
          user: newUser,
          token: 'mock-token',
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
