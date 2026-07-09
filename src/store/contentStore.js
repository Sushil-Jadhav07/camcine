// Camcine - Content Store (Zustand)
import { create } from 'zustand';
import { contentService } from '@/services';

const defaultFilters = {
  languages: [],
  genres: [],
  regions: [],
  moods: [],
  types: [],
  status: [],
  yearRange: [2000, 2026],
  sortBy: 'popular',
};

export const useContentStore = create((set, get) => ({
  allContent: [],
  featuredContent: [],
  trendingContent: [],
  movies: [],
  series: [],
  songs: [],
  news: [],
  shortFilms: [],
  selectedContent: null,
  similarContent: [],
  filteredContent: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,

  fetchAllContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const content = await contentService.getAllContent();
      set({ 
        allContent: content,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch content',
        isLoading: false 
      });
    }
  },

  fetchFeaturedContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const content = await contentService.getFeaturedContent();
      set({ 
        featuredContent: content,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch featured content',
        isLoading: false 
      });
    }
  },

  fetchTrendingContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const content = await contentService.getTrendingContent();
      set({ 
        trendingContent: content,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch trending content',
        isLoading: false 
      });
    }
  },

  fetchContentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const content = await contentService.getContentById(id);
      if (content) {
        set({ selectedContent: content, isLoading: false });
      } else {
        set({ error: 'Content not found', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch content',
        isLoading: false 
      });
    }
  },

  fetchSimilarContent: async (contentId) => {
    set({ isLoading: true, error: null });
    try {
      const content = await contentService.getSimilarContent(contentId);
      set({ similarContent: content, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch similar content',
        isLoading: false 
      });
    }
  },

  searchContent: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const content = await contentService.searchContent(query);
      set({ filteredContent: content, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false 
      });
    }
  },

  filterContent: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const newFilters = { ...get().filters, ...filters };
      set({ filters: newFilters });
      
      const content = await contentService.filterContent(newFilters);
      set({ filteredContent: content, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Filter failed',
        isLoading: false 
      });
    }
  },

  setFilters: (filters) => {
    set(state => ({ filters: { ...state.filters, ...filters } }));
  },

  clearFilters: () => {
    set({ filters: defaultFilters, filteredContent: [] });
  },

  clearError: () => set({ error: null }),
}));
