import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { ContentCard } from '@/components/cards/ContentCard';
import { usePlayerStore } from '@/store';

const TYPE_TABS = ['All', 'Movies', 'Series'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'trending', label: 'Trending' },
];
const GENRES = ['Action', 'Drama', 'Thriller', 'Comedy', 'Horror', 'Sci-Fi', 'Romance', 'Animation', 'Documentary', 'Mystery'];
const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021'];

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeType, setActiveType] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popular');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { openPlayer } = usePlayerStore();

  useEffect(() => {
    const type = searchParams.get('type');
    const genre = searchParams.get('genre');
    const sort = searchParams.get('sort');
    if (type === 'movie') setActiveType('Movies');
    else if (type === 'series') setActiveType('Series');
    if (genre) setSelectedGenre(genre);
    if (sort) setSortBy(sort);
  }, [searchParams]);

  const { data: content, isLoading } = useQuery({
    queryKey: ['browse', activeType, selectedGenre, selectedYear, sortBy],
    queryFn: () => contentService.filterContent({
      types: activeType === 'All' ? [] : [activeType === 'Movies' ? 'movie' : 'series'],
      genres: selectedGenre ? [selectedGenre] : [],
      yearRange: selectedYear ? [parseInt(selectedYear), 2026] : [2000, 2026],
      sortBy: sortBy as any,
    }),
  });

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
          Browse <span className="gradient-text">Content</span>
        </h1>
        <p className="text-[var(--text-secondary)]">{content?.length || 0} titles available</p>
      </div>

      <div className="glass-card p-5 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveType(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeType === tab
                    ? 'bg-gradient-to-r from-[var(--accent)] to-[#FF6B4A] text-white shadow-lg'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-overlay)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-[var(--border-default)] hidden md:block" />

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 cursor-pointer hover-lift"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value || null)}
              className="appearance-none bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 cursor-pointer hover-lift"
            >
              <option value="">All Years</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          </div>

          {(selectedGenre || selectedYear || sortBy !== 'popular') && (
            <button
              onClick={() => { setSelectedGenre(null); setSelectedYear(null); setSortBy('popular'); setSearchParams({}); }}
              className="ml-auto flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 mt-4 scroll-row">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              className={`genre-tag whitespace-nowrap ${selectedGenre === genre ? 'active' : ''}`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[2/3] rounded-xl" />
          ))}
        </div>
      ) : content?.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-3xl">
          <Search className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-5" />
          <h3 className="text-xl font-semibold text-white mb-3">No results found</h3>
          <p className="text-[var(--text-secondary)] mb-7">Try adjusting your filters or search terms</p>
          <button onClick={() => { setSelectedGenre(null); setSelectedYear(null); setSortBy('popular'); setActiveType('All'); }} className="btn-ghost">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {content?.map((item) => (
            <div key={item.id} className="hover-lift">
              <ContentCard content={item} />
            </div>
          ))}
        </div>
      )}

      {content && content.length > 0 && (
        <div className="text-center mt-14">
          <button className="btn-ghost px-10">Load More</button>
        </div>
      )}
    </div>
  );
}