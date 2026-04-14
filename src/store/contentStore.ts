// Camcine - Content Store (Zustand)
import { create } from 'zustand';
import type { Content, FilterState } from '@/types';
import { contentService } from '@/services';

interface ContentState {
  // Content lists
  allContent: Content[];
  featuredContent: Content[];
  trendingContent: Content[];
  movies: Content[];
  series: Content[];
  songs: Content[];
  news: Content[];
  shortFilms: Content[];
  
  // Selected content
  selectedContent: Content | null;
  similarContent: Content[];
  
  // Filtered content
  filteredContent: Content[];
  filters: FilterState;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  
  // Actions
  fetchAllContent: () => Promise<void>;
  fetchFeaturedContent: () => Promise<void>;
  fetchTrendingContent: () => Promise<void>;
  fetchContentById: (id: string) => Promise<void>;
  fetchSimilarContent: (contentId: string) => Promise<void>;
  searchContent: (query: string) => Promise<void>;
  filterContent: (filters: Partial<FilterState>) => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  clearError: () => void;
}

const defaultFilters: FilterState = {
  languages: [],
  genres: [],
  regions: [],
  moods: [],
  types: [],
  status: [],
  yearRange: [2000, 2026],
  sortBy: 'popular',
};

export const useContentStore = create<ContentState>((set, get) => ({
  // Initial state
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

  // Actions
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

  fetchContentById: async (id: string) => {
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

  fetchSimilarContent: async (contentId: string) => {
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

  searchContent: async (query: string) => {
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

  filterContent: async (filters: Partial<FilterState>) => {
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

  setFilters: (filters: Partial<FilterState>) => {
    set(state => ({ filters: { ...state.filters, ...filters } }));
  },

  clearFilters: () => {
    set({ filters: defaultFilters, filteredContent: [] });
  },

  clearError: () => set({ error: null }),
}));
