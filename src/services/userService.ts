// Camcine - User Service (Mock API)
import type { WatchHistory, Purchase, Content } from '@/types';
import { mockWatchHistory, mockPurchases, allContent } from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  // Get watch history
  async getWatchHistory(userId: string): Promise<WatchHistory[]> {
    await delay(400);
    return mockWatchHistory.filter(h => {
      // In real implementation, filter by userId
      return true;
    });
  },

  // Add to watch history
  async addToWatchHistory(userId: string, contentId: string, episodeId: string | undefined, progress: number): Promise<void> {
    await delay(300);
    const existingIndex = mockWatchHistory.findIndex(
      h => h.contentId === contentId && h.episodeId === episodeId
    );
    
    if (existingIndex !== -1) {
      mockWatchHistory[existingIndex].progress = progress;
      mockWatchHistory[existingIndex].watchedAt = new Date();
    } else {
      mockWatchHistory.push({
        contentId,
        episodeId,
        progress,
        watchedAt: new Date(),
      });
    }
  },

  // Get watchlist
  async getWatchlist(userId: string): Promise<Content[]> {
    await delay(400);
    // Mock: return some content as "watchlist"
    return allContent.slice(0, 5);
  },

  // Add to watchlist
  async addToWatchlist(userId: string, contentId: string): Promise<void> {
    await delay(300);
    // In real implementation, add to user's watchlist
  },

  // Remove from watchlist
  async removeFromWatchlist(userId: string, contentId: string): Promise<void> {
    await delay(300);
    // In real implementation, remove from user's watchlist
  },

  // Get purchase history
  async getPurchaseHistory(userId: string): Promise<Purchase[]> {
    await delay(400);
    return mockPurchases.filter(p => p.userId === userId);
  },

  // Check if content is purchased
  async isPurchased(userId: string, contentId: string, episodeId?: string): Promise<boolean> {
    await delay(300);
    return mockPurchases.some(
      p => 
        p.userId === userId && 
        p.contentId === contentId && 
        (episodeId ? p.episodeId === episodeId : true) &&
        p.status === 'completed'
    );
  },

  // Get recommendations
  async getRecommendations(userId: string): Promise<Content[]> {
    await delay(600);
    // Mock: return trending and featured content as recommendations
    return allContent
      .filter(item => item.isTrending || item.isFeatured)
      .slice(0, 8);
  },

  // Get personalized feed
  async getPersonalizedFeed(userId: string): Promise<Content[]> {
    await delay(600);
    // Mock: return mixed content as personalized feed
    return allContent.slice(0, 12);
  },

  // Update watch progress
  async updateWatchProgress(userId: string, contentId: string, progress: number, episodeId?: string): Promise<void> {
    await delay(300);
    const existingIndex = mockWatchHistory.findIndex(
      h => h.contentId === contentId && h.episodeId === episodeId
    );
    
    if (existingIndex !== -1) {
      mockWatchHistory[existingIndex].progress = progress;
      mockWatchHistory[existingIndex].watchedAt = new Date();
    } else {
      mockWatchHistory.push({
        contentId,
        episodeId,
        progress,
        watchedAt: new Date(),
      });
    }
  },

  // Get continue watching
  async getContinueWatching(userId: string): Promise<Array<{ content: Content; progress: number; episodeId?: string }>> {
    await delay(400);
    const history = mockWatchHistory.slice(0, 4);
    
    return history.map(h => {
      const content = allContent.find(c => c.id === h.contentId);
      return {
        content: content!,
        progress: h.progress,
        episodeId: h.episodeId,
      };
    }).filter(item => item.content);
  },

  // Like content
  async likeContent(userId: string, contentId: string): Promise<void> {
    await delay(300);
    const content = allContent.find(c => c.id === contentId);
    if (content) {
      content.likes += 1;
    }
  },

  // Unlike content
  async unlikeContent(userId: string, contentId: string): Promise<void> {
    await delay(300);
    const content = allContent.find(c => c.id === contentId);
    if (content && content.likes > 0) {
      content.likes -= 1;
    }
  },

  // Report content
  async reportContent(userId: string, contentId: string, reason: string): Promise<void> {
    await delay(500);
    // In real implementation, save report
  },

  // Get user stats
  async getUserStats(userId: string): Promise<{
    totalWatched: number;
    totalHours: number;
    favoriteGenre: string;
    streak: number;
  }> {
    await delay(400);
    return {
      totalWatched: mockWatchHistory.length,
      totalHours: Math.floor(mockWatchHistory.reduce((acc, h) => acc + h.progress, 0) / 3600),
      favoriteGenre: 'Drama',
      streak: 5,
    };
  },
};
