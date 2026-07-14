import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { NewsReelCard } from '@/components/cards/NewsReelCard';

const TICKER_HEADLINES = [
  'Breaking: Global markets respond to new tech regulations',
  'Live: International cricket championship finals coverage',
  'Update: New policy changes affecting digital streaming services',
  'Alert: Weather advisory issued for coastal regions',
  'Trending: Record-breaking movie release sparks worldwide discussion',
  'Flash: Major breakthrough in renewable energy announced',
];

export function NewsPage() {
  const { data: liveNews = [] } = useQuery({
    queryKey: ['news'],
    queryFn: contentService.getNews,
  });

  const formatTimeAgo = (year) => {
    const diff = new Date().getFullYear() - year;
    if (diff <= 0) return 'Live now';
    if (diff === 1) return '1 year ago';
    return `${diff} years ago`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-base)]">
      <div className="glass-nav overflow-hidden py-3">
        <div className="marquee flex items-center gap-6 whitespace-nowrap">
          <span className="flex-shrink-0 rounded bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] px-3 py-1 text-xs font-bold text-white shadow-lg shadow-[var(--accent)]/30">
            BREAKING
          </span>
          {TICKER_HEADLINES.map((headline, i) => (
            <span key={i} className="text-sm text-white/80">
              {headline}
              <span className="mx-6 text-white/30">&bull;</span>
            </span>
          ))}
          <span className="flex-shrink-0 rounded bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] px-3 py-1 text-xs font-bold text-white shadow-lg shadow-[var(--accent)]/30">
            BREAKING
          </span>
          {TICKER_HEADLINES.map((headline, i) => (
            <span key={`${i}-dup`} className="text-sm text-white/80">
              {headline}
              <span className="mx-6 text-white/30">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 py-8 md:px-6 md:py-10 lg:px-16">
        <div>
          <h2 className="section-title mb-8">Latest News</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {liveNews.map((news) => (
              <NewsReelCard key={news.id} news={news} formatTimeAgo={formatTimeAgo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
