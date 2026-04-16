// Camcine - User Service (Mock API)
import { mockWatchHistory, mockPurchases, allContent } from '@/data/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// local in-memory watchlist store by userId
const watchlistByUser = {
  'user-1': allContent.slice(0, 5).map((item) => item.id),
  'user-2': [],
  'user-3': [],
  'user-4': [],
};

export const userService = {
  async getWatchHistory(userId) {
    await delay(400);

    return mockWatchHistory
      .filter((h) => !userId || h.userId === userId || !h.userId)
      .map((h) => {
        const content = allContent.find((c) => c.id === h.contentId);
        return {
          ...h,
          content,
        };
      })
      .filter((item) => item.content);
  },

  async addToWatchHistory(userId, contentId, episodeId, progress) {
    await delay(300);

    const existingIndex = mockWatchHistory.findIndex(
      (h) =>
        h.userId === userId &&
        h.contentId === contentId &&
        h.episodeId === episodeId
    );

    if (existingIndex !== -1) {
      mockWatchHistory[existingIndex].progress = progress;
      mockWatchHistory[existingIndex].watchedAt = new Date();
    } else {
      mockWatchHistory.push({
        userId,
        contentId,
        episodeId,
        progress,
        watchedAt: new Date(),
      });
    }
  },

  async getWatchlist(userId) {
    await delay(400);

    const ids = watchlistByUser[userId] || [];
    return ids
      .map((id) => allContent.find((item) => item.id === id))
      .filter(Boolean);
  },

  async addToWatchlist(userId, contentId) {
    await delay(300);

    if (!userId || !contentId) {
      throw new Error('User id and content id are required');
    }

    if (!watchlistByUser[userId]) {
      watchlistByUser[userId] = [];
    }

    if (!watchlistByUser[userId].includes(contentId)) {
      watchlistByUser[userId].push(contentId);
    }

    return true;
  },

  async removeFromWatchlist(userId, contentId) {
    await delay(300);

    if (!userId || !contentId) {
      throw new Error('User id and content id are required');
    }

    if (!watchlistByUser[userId]) {
      watchlistByUser[userId] = [];
      return true;
    }

    watchlistByUser[userId] = watchlistByUser[userId].filter(
      (id) => id !== contentId
    );

    return true;
  },

  async getPurchaseHistory(userId) {
    await delay(400);
    return mockPurchases.filter((p) => p.userId === userId);
  },

  async isPurchased(userId, contentId, episodeId) {
    await delay(300);
    return mockPurchases.some(
      (p) =>
        p.userId === userId &&
        p.contentId === contentId &&
        (episodeId ? p.episodeId === episodeId : true) &&
        p.status === 'completed'
    );
  },

  async getRecommendations(userId) {
    await delay(600);
    return allContent
      .filter((item) => item.isTrending || item.isFeatured)
      .slice(0, 8);
  },

  async getPersonalizedFeed(userId) {
    await delay(600);
    return allContent.slice(0, 12);
  },

  async updateWatchProgress(userId, contentId, progress, episodeId) {
    await delay(300);

    const existingIndex = mockWatchHistory.findIndex(
      (h) =>
        h.userId === userId &&
        h.contentId === contentId &&
        h.episodeId === episodeId
    );

    if (existingIndex !== -1) {
      mockWatchHistory[existingIndex].progress = progress;
      mockWatchHistory[existingIndex].watchedAt = new Date();
    } else {
      mockWatchHistory.push({
        userId,
        contentId,
        episodeId,
        progress,
        watchedAt: new Date(),
      });
    }
  },

  async getContinueWatching(userId) {
    await delay(400);

    const history = mockWatchHistory
      .filter((h) => !userId || h.userId === userId || !h.userId)
      .slice(0, 6);

    return history
      .map((h) => {
        const content = allContent.find((c) => c.id === h.contentId);
        return {
          content,
          progress: h.progress,
          episodeId: h.episodeId,
          watchedAt: h.watchedAt,
        };
      })
      .filter((item) => item.content);
  },

  async likeContent(userId, contentId) {
    await delay(300);
    const content = allContent.find((c) => c.id === contentId);
    if (content) {
      content.likes += 1;
    }
  },

  async unlikeContent(userId, contentId) {
    await delay(300);
    const content = allContent.find((c) => c.id === contentId);
    if (content && content.likes > 0) {
      content.likes -= 1;
    }
  },

  async reportContent(userId, contentId, reason) {
    await delay(500);
    return true;
  },

  async getUserStats(userId) {
    await delay(400);
    return {
      totalWatched: mockWatchHistory.length,
      totalHours: Math.floor(
        mockWatchHistory.reduce((acc, h) => acc + (h.progress || 0), 0) / 3600
      ),
      favoriteGenre: 'Drama',
      streak: 5,
    };
  },
};