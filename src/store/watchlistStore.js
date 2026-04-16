// Camcine - Watchlist Store (Zustand)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userService } from '@/services';

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      watchlist: [],
      watchHistory: [],
      continueWatching: [],
      isLoading: false,
      error: null,

      fetchWatchlist: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const watchlist = await userService.getWatchlist(userId);
          set({ watchlist, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch watchlist',
            isLoading: false 
          });
        }
      },

      fetchWatchHistory: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const history = await userService.getContinueWatching(userId);
          set({ 
            watchHistory: history.map(h => ({
              content: h.content,
              progress: h.progress,
              episodeId: h.episodeId,
              watchedAt: new Date(),
            })),
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch watch history',
            isLoading: false 
          });
        }
      },

      fetchContinueWatching: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const continueWatching = await userService.getContinueWatching(userId);
          set({ continueWatching, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch continue watching',
            isLoading: false 
          });
        }
      },

      addToWatchlist: async (userId, contentId) => {
        set({ isLoading: true, error: null });
        try {
          await userService.addToWatchlist(userId, contentId);
          const watchlist = await userService.getWatchlist(userId);
          set({ watchlist, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add to watchlist',
            isLoading: false 
          });
        }
      },

      removeFromWatchlist: async (userId, contentId) => {
        set({ isLoading: true, error: null });
        try {
          await userService.removeFromWatchlist(userId, contentId);
          const watchlist = await userService.getWatchlist(userId);
          set({ watchlist, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove from watchlist',
            isLoading: false 
          });
        }
      },

      isInWatchlist: (contentId) => {
        return get().watchlist.some(item => item.id === contentId);
      },

      updateWatchProgress: async (userId, contentId, progress, episodeId) => {
        try {
          await userService.updateWatchProgress(userId, contentId, progress, episodeId);
          const continueWatching = await userService.getContinueWatching(userId);
          set({ continueWatching });
        } catch (error) {
          console.error('Failed to update watch progress:', error);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'camcine-watchlist',
      partialize: (state) => ({ watchlist: state.watchlist }),
    }
  )
);
