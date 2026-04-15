// Camcine - Content Service (TMDB Powered)
import type { Content, Movie, Series, Song, News, FilterState } from '@/types';
import { tmdbService } from './tmdbService';
import {
  mockSongs,
  mockNews,
} from '@/data/mockData';

export const contentService = {
  // Get all content (Trending as default)
  async getAllContent(): Promise<Content[]> {
    return tmdbService.getTrending();
  },

  // Get content by ID
  async getContentById(id: string): Promise<Content | null> {
    const tmdbId = parseInt(id.split('-')[1]);
    if (id.startsWith('movie')) return tmdbService.getMovieDetails(tmdbId);
    if (id.startsWith('series')) return tmdbService.getSeriesDetails(tmdbId);
    return null;
  },

  // Get featured content
  async getFeaturedContent(): Promise<Content[]> {
    return tmdbService.getFeatured();
  },

  // Get trending content
  async getTrendingContent(): Promise<Content[]> {
    return tmdbService.getTrending();
  },

  // Get movies
  async getMovies(): Promise<Movie[]> {
    return tmdbService.getPopularMovies();
  },

  // Get series
  async getSeries(): Promise<Series[]> {
    return tmdbService.getPopularSeries();
  },

  // Get songs (TMDB doesn't have music, keeping mock for now)
  async getSongs(): Promise<Song[]> {
    return mockSongs;
  },

  // Get news
  async getNews(): Promise<News[]> {
    return mockNews;
  },

  // Get live news
  async getLiveNews(): Promise<News[]> {
    return mockNews.filter((item) => item.isLive);
  },

  // Get similar content
  async getSimilarContent(contentId: string, limit: number = 6): Promise<Content[]> {
    const tmdbId = parseInt(contentId.split('-')[1]);
    if (contentId.startsWith('movie')) return tmdbService.getSimilarMovies(tmdbId);
    if (contentId.startsWith('series')) return tmdbService.getSimilarSeries(tmdbId);
    return [];
  },

  // Search content
  async searchContent(query: string): Promise<Content[]> {
    return tmdbService.search(query);
  },

  // Filter content
  async filterContent(filters: Partial<FilterState>): Promise<Content[]> {
    // Basic mapping for now, tmdbService has popular/top_rated etc.
    if (filters.types?.includes('movie')) return tmdbService.getPopularMovies();
    if (filters.types?.includes('series')) return tmdbService.getPopularSeries();
    return tmdbService.getTrending();
  },
};
