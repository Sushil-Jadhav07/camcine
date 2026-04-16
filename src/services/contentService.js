// Camcine - Content Service (TMDB Powered)
import { tmdbService } from './tmdbService';
import {
  mockSongs,
  mockNews,
} from '@/data/mockData';

export const contentService = {
  async getAllContent() {
    return tmdbService.getTrending();
  },

  async getContentById(id) {
    const tmdbId = parseInt(id.split('-')[1]);
    if (id.startsWith('movie')) return tmdbService.getMovieDetails(tmdbId);
    if (id.startsWith('series')) return tmdbService.getSeriesDetails(tmdbId);
    return null;
  },

  async getFeaturedContent() {
    return tmdbService.getFeatured();
  },

  async getTrendingContent() {
    return tmdbService.getTrending();
  },

  async getMovies() {
    return tmdbService.getPopularMovies();
  },

  async getSeries() {
    return tmdbService.getPopularSeries();
  },

  async getSongs() {
    return mockSongs;
  },

  async getNews() {
    return mockNews;
  },

  async getLiveNews() {
    return mockNews.filter((item) => item.isLive);
  },

  async getSimilarContent(contentId, limit = 6) {
    const tmdbId = parseInt(contentId.split('-')[1]);
    if (contentId.startsWith('movie')) return tmdbService.getSimilarMovies(tmdbId);
    if (contentId.startsWith('series')) return tmdbService.getSimilarSeries(tmdbId);
    return [];
  },

  async searchContent(query) {
    return tmdbService.search(query);
  },

  async filterContent(filters) {
    if (filters.types?.includes('movie')) return tmdbService.getPopularMovies();
    if (filters.types?.includes('series')) return tmdbService.getPopularSeries();
    return tmdbService.getTrending();
  },
};
