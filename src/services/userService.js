import { apiRequest, buildQuery, unwrapApiData } from './apiClient';
import { contentService, normalizeContent } from './contentService';
import { mockPurchases } from '@/data/mockData';

const normalizeHistoryItem = (item = {}) => {
  const rawContent = item.content || item.movie || item.series || item.song;
  const content = rawContent
    ? normalizeContent(rawContent)
    : item.content_id
      ? { id: item.content_id, title: item.content_title || 'Viewed content', poster: '/Black Cat.png' }
      : null;

  return {
    id: item.id || item.view_id,
    userId: item.user_id,
    contentId: item.content_id,
    episodeId: item.episode_id,
    progress: item.progress || 100,
    watchedAt: item.viewed_at || item.created_at || item.watchedAt || new Date(),
    pointsAwarded: item.points_awarded || 0,
    content,
    raw: item,
  };
};

export const userService = {
  async getUsers(params = {}) {
    const data = unwrapApiData(await apiRequest(`/users${buildQuery(params)}`, { method: 'GET' }, true));
    return {
      users: data?.users || [],
      pagination: data?.pagination || null,
    };
  },

  async getUser(userId) {
    const data = unwrapApiData(await apiRequest(`/users/${userId}`, { method: 'GET' }, true));
    return data?.user || data;
  },

  async updateUser(userId, updates) {
    const data = unwrapApiData(await apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }, true));
    return data?.user || data;
  },

  async deactivateUser(userId) {
    return apiRequest(`/users/${userId}`, { method: 'DELETE' }, true);
  },

  async getWatchHistory(userId, params = {}) {
    if (!userId) return [];

    const response = await apiRequest(
      `/views/user/${userId}/history${buildQuery(params)}`,
      { method: 'GET' },
      true
    );

    // API returns { success, data: { history/views/items, pagination } }
    const data = unwrapApiData(response);
    const rows = data?.history || data?.views || data?.items || [];
    return rows.map(normalizeHistoryItem);
  },

  async addToWatchHistory(userId, contentId, episodeId) {
    return contentService.recordView({
      userId,
      contentId,
      episodeId,
      idempotencyKey: `${userId}-${contentId}-${episodeId || 'main'}-${new Date().toISOString().slice(0, 10)}`,
    });
  },

  async getUserPoints(userId) {
    if (!userId) return null;
    const response = await apiRequest(`/views/user/${userId}/points`, { method: 'GET' }, true);
    return unwrapApiData(response);
  },

  async getContentStats(contentId) {
    if (!contentId) return null;
    const response = await apiRequest(`/views/content/${contentId}/stats`, { method: 'GET' }, true);
    return unwrapApiData(response);
  },

  async getWatchlist(userId) {
    const data = unwrapApiData(await apiRequest(`/users/${userId}/watchlist`, { method: 'GET' }, true));
    const rows = data?.items || data?.watchlist || [];
    return rows.map((item) => normalizeContent(item));
  },

  async addToWatchlist(userId, contentId) {
    if (!userId || !contentId) throw new Error('User id and content id are required');
    return apiRequest(`/users/${userId}/watchlist`, {
      method: 'POST',
      body: JSON.stringify({ content_id: contentId }),
    }, true);
  },

  async removeFromWatchlist(userId, contentId) {
    if (!userId || !contentId) throw new Error('User id and content id are required');
    return apiRequest(`/users/${userId}/watchlist/${contentId}`, { method: 'DELETE' }, true);
  },

  async getPurchaseHistory(userId) {
    return mockPurchases.filter((purchase) => purchase.userId === userId);
  },

  async isPurchased(userId, contentId, episodeId) {
    return mockPurchases.some(
      (purchase) =>
        purchase.userId === userId &&
        purchase.contentId === contentId &&
        (episodeId ? purchase.episodeId === episodeId : true) &&
        purchase.status === 'completed'
    );
  },

  async getRecommendations() {
    return contentService.getTrendingContent();
  },

  async getPersonalizedFeed(userId) {
    if (!userId) return contentService.getTrendingContent();
    const data = unwrapApiData(await apiRequest(`/users/${userId}/recommendations`, { method: 'GET' }, true));
    return {
      becauseYouWatched: (data?.because_you_watched || []).map((item) => normalizeContent(item)),
      trendingNow: (data?.trending_now || []).map((item) => normalizeContent(item)),
      newReleases: (data?.new_releases || []).map((item) => normalizeContent(item)),
      freeToWatch: (data?.free_to_watch || []).map((item) => normalizeContent(item)),
    };
  },

  async updateWatchProgress(userId, contentId, progress, episodeId) {
    return apiRequest(`/users/${userId}/progress`, {
      method: 'POST',
      body: JSON.stringify({
        content_id: contentId,
        episode_id: episodeId,
        progress_seconds: Math.max(0, Math.round(progress || 0)),
      }),
    }, true);
  },

  async getContinueWatching(userId) {
    const data = unwrapApiData(await apiRequest(`/users/${userId}/continue-watching`, { method: 'GET' }, true));
    return (data?.items || []).map((item) => ({
      ...item,
      content: normalizeContent({ ...item, id: item.content_id, thumbnail_url: item.thumbnail_url }),
      progress: item.progress_percent || 0,
      episodeId: item.episode_id,
      watchedAt: item.last_watched_at,
    }));
  },

  async likeContent() {
    return true;
  },

  async unlikeContent() {
    return true;
  },

  async reportContent() {
    return true;
  },

  async getUserStats(userId) {
    const [history, points] = await Promise.all([
      this.getWatchHistory(userId, { limit: 100 }),
      this.getUserPoints(userId).catch(() => null),
    ]);

    return {
      totalWatched: history.length,
      totalHours: Math.floor(history.length * 1.5),
      favoriteGenre: history[0]?.content?.genres?.[0] || 'N/A',
      streak: points?.daily_views_last_7_days?.filter((day) => day.view_count > 0).length || 0,
      points,
    };
  },
};
