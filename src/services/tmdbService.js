// src/services/tmdbService.js
// TMDB API Service — falls back to mock data if API is unavailable

import { mockMovies, mockSeries } from '@/data/mockData';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p';

const USE_MOCK = !API_KEY || !TOKEN;

if (USE_MOCK) {
  console.warn('[TMDB] No API credentials found. Using mock data. Create a .env file with VITE_TMDB_API_KEY and VITE_TMDB_TOKEN.');
}

export const tmdbImage = {
  poster: (path, size = 'w500') =>
    path ? `${IMAGE_URL}/${size}${path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop',

  backdrop: (path, size = 'w1280') =>
    path ? `${IMAGE_URL}/${size}${path}` : 'https://images.unsplash.com/photo-1514306191717-45224512c2d0?w=1920&h=1080&fit=crop',

  profile: (path, size = 'w185') =>
    path ? `${IMAGE_URL}/${size}${path}` : null,
};

async function tmdbFetch(endpoint, params = {}) {
  if (USE_MOCK) return null;
  
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`[TMDB] Fetch error for ${endpoint}:`, error);
    return null;
  }
}

function transformMovie(movie) {
  return {
    id: `movie-${movie.id}`,
    tmdbId: movie.id,
    title: movie.title || movie.original_title,
    description: movie.overview,
    type: 'movie',
    status: 'premium',
    poster: tmdbImage.poster(movie.poster_path),
    backdrop: tmdbImage.backdrop(movie.backdrop_path),
    releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
    rating: movie.adult ? 'A' : 'U/A',
    tmdbRating: movie.vote_average?.toFixed(1),
    duration: movie.runtime ? movie.runtime * 60 : 7200,
    genres: movie.genres?.map((g) => g.name) || movie.genre_ids?.slice(0, 2).map(genreIdToName) || ['Drama'],
    languages: movie.original_language ? [movie.original_language.toUpperCase()] : ['EN'],
    region: 'Hollywood',
    mood: [],
    cast: movie.credits?.cast?.slice(0, 6).map((c) => ({
      id: `cast-${c.id}`,
      name: c.name,
      character: c.character,
      avatar: tmdbImage.profile(c.profile_path),
    })) || [],
    crew: movie.credits?.crew?.filter((c) => c.job === 'Director').slice(0, 2).map((c) => ({
      id: `crew-${c.id}`,
      name: c.name,
      role: c.job,
    })) || [],
    tags: movie.keywords?.keywords?.slice(0, 5).map((k) => k.name) || [],
    isTrending: movie.popularity > 100,
    isFeatured: movie.vote_average > 7.5,
    viewCount: Math.round(movie.popularity * 1000),
    likes: Math.round(movie.vote_count * 10),
    videoUrl: '',
    trailer: movie.videos?.results?.find((v) => v.type === 'Trailer')?.key
      ? `https://www.youtube.com/watch?v=${movie.videos.results.find((v) => v.type === 'Trailer').key}`
      : '',
  };
}

function transformSeries(show) {
  return {
    id: `series-${show.id}`,
    tmdbId: show.id,
    title: show.name || show.original_name,
    description: show.overview,
    type: 'series',
    status: 'premium',
    poster: tmdbImage.poster(show.poster_path),
    backdrop: tmdbImage.backdrop(show.backdrop_path),
    releaseYear: show.first_air_date ? new Date(show.first_air_date).getFullYear() : 2024,
    rating: show.adult ? 'A' : 'U/A',
    tmdbRating: show.vote_average?.toFixed(1),
    duration: 0,
    genres: show.genres?.map((g) => g.name) || show.genre_ids?.slice(0, 2).map(genreIdToName) || ['Drama'],
    languages: show.original_language ? [show.original_language.toUpperCase()] : ['EN'],
    region: 'Hollywood',
    mood: [],
    cast: show.credits?.cast?.slice(0, 6).map((c) => ({
      id: `cast-${c.id}`,
      name: c.name,
      character: c.character,
      avatar: tmdbImage.profile(c.profile_path),
    })) || [],
    crew: show.credits?.crew?.filter((c) => c.job === 'Director' || c.job === 'Executive Producer').slice(0, 2).map((c) => ({
      id: `crew-${c.id}`,
      name: c.name,
      role: c.job,
    })) || [],
    tags: show.keywords?.results?.slice(0, 5).map((k) => k.name) || [],
    isTrending: show.popularity > 100,
    isFeatured: show.vote_average > 7.5,
    viewCount: Math.round(show.popularity * 1000),
    likes: Math.round(show.vote_count * 10),
    seasons: show.seasons?.map((s) => ({
      id: s.id,
      number: s.season_number,
      title: s.name,
      episodeCount: s.episode_count,
      poster: tmdbImage.poster(s.poster_path),
      episodes: [],
    })) || [],
    totalEpisodes: show.number_of_episodes,
    videoUrl: '',
    trailer: show.videos?.results?.find((v) => v.type === 'Trailer')?.key
      ? `https://www.youtube.com/watch?v=${show.videos.results.find((v) => v.type === 'Trailer').key}`
      : '',
  };
}

function genreIdToName(id) {
  const map = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
    10752: 'War', 37: 'Western', 10759: 'Action & Adventure',
    10762: 'Kids', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy',
    10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics',
  };
  return map[id] || 'Drama';
}

export const tmdbService = {

  async getTrending() {
    if (USE_MOCK) {
      return [...mockMovies.slice(0, 6), ...mockSeries.slice(0, 4)];
    }
    
    const [movies, shows] = await Promise.all([
      tmdbFetch('/trending/movie/week'),
      tmdbFetch('/trending/tv/week'),
    ]);
    
    if (!movies?.results && !shows?.results) {
      return [...mockMovies.slice(0, 6), ...mockSeries.slice(0, 4)];
    }
    
    return [
      ...(movies?.results || []).slice(0, 8).map(transformMovie),
      ...(shows?.results || []).slice(0, 4).map(transformSeries),
    ];
  },

  async getPopularMovies() {
    if (USE_MOCK) {
      return mockMovies;
    }
    
    const data = await tmdbFetch('/movie/popular');
    if (!data?.results) {
      return mockMovies;
    }
    return data.results.slice(0, 12).map(transformMovie);
  },

  async getNowPlaying() {
    if (USE_MOCK) {
      return mockMovies.slice(0, 8);
    }
    
    const data = await tmdbFetch('/movie/now_playing');
    if (!data?.results) {
      return mockMovies.slice(0, 8);
    }
    return data.results.slice(0, 10).map(transformMovie);
  },

  async getTopRated() {
    if (USE_MOCK) {
      return mockMovies.slice(0, 10);
    }
    
    const data = await tmdbFetch('/movie/top_rated');
    if (!data?.results) {
      return mockMovies.slice(0, 10);
    }
    return data.results.slice(0, 12).map(transformMovie);
  },

  async getPopularSeries() {
    if (USE_MOCK) {
      return mockSeries;
    }
    
    const data = await tmdbFetch('/tv/popular');
    if (!data?.results) {
      return mockSeries;
    }
    return data.results.slice(0, 12).map(transformSeries);
  },

  async getFeatured() {
    if (USE_MOCK) {
      return mockMovies.filter((m) => m.isFeatured).slice(0, 5);
    }
    
    const data = await tmdbFetch('/movie/top_rated', { page: '1' });
    if (!data?.results) {
      return mockMovies.filter((m) => m.isFeatured).slice(0, 5);
    }
    return data.results.filter((m) => m.backdrop_path).slice(0, 5).map(transformMovie);
  },

  async search(query) {
    if (!query.trim()) return [];
    
    if (USE_MOCK) {
      const q = query.toLowerCase();
      return [...mockMovies, ...mockSeries].filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }
    
    const data = await tmdbFetch('/search/multi', { query, include_adult: 'false' });
    if (!data?.results) {
      return [];
    }
    return data.results
      .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
      .slice(0, 20)
      .map((r) => r.media_type === 'movie' ? transformMovie(r) : transformSeries(r));
  },

  async getMovieDetails(tmdbId) {
    if (USE_MOCK) {
      return mockMovies.find((m) => m.id === `movie-${tmdbId}`) || mockMovies[0];
    }
    
    const data = await tmdbFetch(`/movie/${tmdbId}`, {
      append_to_response: 'credits,videos,keywords',
    });
    if (!data) {
      return mockMovies.find((m) => m.id === `movie-${tmdbId}`) || mockMovies[0];
    }
    return transformMovie(data);
  },

  async getSimilarMovies(tmdbId) {
    if (USE_MOCK) {
      return mockMovies.slice(0, 6);
    }
    
    const data = await tmdbFetch(`/movie/${tmdbId}/similar`);
    if (!data?.results) {
      return mockMovies.slice(0, 6);
    }
    return data.results.slice(0, 8).map(transformMovie);
  },

  async getSeriesDetails(tmdbId) {
    if (USE_MOCK) {
      return mockSeries.find((s) => s.id === `series-${tmdbId}`) || mockSeries[0];
    }
    
    const data = await tmdbFetch(`/tv/${tmdbId}`, {
      append_to_response: 'credits,videos,keywords',
    });
    if (!data) {
      return mockSeries.find((s) => s.id === `series-${tmdbId}`) || mockSeries[0];
    }
    const show = transformSeries(data);
    
    const firstSeasonNum = data.seasons?.find((s) => s.season_number > 0)?.season_number || 0;
    if (show.seasons.length > 0) {
      const seasonData = await this.getSeasonDetails(tmdbId, firstSeasonNum);
      show.seasons[show.seasons.findIndex((s) => s.number === firstSeasonNum)].episodes = seasonData;
    }
    
    return show;
  },

  async getSeasonDetails(tmdbId, seasonNumber) {
    if (USE_MOCK) {
      return [
        { id: 'ep-1', number: 1, title: 'Episode 1', description: 'First episode', thumbnail: null, duration: 3600, airDate: '2024-01-01' },
        { id: 'ep-2', number: 2, title: 'Episode 2', description: 'Second episode', thumbnail: null, duration: 3600, airDate: '2024-01-08' },
      ];
    }
    
    const data = await tmdbFetch(`/tv/${tmdbId}/season/${seasonNumber}`);
    if (!data?.episodes) {
      return [];
    }
    return data.episodes.map((ep) => ({
      id: `episode-${ep.id}`,
      tmdbId: ep.id,
      number: ep.episode_number,
      title: ep.name,
      description: ep.overview,
      thumbnail: tmdbImage.backdrop(ep.still_path, 'w780'),
      duration: ep.runtime ? ep.runtime * 60 : 3000,
      airDate: ep.air_date || '',
    }));
  },

  async getSimilarSeries(tmdbId) {
    if (USE_MOCK) {
      return mockSeries.slice(0, 6);
    }
    
    const data = await tmdbFetch(`/tv/${tmdbId}/similar`);
    if (!data?.results) {
      return mockSeries.slice(0, 6);
    }
    return data.results.slice(0, 8).map(transformSeries);
  },

  async getByGenre(genreId, type = 'movie') {
    if (USE_MOCK) {
      const genreName = Object.entries(this.genreMap).find(([, id]) => id === genreId)?.[0] || 'Drama';
      const items = type === 'movie' ? mockMovies : mockSeries;
      return items.filter((item) => item.genres?.includes(genreName)).slice(0, 20);
    }
    
    const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
    const data = await tmdbFetch(endpoint, {
      with_genres: String(genreId),
      sort_by: 'popularity.desc',
    });
    if (!data?.results) {
      return [];
    }
    return data.results.slice(0, 20).map(
      type === 'movie' ? transformMovie : transformSeries
    );
  },

  genreMap: {
    Action: 28, Drama: 18, Thriller: 53, Comedy: 35,
    Horror: 27, 'Sci-Fi': 878, Romance: 10749,
    Animation: 16, Documentary: 99,
  },
};
