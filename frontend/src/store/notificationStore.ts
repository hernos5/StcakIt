import { create } from 'zustand';
import { api } from '../services/api';
export type Notification = {
  id: string;
  type: 'answer' | 'mention' | 'upvote' | 'accept' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
  sourceId?: string;
  sourceType?: 'question' | 'answer' | 'comment';
};
type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};
export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  fetchNotifications: async () => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const notifications = await api.notifications.getAll();
      const unreadCount = notifications.filter(n => !n.read).length;
      set({
        notifications,
        unreadCount,
        isLoading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch notifications',
        isLoading: false
      });
    }
  },
  markAsRead: async id => {
    try {
      // Optimistic update
      set(state => {
        const updatedNotifications = state.notifications.map(n => n.id === id ? {
          ...n,
          read: true
        } : n);
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        return {
          notifications: updatedNotifications,
          unreadCount
        };
      });
      // Actual API call
      await api.notifications.markAsRead(id);
    } catch (error) {
      // Revert on error
      set({
        error: 'Failed to mark notification as read'
      });
      await get().fetchNotifications();
    }
  },
  markAllAsRead: async () => {
    try {
      // Optimistic update
      set(state => ({
        notifications: state.notifications.map(n => ({
          ...n,
          read: true
        })),
        unreadCount: 0
      }));
      // Actual API call
      await api.notifications.markAllAsRead();
    } catch (error) {
      // Revert on error
      set({
        error: 'Failed to mark all notifications as read'
      });
      await get().fetchNotifications();
    }
  }
}));