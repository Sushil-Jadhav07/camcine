import { apiRequest, buildQuery, unwrapApiData } from './apiClient';
import { mockNews } from '@/data/mockData';

const fallbackPoster = '/Black Cat.png';

const secondsToRuntime = (seconds) => {
  if (!seconds) return null;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
};

const normalizeCastMember = (person = {}) => ({
  id: person.id || person.cast_id || person.actor_id || person.actor_name,
  name: person.actor_name || person.name || 'Unknown',
  character: person.character_name || person.role_type || '',
  role: person.role_type || '',
  avatar: person.headshot_url || person.cast_image || person.avatar || '',
  billingOrder: person.billing_order,
  isVerified: person.is_verified,
});

const groupEpisodesBySeason = (episodes = []) => {
  const seasons = new Map();

  episodes.forEach((episode) => {
    const seasonNumber = Number(episode.season || 1);
    if (!seasons.has(seasonNumber)) {
      seasons.set(seasonNumber, {
        id: `season-${seasonNumber}`,
        number: seasonNumber,
        title: `Season ${seasonNumber}`,
        episodes: [],
      });
    }

    seasons.get(seasonNumber).episodes.push({
      id: episode.id,
      number: episode.episode_number,
      title: episode.episode_title || episode.title || `Episode ${episode.episode_number}`,
      description: episode.description || '',
      duration: episode.duration_seconds || 0,
      runtime: secondsToRuntime(episode.duration_seconds),
      thumbnail: episode.thumbnail_url || '',
      videoUrl: episode.video_url || episode.stream_url_hls || episode.stream_url_dash || '',
      streamUrlHls: episode.stream_url_hls,
      streamUrlDash: episode.stream_url_dash,
      price: episode.price_tvod || 0,
      isFree: Boolean(episode.is_free),
      status: episode.status,
      airDate: episode.aired_date,
      cast: (episode.episode_cast || []).map(normalizeCastMember),
      raw: episode,
    });
  });

  return Array.from(seasons.values()).map((season) => ({
    ...season,
    episodes: season.episodes.sort((a, b) => (a.number || 0) - (b.number || 0)),
  }));
};

export const normalizeContent = (item = {}, forcedType) => {
  const apiType = forcedType || item.type || (item.song_name ? 'song' : item.series_name ? 'series' : 'movie');
  const type = apiType === 'show' ? 'series' : apiType;
  const title = item.title || item.series_name || item.song_name || 'Untitled';
  const poster = item.poster_url || item.thumbnail_url || item.poster || fallbackPoster;
  const thumbnail = item.thumbnail_url || item.poster_url || item.thumbnail || poster;
  const backdrop = item.backdrop_url || item.thumbnail_url || item.poster_url || item.backdrop || poster;
  const releaseYear = item.release_year || (item.aired_date ? new Date(item.aired_date).getFullYear() : undefined);
  const cast = (item.cast || item.artists || []).map(normalizeCastMember);

  return {
    ...item,
    id: item.id,
    apiType,
    type,
    title,
    displayTitle: title,
    description: item.description || '',
    poster,
    backdrop,
    thumbnail,
    trailer: item.trailer_url || '',
    trailerSrc: item.trailer_url || '',
    videoUrl: item.video_url || item.song_video_url || item.audio_url_hq || item.stream_url_hls || item.stream_url_dash || '',
    streamUrlHls: item.stream_url_hls,
    streamUrlDash: item.stream_url_dash,
    audioUrlHq: item.audio_url_hq,
    audioUrlLq: item.audio_url_lq,
    lyricsUrl: item.lyrics_url,
    releaseYear,
    rating: item.rating,
    tmdbRating: item.imdb_rating || item.rating_score || null,
    duration: item.duration_seconds || 0,
    runtime: secondsToRuntime(item.duration_seconds),
    genres: Array.isArray(item.genre) ? item.genre : item.genre ? [item.genre] : [],
    languages: item.language ? [item.language] : [],
    country: item.country || item.region || '',
    region: item.region || '',
    cast,
    crew: item.director ? [{ id: 'director', name: item.director, role: 'Director' }] : [],
    seasons: groupEpisodesBySeason(item.episodes || []),
    isFree: Boolean(item.is_free),
    price: item.price_tvod || 0,
    status: item.status,
    raw: item,
  };
};

const listFromResponse = (response, key, type) => {
  const data = unwrapApiData(response);
  return {
    items: (data?.[key] || []).map((item) => normalizeContent(item, type)),
    pagination: data?.pagination || null,
  };
};

const getOneFromResponse = (response, key, type) => {
  const data = unwrapApiData(response);
  return data?.[key] ? normalizeContent(data[key], type) : null;
};

const catalogRequest = async (endpoint, params = {}, authenticated = false) =>
  apiRequest(`${endpoint}${buildQuery(params)}`, { method: 'GET' }, authenticated);

const dedupeContent = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.id || `${item.type || item.apiType || 'content'}:${String(item.title || '').toLowerCase()}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const contentService = {
  async getMovies(params = {}) {
    return listFromResponse(await catalogRequest('/movies', params), 'movies', 'movie').items;
  },

  async getSeries(params = {}) {
    return listFromResponse(await catalogRequest('/episodes', params), 'series', 'series').items;
  },

  async getSongs(params = {}) {
    return listFromResponse(await catalogRequest('/songs', params), 'songs', 'song').items;
  },

  async getAllContent(params = {}) {
    const [movies, series, songs] = await Promise.all([
      this.getMovies({ ...params, limit: params.limit || 12, sort: params.sort || 'newest' }),
      this.getSeries({ ...params, limit: params.limit || 12, sort: params.sort || 'newest' }),
      this.getSongs({ ...params, limit: params.limit || 12, sort: params.sort || 'newest' }),
    ]);
    return [...movies, ...series, ...songs];
  },

  async getFeaturedContent() {
    const [trending, releases] = await Promise.allSettled([
      apiRequest('/content/trending'),
      apiRequest('/content/new-releases'),
    ]);
    const rows = [
      ...(trending.status === 'fulfilled' ? (unwrapApiData(trending.value)?.items || []) : []),
      ...(releases.status === 'fulfilled' ? (unwrapApiData(releases.value)?.items || []) : []),
    ];
    return rows.length
      ? dedupeContent(rows.map((item) => normalizeContent(item))).slice(0, 12)
      : dedupeContent(await this.getAllContent({ limit: 8, sort: 'newest' }));
  },

  async getTrendingContent() {
    try {
      const data = unwrapApiData(await apiRequest('/content/trending'));
      return (data?.items || []).map((item) => normalizeContent(item));
    } catch {
      return this.getAllContent({ limit: 12, sort: 'newest' });
    }
  },

  async getContentById(id, typeHint) {
    if (!id) return null;

    if (typeHint === 'movie') return getOneFromResponse(await apiRequest(`/movies/${id}`), 'movie', 'movie');
    if (typeHint === 'series') return getOneFromResponse(await apiRequest(`/episodes/${id}`), 'series', 'series');
    if (typeHint === 'song') return getOneFromResponse(await apiRequest(`/songs/${id}`), 'song', 'song');

    const attempts = [
      () => apiRequest(`/movies/${id}`).then((res) => getOneFromResponse(res, 'movie', 'movie')),
      () => apiRequest(`/episodes/${id}`).then((res) => getOneFromResponse(res, 'series', 'series')),
      () => apiRequest(`/songs/${id}`).then((res) => getOneFromResponse(res, 'song', 'song')),
    ];

    for (const attempt of attempts) {
      try {
        const content = await attempt();
        if (content) return content;
      } catch (error) {
        if (error.status !== 404) throw error;
      }
    }

    return null;
  },

  async getSimilarContent(contentId, limit = 6, typeHint) {
    const content = await this.getContentById(contentId, typeHint);
    if (!content) return [];

    const genre = content.genres?.[0];
    const params = { limit, genre, sort: 'newest' };
    const list =
      content.type === 'series'
        ? await this.getSeries(params)
        : content.type === 'song'
          ? await this.getSongs(params)
          : await this.getMovies(params);

    return list.filter((item) => item.id !== contentId).slice(0, limit);
  },

  async searchContent(query, params = {}) {
    if (!query?.trim()) return [];
    try {
      const data = unwrapApiData(await apiRequest(`/search${buildQuery({ q: query.trim(), type: params.type || 'all', page: params.page || 1, limit: params.limit || 24 })}`));
      return (data?.results || []).map((item) => normalizeContent(item, item.type === 'show' ? 'series' : item.type));
    } catch {
      const search = query.trim();
      const [movies, series, songs] = await Promise.all([
        this.getMovies({ ...params, search, limit: params.limit || 24 }),
        this.getSeries({ ...params, search, limit: params.limit || 24 }),
        this.getSongs({ ...params, search, limit: params.limit || 24 }),
      ]);
      return [...movies, ...series, ...songs];
    }
  },

  async filterContent(filters = {}) {
    const genre = filters.genre || filters.genres?.[0];
    const language = filters.language || filters.languages?.[0];
    const region = filters.region || filters.regions?.[0];
    const sort = filters.sort || filters.sortBy || 'newest';
    const params = { genre, language, region, sort, search: filters.search };
    const types = filters.types || [];

    if (types.includes('movie')) return this.getMovies(params);
    if (types.includes('series')) return this.getSeries(params);
    if (types.includes('song')) return this.getSongs(params);
    return this.getAllContent(params);
  },

  async createMovie(payload) {
    return getOneFromResponse(await apiRequest('/movies', { method: 'POST', body: JSON.stringify(payload) }, true), 'movie', 'movie');
  },

  async updateMovie(id, payload) {
    return getOneFromResponse(await apiRequest(`/movies/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, true), 'movie', 'movie');
  },

  async updateMovieStatus(id, status) {
    return apiRequest(`/movies/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, true);
  },

  async archiveMovie(id) {
    return apiRequest(`/movies/${id}`, { method: 'DELETE' }, true);
  },

  async createSeries(payload) {
    return getOneFromResponse(await apiRequest('/episodes', { method: 'POST', body: JSON.stringify(payload) }, true), 'series', 'series');
  },

  async updateSeries(id, payload) {
    return getOneFromResponse(await apiRequest(`/episodes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, true), 'series', 'series');
  },

  async addEpisode(seriesId, payload) {
    return apiRequest(`/episodes/${seriesId}/episode`, { method: 'POST', body: JSON.stringify(payload) }, true);
  },

  async archiveSeries(id) {
    return apiRequest(`/episodes/${id}`, { method: 'DELETE' }, true);
  },

  async createSong(payload) {
    return getOneFromResponse(await apiRequest('/songs', { method: 'POST', body: JSON.stringify(payload) }, true), 'song', 'song');
  },

  async updateSong(id, payload) {
    return getOneFromResponse(await apiRequest(`/songs/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, true), 'song', 'song');
  },

  async archiveSong(id) {
    return apiRequest(`/songs/${id}`, { method: 'DELETE' }, true);
  },

  async createDirectUploadUrl(resource, payload) {
    const endpointByResource = {
      movie: '/movies/upload/direct-url',
      series: '/episodes/upload/direct-url',
      episode: '/episodes/upload/direct-url',
      song: '/songs/upload/direct-url',
    };
    const endpoint = endpointByResource[resource];
    if (!endpoint) throw new Error('Unknown upload resource.');
    return unwrapApiData(await apiRequest(endpoint, { method: 'POST', body: JSON.stringify(payload) }, true));
  },

  async uploadDirect(resource, file, uploadType) {
    const direct = await this.createDirectUploadUrl(resource, {
      file_name: file.name,
      mime_type: file.type || 'application/octet-stream',
      upload_type: uploadType,
    });

    await fetch(direct.upload_url, {
      method: direct.method || 'PUT',
      headers: direct.headers || { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });

    return direct;
  },

  async uploadMultipart(endpoint, fileFields = {}, fields = {}) {
    const formData = new FormData();
    Object.entries(fileFields).forEach(([name, file]) => {
      if (file) formData.append(name, file);
    });
    Object.entries(fields).forEach(([name, value]) => {
      if (value !== undefined && value !== null) formData.append(name, value);
    });
    return unwrapApiData(await apiRequest(endpoint, { method: 'POST', body: formData }, true));
  },

  async recordView({ userId, contentId, episodeId, idempotencyKey }) {
    return unwrapApiData(await apiRequest('/views/record', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        content_id: contentId,
        episode_id: episodeId || undefined,
        idempotency_key: idempotencyKey || `${userId}-${contentId}-${episodeId || 'main'}-${Date.now()}`,
      }),
    }, true));
  },

  async getNews() {
    return mockNews;
  },

  async getLiveNews() {
    return mockNews.filter((item) => item.isLive);
  },
};
