import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Film, Tv, TrendingUp, Flame } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { ContentCard } from '@/components/cards/ContentCard';

const TRENDING_SEARCHES = [
  'Avengers', 'Breaking Bad', 'Inception', 'The Batman', 'Stranger Things', 'Oppenheimer',
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) setSearchParams({ q: query });
      else setSearchParams({});
    }, 350);
    return () => clearTimeout(timer);
  }, [query, setSearchParams]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => tmdbService.search(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const { data: trending = [] } = useQuery({
    queryKey: ['tmdb-trending'],
    queryFn: tmdbService.getTrending,
    staleTime: 5 * 60 * 1000,
    enabled: !debouncedQuery,
  });

  const movies = results?.filter((r) => r.type === 'movie') || [];
  const series = results?.filter((r) => r.type === 'series') || [];

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 md:px-6 lg:px-16">
      <div className="max-w-2xl mx-auto mb-10 md:mb-14">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-6 md:mb-8 text-center uppercase tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          Search <span className="gradient-text">Camcine</span>
        </h1>
        <div className="relative">
          <Search
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6"
            style={{ color: 'var(--accent)' }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series..."
            className="w-full pl-12 md:pl-16 pr-12 py-4 md:py-5 glass-input rounded-2xl text-base md:text-lg text-white placeholder:text-[var(--text-muted)] focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-white rounded-full hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>
      </div>

      {debouncedQuery ? (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-base md:text-xl font-bold text-white mb-6 md:mb-8 flex flex-wrap items-center gap-2 md:gap-3">
            Results for <span className="gradient-text">"{debouncedQuery}"</span>
            <span className="text-[var(--text-muted)] text-xs md:text-sm font-normal">({results?.length || 0} found)</span>
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3] rounded-xl" />
              ))}
            </div>
          ) : results?.length === 0 ? (
            <div className="text-center py-16 md:py-24 glass-card rounded-3xl px-6">
              <Search className="w-10 h-10 md:w-16 md:h-16 text-white/20 mx-auto mb-4 md:mb-5" />
              <h3 className="text-lg md:text-xl font-black text-white mb-2 md:mb-3 uppercase tracking-tight">No results found</h3>
              <p className="text-white/40 mb-6 md:mb-7 text-sm">Try different keywords</p>
              <button onClick={() => setQuery('')} className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-10 md:space-y-14">
              {movies.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 md:gap-3 text-base md:text-lg font-black text-white mb-4 md:mb-6 uppercase tracking-tight">
                    <Film className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--accent)' }} /> Movies
                    <span className="text-xs text-white/30 font-normal normal-case tracking-normal">({movies.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
                    {movies.map((content) => (
                      <div key={content.id} className="hover-lift">
                        <ContentCard content={content} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {series.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 md:gap-3 text-base md:text-lg font-black text-white mb-4 md:mb-6 uppercase tracking-tight">
                    <Tv className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--accent)' }} /> TV Series
                    <span className="text-xs text-white/30 font-normal normal-case tracking-normal">({series.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
                    {series.map((content) => (
                      <div key={content.id} className="hover-lift">
                        <ContentCard content={content} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h2 className="flex items-center gap-2 text-sm md:text-base font-black text-white mb-4 uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Trending Searches
            </h2>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 md:px-5 py-2 md:py-2.5 glass rounded-full text-white/60 hover:text-white text-xs md:text-sm font-bold hover:border-[var(--accent)]/40 transition-all hover-lift"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {trending.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-sm md:text-base font-black text-white mb-4 md:mb-6 uppercase tracking-widest">
                <Flame className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Trending Now
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
                {trending.slice(0, 12).map((content) => (
                  <div key={content.id} className="hover-lift">
                    <ContentCard content={content} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
