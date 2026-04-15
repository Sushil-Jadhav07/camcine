import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { contentService } from '@/services';

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
    queryKey: ['live-news'],
    queryFn: contentService.getLiveNews,
  });

  const featuredNews = liveNews[0];

  const formatTimeAgo = (year: number) => {
    const diff = new Date().getFullYear() - year;
    if (diff <= 0) return 'Live now';
    if (diff === 1) return '1 year ago';
    return `${diff} years ago`;
  };

  return (
    <div className="min-h-screen">
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
        {featuredNews && (
          <div className="mb-10 md:mb-14">
            <Link to={`/content/${featuredNews.id}`} className="group relative block w-full overflow-hidden rounded-2xl aspect-[16/10] md:aspect-[21/9] md:rounded-3xl">
              <img
                src={featuredNews.backdrop || featuredNews.poster}
                alt={featuredNews.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
              <div className="absolute left-4 top-4 md:left-6 md:top-6">
                <span className="live-badge text-sm px-4 py-1.5">LIVE</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
                <h3 className="mb-2 text-xl font-bold text-white md:text-2xl lg:mb-3 lg:text-4xl" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {featuredNews.title}
                </h3>
                <p className="line-clamp-2 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base lg:text-lg">
                  {featuredNews.description}
                </p>
              </div>
            </Link>
          </div>
        )}

        <div>
          <h2 className="section-title mb-8">Latest News</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liveNews.slice(1).map((news) => (
              <Link key={news.id} to={`/content/${news.id}`} className="group glass-card overflow-hidden rounded-2xl transition-all duration-500 hover-lift">
                <div className="relative aspect-video">
                  <img src={news.poster} alt={news.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4">
                    <span className="live-badge">LIVE</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="mb-3 line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-[var(--accent)]">{news.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span>{formatTimeAgo(news.releaseYear)}</span>
                    <span>&bull;</span>
                    <span className="glass rounded px-2.5 py-1 text-xs">{news.genres?.[0] || 'News'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
