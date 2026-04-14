// Camcine - Watchlist Store (Zustand)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Content } from '@/types';
import { userService } from '@/services';

interface WatchlistState {
  watchlist: Content[];
  watchHistory: Array<{
    content: Content;
    progress: number;
    episodeId?: string;
    watchedAt: Date;
  }>;
  continueWatching: Array<{
    content: Content;
    progress: number;
    episodeId?: string;
  }>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWatchlist: (userId: string) => Promise<void>;
  fetchWatchHistory: (userId: string) => Promise<void>;
  fetchContinueWatching: (userId: string) => Promise<void>;
  addToWatchlist: (userId: string, contentId: string) => Promise<void>;
  removeFromWatchlist: (userId: string, contentId: string) => Promise<void>;
  isInWatchlist: (contentId: string) => boolean;
  updateWatchProgress: (userId: string, contentId: string, progress: number, episodeId?: string) => Promise<void>;
  clearError: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      // Initial state
      watchlist: [],
      watchHistory: [],
      continueWatching: [],
      isLoading: false,
      error: null,

      // Actions
      fetchWatchlist: async (userId: string) => {
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

      fetchWatchHistory: async (userId: string) => {
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

      fetchContinueWatching: async (userId: string) => {
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

      addToWatchlist: async (userId: string, contentId: string) => {
        set({ isLoading: true, error: null });
        try {
          await userService.addToWatchlist(userId, contentId);
          // Refresh watchlist
          const watchlist = await userService.getWatchlist(userId);
          set({ watchlist, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add to watchlist',
            isLoading: false 
          });
        }
      },

      removeFromWatchlist: async (userId: string, contentId: string) => {
        set({ isLoading: true, error: null });
        try {
          await userService.removeFromWatchlist(userId, contentId);
          // Refresh watchlist
          const watchlist = await userService.getWatchlist(userId);
          set({ watchlist, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove from watchlist',
            isLoading: false 
          });
        }
      },

      isInWatchlist: (contentId: string) => {
        return get().watchlist.some(item => item.id === contentId);
      },

      updateWatchProgress: async (userId: string, contentId: string, progress: number, episodeId?: string) => {
        try {
          await userService.updateWatchProgress(userId, contentId, progress, episodeId);
          // Refresh continue watching
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
