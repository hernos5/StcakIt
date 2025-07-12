import { create } from 'zustand';
import { api } from '../services/api';
export type Tag = {
  id: string;
  name: string;
  count: number;
  description?: string;
  isFollowing?: boolean;
};
type TagState = {
  tags: Tag[];
  popularTags: Tag[];
  userTags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  fetchPopularTags: () => Promise<void>;
  fetchUserTags: () => Promise<void>;
  followTag: (tagId: string) => Promise<void>;
  unfollowTag: (tagId: string) => Promise<void>;
};
export const useTagStore = create<TagState>(set => ({
  tags: [],
  popularTags: [],
  userTags: [],
  isLoading: false,
  error: null,
  fetchTags: async () => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const tags = await api.tags.getAll();
      set({
        tags,
        isLoading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch tags',
        isLoading: false
      });
    }
  },
  fetchPopularTags: async () => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const popularTags = await api.tags.getPopular();
      set({
        popularTags,
        isLoading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch popular tags',
        isLoading: false
      });
    }
  },
  fetchUserTags: async () => {
    set({
      isLoading: true,
      error: null
    });
    try {
      const userTags = await api.tags.getUserTags();
      set({
        userTags,
        isLoading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch user tags',
        isLoading: false
      });
    }
  },
  followTag: async tagId => {
    try {
      // Optimistic update
      set(state => {
        const updatedTags = state.tags.map(t => t.id === tagId ? {
          ...t,
          isFollowing: true
        } : t);
        const updatedPopularTags = state.popularTags.map(t => t.id === tagId ? {
          ...t,
          isFollowing: true
        } : t);
        return {
          tags: updatedTags,
          popularTags: updatedPopularTags
        };
      });
      // Actual API call
      await api.tags.follow(tagId);
      // Refresh user tags
      await api.tags.getUserTags().then(userTags => {
        set({
          userTags
        });
      });
    } catch (error) {
      set({
        error: 'Failed to follow tag'
      });
    }
  },
  unfollowTag: async tagId => {
    try {
      // Optimistic update
      set(state => {
        const updatedTags = state.tags.map(t => t.id === tagId ? {
          ...t,
          isFollowing: false
        } : t);
        const updatedPopularTags = state.popularTags.map(t => t.id === tagId ? {
          ...t,
          isFollowing: false
        } : t);
        const updatedUserTags = state.userTags.filter(t => t.id !== tagId);
        return {
          tags: updatedTags,
          popularTags: updatedPopularTags,
          userTags: updatedUserTags
        };
      });
      // Actual API call
      await api.tags.unfollow(tagId);
    } catch (error) {
      set({
        error: 'Failed to unfollow tag'
      });
    }
  }
}));