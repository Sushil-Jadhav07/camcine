import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { ContentCard } from '@/components/cards/ContentCard';
import { ComingSoonOverlay } from '@/sections/ComingSoonOverlay';

const TYPE_TABS = ['All', 'Movies', 'Series', 'Songs'];

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family',
  'Fantasy', 'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
];

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const activeType =
    typeParam === 'movie'
      ? 'Movies'
      : typeParam === 'series'
        ? 'Series'
        : typeParam === 'song'
          ? 'Songs'
          : 'All';
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'newest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isComingSoon = activeType === 'Series' || activeType === 'Songs';

  const setActiveType = (tab) => {
    const nextParams = new URLSearchParams(searchParams);

    if (tab === 'Movies') nextParams.set('type', 'movie');
    else if (tab === 'Series') nextParams.set('type', 'series');
    else if (tab === 'Songs') nextParams.set('type', 'song');
    else nextParams.delete('type');

    setSearchParams(nextParams);
  };

  const { data: content, isLoading } = useQuery({
    queryKey: ['browse', activeType, selectedGenre, sortBy],
    queryFn: async () => {
      const params = { genre: selectedGenre, sort: sortBy, limit: 30 };
      if (activeType === 'Movies') return contentService.getMovies(params);
      if (activeType === 'Series') return contentService.getSeries(params);
      if (activeType === 'Songs') return contentService.getSongs(params);
      return contentService.getAllContent(params);
    },
    enabled: !isComingSoon,
  });

  const pageTitle =
    activeType === 'Series'
      ? 'TV Shows'
      : activeType === 'Songs'
      ? 'Music'
      : activeType === 'Movies'
      ? 'Popular Movies'
      : 'Discover';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-base)]">
      <div>
        <div className="min-h-screen py-8 md:py-12 px-4 md:px-6 lg:px-16 bg-[var(--bg-base)]">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-10 gap-4">
            <h1
              className="text-xl md:text-3xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {pageTitle}
            </h1>

            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                {['Newest', 'Title'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSortBy(tab === 'Newest' ? 'newest' : 'title')}
                    className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                      (tab === 'Newest' ? sortBy === 'newest' : sortBy === 'title')
                        ? 'bg-white/10 text-white'
                        : 'text-white/30 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                  isFiltersOpen
                    ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]'
                    : 'bg-white/5 border-white/5 text-white/40 hover:text-white'
                }`}
              >
                <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {isFiltersOpen && (
            <div className="bg-white/[0.03] p-4 md:p-6 rounded-2xl border border-white/5 mb-6 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex flex-col gap-4 md:gap-6">
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 md:mb-3">Type</p>
                  <div className="flex flex-wrap gap-2">
                    {TYPE_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveType(tab)}
                        className={`px-4 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                          activeType === tab
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-white/5 text-white/40 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 md:mb-3">Genre</p>
                  <div className="flex gap-2 flex-wrap">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() =>
                          setSelectedGenre(selectedGenre === genre ? '' : genre)
                        }
                        className={`px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedGenre === genre
                            ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30'
                            : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {(selectedGenre || activeType !== 'All') && (
                  <button
                    onClick={() => { setSelectedGenre(''); setActiveType('All'); setSortBy('newest'); }}
                    className="self-start text-[10px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    Clear filters x
                  </button>
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3] rounded-2xl" />
              ))}
            </div>
          ) : content?.length === 0 ? (
            <div className="text-center py-16 md:py-24 glass-card rounded-3xl px-6">
              <h3 className="text-lg md:text-xl font-black text-white mb-3 uppercase tracking-tight">No results</h3>
              <p className="text-white/40 mb-7 text-sm">Try adjusting your filters</p>
              <button
                onClick={() => { setSelectedGenre(''); setSortBy('newest'); setActiveType('All'); }}
                className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
              {content?.map((item) => (
                <div key={item.id} className="hover-lift">
                  <ContentCard content={item} />
                </div>
              ))}
            </div>
          )}

          {content && content.length > 0 && (
            <div className="text-center mt-10 md:mt-14">
              <button className="px-8 md:px-12 py-3.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {isComingSoon && <ComingSoonOverlay backgroundImage="/netflix.jpg" />}
    </div>
  );
}
