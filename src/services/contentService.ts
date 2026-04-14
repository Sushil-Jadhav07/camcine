// Camcine - Content Service (Mock API)
import type { Content, Movie, Series, Song, News, FilterState } from '@/types';
import {
  allContent,
  mockMovies,
  mockSeries,
  mockSongs,
  mockNews,
  mockShortFilms,
} from '@/data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const contentService = {
  // Get all content
  async getAllContent(): Promise<Content[]> {
    await delay(500);
    return allContent;
  },

  // Get content by ID
  async getContentById(id: string): Promise<Content | null> {
    await delay(300);
    return allContent.find(item => item.id === id) || null;
  },

  // Get featured content
  async getFeaturedContent(): Promise<Content[]> {
    await delay(400);
    return allContent.filter(item => item.isFeatured);
  },

  // Get trending content
  async getTrendingContent(): Promise<Content[]> {
    await delay(400);
    return allContent.filter(item => item.isTrending);
  },

  // Get movies
  async getMovies(): Promise<Movie[]> {
    await delay(400);
    return mockMovies;
  },

  // Get series
  async getSeries(): Promise<Series[]> {
    await delay(400);
    return mockSeries;
  },

  // Get songs
  async getSongs(): Promise<Song[]> {
    await delay(400);
    return mockSongs;
  },

  // Get news
  async getNews(): Promise<News[]> {
    await delay(400);
    return mockNews;
  },

  // Get short films
  async getShortFilms(): Promise<Content[]> {
    await delay(400);
    return mockShortFilms;
  },

  // Get live news
  async getLiveNews(): Promise<News[]> {
    await delay(300);
    return mockNews.filter(item => item.isLive);
  },

  // Get content by genre
  async getContentByGenre(genre: string): Promise<Content[]> {
    await delay(400);
    return allContent.filter(item => item.genres.includes(genre));
  },

  // Get content by language
  async getContentByLanguage(language: string): Promise<Content[]> {
    await delay(400);
    return allContent.filter(item => item.languages.includes(language));
  },

  // Get content by region
  async getContentByRegion(region: string): Promise<Content[]> {
    await delay(400);
    return allContent.filter(item => item.region === region);
  },

  // Get content by mood
  async getContentByMood(mood: string): Promise<Content[]> {
    await delay(400);
    return allContent.filter(item => item.mood?.includes(mood));
  },

  // Get similar content
  async getSimilarContent(contentId: string, limit: number = 6): Promise<Content[]> {
    await delay(500);
    const content = allContent.find(item => item.id === contentId);
    if (!content) return [];

    return allContent
      .filter(item => 
        item.id !== contentId && 
        (item.genres.some(g => content.genres.includes(g)) ||
         item.languages.some(l => content.languages.includes(l)))
      )
      .slice(0, limit);
  },

  // Search content
  async searchContent(query: string): Promise<Content[]> {
    await delay(600);
    const lowerQuery = query.toLowerCase();
    return allContent.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.genres.some(g => g.toLowerCase().includes(lowerQuery)) ||
      item.cast.some(c => c.name.toLowerCase().includes(lowerQuery))
    );
  },

  // Filter content
  async filterContent(filters: Partial<FilterState>): Promise<Content[]> {
    await delay(600);
    let filtered = [...allContent];

    if (filters.types?.length) {
      filtered = filtered.filter(item => filters.types?.includes(item.type));
    }

    if (filters.languages?.length) {
      filtered = filtered.filter(item =>
        item.languages.some(l => filters.languages?.includes(l))
      );
    }

    if (filters.genres?.length) {
      filtered = filtered.filter(item =>
        item.genres.some(g => filters.genres?.includes(g))
      );
    }

    if (filters.regions?.length) {
      filtered = filtered.filter(item => filters.regions?.includes(item.region));
    }

    if (filters.moods?.length) {
      filtered = filtered.filter(item =>
        item.mood?.some(m => filters.moods?.includes(m))
      );
    }

    if (filters.yearRange) {
      filtered = filtered.filter(
        item =>
          item.releaseYear >= filters.yearRange![0] &&
          item.releaseYear <= filters.yearRange![1]
      );
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'popular':
          filtered.sort((a, b) => b.viewCount - a.viewCount);
          break;
        case 'newest':
          filtered.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'rating':
          filtered.sort((a, b) => b.likes - a.likes);
          break;
      }
    }

    return filtered;
  },

  // Get curated picks
  async getCuratedPicks(): Promise<Content[]> {
    await delay(500);
    return allContent
      .filter(item => item.isFeatured || item.isTrending)
      .slice(0, 3);
  },

  // Get continue watching
  async getContinueWatching(userId: string): Promise<Content[]> {
    await delay(400);
    // Mock: return some content as "continue watching"
    return allContent.slice(0, 4);
  },

  // Get regional picks
  async getRegionalPicks(region: string): Promise<Content[]> {
    await delay(400);
    return allContent
      .filter(item => item.region === region || item.languages.includes(region))
      .slice(0, 6);
  },
};
