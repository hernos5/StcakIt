import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './authStore';

type UserState = {
  users: User[];
  addUser: (user: User) => void;
  findUserByEmail: (email: string) => User | undefined;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (user) => {
        const exists = get().users.some((u) => u.email === user.email);
        if (!exists) {
          set((state) => ({
            users: [...state.users, user],
          }));
        }
      },
      findUserByEmail: (email) => get().users.find((u) => u.email === email),
    }),
    {
      name: 'user-db',
    }
  )
);