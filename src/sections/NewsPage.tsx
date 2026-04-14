import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Radio } from 'lucide-react';
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
  const { data: liveNews } = useQuery({
    queryKey: ['live-news'],
    queryFn: contentService.getLiveNews,
  });

  const featuredNews = liveNews?.[0];

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="min-h-screen">
      <div className="glass-nav py-3 overflow-hidden">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded flex-shrink-0 shadow-lg shadow-red-500/30">BREAKING</span>
          {TICKER_HEADLINES.map((headline, i) => (
            <span key={i} className="text-sm text-white/80">{headline}<span className="mx-6 text-white/30">•</span></span>
          ))}
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded flex-shrink-0 shadow-lg shadow-red-500/30">BREAKING</span>
          {TICKER_HEADLINES.map((headline, i) => (
            <span key={`${i}-dup`} className="text-sm text-white/80">{headline}<span className="mx-6 text-white/30">•</span></span>
          ))}
        </div>
      </div>

      <div className="py-10 px-6 lg:px-16">
        {featuredNews && (
          <div className="mb-14">
            <Link to={`/content/${featuredNews.id}`} className="group relative block w-full aspect-[21/9] rounded-3xl overflow-hidden">
              <img src={featuredNews.backdrop || featuredNews.poster} alt={featuredNews.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
              <div className="absolute top-6 left-6">
                <span className="live-badge text-sm px-4 py-1.5">LIVE</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <h3 className="text-2xl lg:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>{featuredNews.title}</h3>
                <p className="text-white/70 text-base lg:text-lg max-w-3xl line-clamp-2 leading-relaxed">{featuredNews.description}</p>
              </div>
            </Link>
          </div>
        )}

        <div>
          <h2 className="section-title mb-8">Latest News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveNews?.slice(1).map((news) => (
              <Link key={news.id} to={`/content/${news.id}`} className="group glass-card rounded-2xl overflow-hidden hover-lift transition-all duration-500">
                <div className="relative aspect-video">
                  <img src={news.poster} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="live-badge">LIVE</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-white font-semibold text-lg mb-3 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">{news.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span>{formatTimeAgo(news.releaseYear?.toString() || new Date().toISOString())}</span>
                    <span>•</span>
                    <span className="px-2.5 py-1 glass rounded text-xs">{news.genres?.[0] || 'News'}</span>
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