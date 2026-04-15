// src/services/tmdbService.ts
// TMDB API Service — replace mock data with real movie/show data

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p';

// ── Image URL helpers ──────────────────────────────────────
export const tmdbImage = {
  poster: (path: string | null, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500') =>
    path ? `${IMAGE_URL}/${size}${path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop',

  backdrop: (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') =>
    path ? `${IMAGE_URL}/${size}${path}` : 'https://images.unsplash.com/photo-1514306191717-45224512c2d0?w=1920&h=1080&fit=crop',

  profile: (path: string | null, size: 'w185' | 'w342' | 'h632' | 'original' = 'w185') =>
    path ? `${IMAGE_URL}/${size}${path}` : null,
};

// ── Base fetch with auth ───────────────────────────────────
async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

// ── Transform TMDB movie → Camcine Content shape ──────────
function transformMovie(movie: any): any {
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
    genres: movie.genres?.map((g: any) => g.name) || movie.genre_ids?.slice(0, 2).map(genreIdToName) || ['Drama'],
    languages: movie.original_language ? [movie.original_language.toUpperCase()] : ['EN'],
    region: 'Hollywood',
    mood: [],
    cast: movie.credits?.cast?.slice(0, 6).map((c: any) => ({
      id: `cast-${c.id}`,
      name: c.name,
      character: c.character,
      avatar: tmdbImage.profile(c.profile_path),
    })) || [],
    crew: movie.credits?.crew?.filter((c: any) => c.job === 'Director').slice(0, 2).map((c: any) => ({
      id: `crew-${c.id}`,
      name: c.name,
      role: c.job,
    })) || [],
    tags: movie.keywords?.keywords?.slice(0, 5).map((k: any) => k.name) || [],
    isTrending: movie.popularity > 100,
    isFeatured: movie.vote_average > 7.5,
    viewCount: Math.round(movie.popularity * 1000),
    likes: Math.round(movie.vote_count * 10),
    videoUrl: '',  // No free streams from TMDB — leave empty or use embed
    trailer: movie.videos?.results?.find((v: any) => v.type === 'Trailer')?.key
      ? `https://www.youtube.com/watch?v=${movie.videos.results.find((v: any) => v.type === 'Trailer').key}`
      : '',
  };
}

// ── Transform TMDB TV show → Camcine Content shape ────────
function transformSeries(show: any): any {
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
    genres: show.genres?.map((g: any) => g.name) || show.genre_ids?.slice(0, 2).map(genreIdToName) || ['Drama'],
    languages: show.original_language ? [show.original_language.toUpperCase()] : ['EN'],
    region: 'Hollywood',
    mood: [],
    cast: show.credits?.cast?.slice(0, 6).map((c: any) => ({
      id: `cast-${c.id}`,
      name: c.name,
      character: c.character,
      avatar: tmdbImage.profile(c.profile_path),
    })) || [],
    crew: show.credits?.crew?.filter((c: any) => c.job === 'Director' || c.job === 'Executive Producer').slice(0, 2).map((c: any) => ({
      id: `crew-${c.id}`,
      name: c.name,
      role: c.job,
    })) || [],
    tags: show.keywords?.results?.slice(0, 5).map((k: any) => k.name) || [],
    isTrending: show.popularity > 100,
    isFeatured: show.vote_average > 7.5,
    viewCount: Math.round(show.popularity * 1000),
    likes: Math.round(show.vote_count * 10),
    seasons: show.seasons?.map((s: any) => ({
      id: s.id,
      number: s.season_number,
      title: s.name,
      episodeCount: s.episode_count,
      poster: tmdbImage.poster(s.poster_path),
      episodes: [], // Will be filled by getSeasonDetails if needed
    })) || [],
    totalEpisodes: show.number_of_episodes,
    videoUrl: '',
    trailer: show.videos?.results?.find((v: any) => v.type === 'Trailer')?.key
      ? `https://www.youtube.com/watch?v=${show.videos.results.find((v: any) => v.type === 'Trailer').key}`
      : '',
  };
}

// ── TMDB genre ID → name map (common ones) ─────────────────
function genreIdToName(id: number): string {
  const map: Record<number, string> = {
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

// ═══════════════════════════════════════════════════════════
// PUBLIC API — drop-in replacements for contentService
// ═══════════════════════════════════════════════════════════

export const tmdbService = {

  // Trending movies + shows (replaces getTrendingContent)
  async getTrending(): Promise<any[]> {
    const [movies, shows] = await Promise.all([
      tmdbFetch('/trending/movie/week'),
      tmdbFetch('/trending/tv/week'),
    ]);
    return [
      ...movies.results.slice(0, 8).map(transformMovie),
      ...shows.results.slice(0, 4).map(transformSeries),
    ];
  },

  // Popular movies (replaces getMovies / getCuratedPicks for movies)
  async getPopularMovies(): Promise<any[]> {
    const data = await tmdbFetch('/movie/popular');
    return data.results.slice(0, 12).map(transformMovie);
  },

  // Now playing in theatres
  async getNowPlaying(): Promise<any[]> {
    const data = await tmdbFetch('/movie/now_playing');
    return data.results.slice(0, 10).map(transformMovie);
  },

  // Top rated movies
  async getTopRated(): Promise<any[]> {
    const data = await tmdbFetch('/movie/top_rated');
    return data.results.slice(0, 12).map(transformMovie);
  },

  // Popular TV series (replaces getSeries)
  async getPopularSeries(): Promise<any[]> {
    const data = await tmdbFetch('/tv/popular');
    return data.results.slice(0, 12).map(transformSeries);
  },

  // Featured content (replaces getFeaturedContent)
  async getFeatured(): Promise<any[]> {
    const data = await tmdbFetch('/movie/top_rated', { page: '1' });
    return data.results.filter((m: any) => m.backdrop_path).slice(0, 5).map(transformMovie);
  },

  // Search movies + shows (replaces searchContent)
  async search(query: string): Promise<any[]> {
    if (!query.trim()) return [];
    const data = await tmdbFetch('/search/multi', { query, include_adult: 'false' });
    return data.results
      .filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv')
      .slice(0, 20)
      .map((r: any) => r.media_type === 'movie' ? transformMovie(r) : transformSeries(r));
  },

  // Get single movie details with credits + videos
  async getMovieDetails(tmdbId: number): Promise<any> {
    const data = await tmdbFetch(`/movie/${tmdbId}`, {
      append_to_response: 'credits,videos,keywords',
    });
    return transformMovie(data);
  },

  // Get similar movies
  async getSimilarMovies(tmdbId: number): Promise<any[]> {
    const data = await tmdbFetch(`/movie/${tmdbId}/similar`);
    return data.results.slice(0, 8).map(transformMovie);
  },

  // Get single TV show details
  async getSeriesDetails(tmdbId: number): Promise<any> {
    const data = await tmdbFetch(`/tv/${tmdbId}`, {
      append_to_response: 'credits,videos,keywords',
    });
    const show = transformSeries(data);
    
    // Auto-fetch episodes for first season (usually 1, but TMDB sometimes has 0 for specials)
    const firstSeasonNum = data.seasons?.find((s: any) => s.season_number > 0)?.season_number || 0;
    if (show.seasons.length > 0) {
      const seasonData = await this.getSeasonDetails(tmdbId, firstSeasonNum);
      show.seasons[show.seasons.findIndex((s: any) => s.number === firstSeasonNum)].episodes = seasonData;
    }
    
    return show;
  },

  // Get episodes for a specific season
  async getSeasonDetails(tmdbId: number, seasonNumber: number): Promise<any[]> {
    const data = await tmdbFetch(`/tv/${tmdbId}/season/${seasonNumber}`);
    return data.episodes.map((ep: any) => ({
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

  // Get similar TV shows
  async getSimilarSeries(tmdbId: number): Promise<any[]> {
    const data = await tmdbFetch(`/tv/${tmdbId}/similar`);
    return data.results.slice(0, 8).map(transformSeries);
  },

  // Get movies by genre (for Browse page filter)
  async getByGenre(genreId: number, type: 'movie' | 'tv' = 'movie'): Promise<any[]> {
    const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
    const data = await tmdbFetch(endpoint, {
      with_genres: String(genreId),
      sort_by: 'popularity.desc',
    });
    return data.results.slice(0, 20).map(
      type === 'movie' ? transformMovie : transformSeries
    );
  },

  // Genre IDs for Camcine filter tabs
  genreMap: {
    Action: 28, Drama: 18, Thriller: 53, Comedy: 35,
    Horror: 27, 'Sci-Fi': 878, Romance: 10749,
    Animation: 16, Documentary: 99,
  },
};