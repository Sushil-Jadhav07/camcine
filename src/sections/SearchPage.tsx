import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Film, Music, Radio, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { ContentCard } from '@/components/cards/ContentCard';
import { usePlayerStore } from '@/store';

const TRENDING_SEARCHES = [
  'The Last Ember', 'Neon Dreams', 'Action movies', 'Tamil films', 'Live news', 'Romance',
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { openPlayer } = usePlayerStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) setSearchParams({ q: query });
      else setSearchParams({});
    }, 300);
    return () => clearTimeout(timer);
  }, [query, setSearchParams]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => contentService.searchContent(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const groupedResults = {
    movies: results?.filter(r => r.type === 'movie') || [],
    series: results?.filter(r => r.type === 'series') || [],
    songs: results?.filter(r => r.type === 'song') || [],
    news: results?.filter(r => r.type === 'news') || [],
  };

  return (
    <div className="min-h-screen py-10 px-6 lg:px-16">
      <div className="max-w-3xl mx-auto mb-14">
        <h1 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'Sora, sans-serif' }}>
          Search <span className="gradient-text">Camcine</span>
        </h1>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--accent)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series, songs, news..."
            className="w-full pl-16 pr-14 py-5 glass-input rounded-2xl text-lg text-white placeholder:text-[var(--text-muted)] focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-white rounded-full hover:bg-white/5 transition-all">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {debouncedQuery ? (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
            Results for "<span className="gradient-text">{debouncedQuery}</span>"
            <span className="text-[var(--text-muted)] text-sm font-normal">({results?.length || 0} found)</span>
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3] rounded-xl" />
              ))}
            </div>
          ) : results?.length === 0 ? (
            <div className="text-center py-24 glass-card rounded-3xl">
              <Search className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-5" />
              <h3 className="text-xl font-semibold text-white mb-3">No results found</h3>
              <p className="text-[var(--text-secondary)] mb-7">Try different keywords or browse categories</p>
              <button onClick={() => setQuery('')} className="btn-ghost">Clear Search</button>
            </div>
          ) : (
            <div className="space-y-12">
              {groupedResults.movies.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-5">
                    <Film className="w-5 h-5 text-[var(--accent)]" /> Movies
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedResults.movies.map(content => (
                      <div key={content.id} className="hover-lift">
                        <ContentCard content={content} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {groupedResults.series.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-5">
                    <TrendingUp className="w-5 h-5 text-[var(--accent)]" /> TV Series
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedResults.series.map(content => (
                      <div key={content.id} className="hover-lift">
                        <ContentCard content={content} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {groupedResults.songs.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-5">
                    <Music className="w-5 h-5 text-[var(--accent)]" /> Songs
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedResults.songs.map(content => (
                      <div key={content.id} className="hover-lift">
                        <ContentCard content={content} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {groupedResults.news.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-5">
                    <Radio className="w-5 h-5 text-[var(--accent)]" /> News
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedResults.news.map(content => (
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-5">Trending Searches</h2>
          <div className="flex flex-wrap gap-3 mb-14">
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-5 py-2.5 glass rounded-full text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)]/50 transition-all hover-lift"
              >
                {term}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { icon: Film, label: 'Movies', count: '500+' },
              { icon: TrendingUp, label: 'Series', count: '200+' },
              { icon: Music, label: 'Songs', count: '10K+' },
              { icon: Radio, label: 'Live News', count: '50+' },
            ].map(({ icon: Icon, label, count }) => (
              <div key={label} className="p-8 glass-card text-center hover-lift group cursor-pointer">
                <Icon className="w-10 h-10 text-[var(--accent)] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-white mb-1">{label}</p>
                <p className="text-sm text-[var(--text-muted)]">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}