// Camcine - User Service (Mock API)
import { mockWatchHistory, mockPurchases, allContent } from '@/data/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getWatchHistory(userId) {
    await delay(400);
    return mockWatchHistory.filter(h => {
      return true;
    });
  },

  async addToWatchHistory(userId, contentId, episodeId, progress) {
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

  async getWatchlist(userId) {
    await delay(400);
    return allContent.slice(0, 5);
  },

  async addToWatchlist(userId, contentId) {
    await delay(300);
  },

  async removeFromWatchlist(userId, contentId) {
    await delay(300);
  },

  async getPurchaseHistory(userId) {
    await delay(400);
    return mockPurchases.filter(p => p.userId === userId);
  },

  async isPurchased(userId, contentId, episodeId) {
    await delay(300);
    return mockPurchases.some(
      p => 
        p.userId === userId && 
        p.contentId === contentId && 
        (episodeId ? p.episodeId === episodeId : true) &&
        p.status === 'completed'
    );
  },

  async getRecommendations(userId) {
    await delay(600);
    return allContent
      .filter(item => item.isTrending || item.isFeatured)
      .slice(0, 8);
  },

  async getPersonalizedFeed(userId) {
    await delay(600);
    return allContent.slice(0, 12);
  },

  async updateWatchProgress(userId, contentId, progress, episodeId) {
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

  async getContinueWatching(userId) {
    await delay(400);
    const history = mockWatchHistory.slice(0, 4);
    
    return history.map(h => {
      const content = allContent.find(c => c.id === h.contentId);
      return {
        content: content,
        progress: h.progress,
        episodeId: h.episodeId,
      };
    }).filter(item => item.content);
  },

  async likeContent(userId, contentId) {
    await delay(300);
    const content = allContent.find(c => c.id === contentId);
    if (content) {
      content.likes += 1;
    }
  },

  async unlikeContent(userId, contentId) {
    await delay(300);
    const content = allContent.find(c => c.id === contentId);
    if (content && content.likes > 0) {
      content.likes -= 1;
    }
  },

  async reportContent(userId, contentId, reason) {
    await delay(500);
  },

  async getUserStats(userId) {
    await delay(400);
    return {
      totalWatched: mockWatchHistory.length,
      totalHours: Math.floor(mockWatchHistory.reduce((acc, h) => acc + h.progress, 0) / 3600),
      favoriteGenre: 'Drama',
      streak: 5,
    };
  },
};
