import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Search, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { contentService } from '@/services';

const TICKER_HEADLINES = [
  'Breaking: Global markets respond to new tech regulations',
  'Live: International cricket championship finals coverage',
  'Update: New policy changes affecting digital streaming services',
  'Alert: Weather advisory issued for coastal regions',
  'Trending: Record-breaking movie release sparks worldwide discussion',
  'Flash: Major breakthrough in renewable energy announced',
];

const NEWS_FILTERS = ['All', 'Live', 'National', 'Entertainment', 'Sports', 'World'];

export function NewsPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: liveNews = [] } = useQuery({
    queryKey: ['news'],
    queryFn: contentService.getNews,
  });

  const filteredNews = useMemo(() => {
    const categoryMatches =
      activeFilter === 'All'
        ? liveNews
        : activeFilter === 'Live'
          ? liveNews.filter((news) => news.isLive)
          : liveNews.filter((news) => news.category === activeFilter || news.region === activeFilter);

    const query = searchQuery.trim().toLowerCase();
    if (!query) return categoryMatches;

    return categoryMatches.filter((news) => {
      const haystack = `${news.title} ${news.channel} ${news.category} ${news.region}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [activeFilter, liveNews, searchQuery]);

  const selectedNews = useMemo(() => {
    return (
      liveNews.find((news) => news.id === selectedId) ||
      filteredNews[0] ||
      liveNews[0] ||
      null
    );
  }, [filteredNews, liveNews, selectedId]);

  const recommendedNews = useMemo(() => {
    return filteredNews.filter((news) => news.id !== selectedNews?.id);
  }, [filteredNews, selectedNews?.id]);

  const formatTimeAgo = (year) => {
    const diff = new Date().getFullYear() - year;
    if (diff <= 0) return 'Live now';
    if (diff === 1) return '1 year ago';
    return `${diff} years ago`;
  };

  const formatCount = (count = 0) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(count % 1000000 ? 1 : 0)}m`;
    if (count >= 1000) return `${Math.round(count / 1000)}k`;
    return count.toString();
  };

  const getDuration = (index) => {
    const durations = ['1:08', '2:14', '0:58', '1:42', '2:31', '1:19', '0:46', '2:06', '1:55'];
    return durations[index % durations.length];
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setSelectedId(null);
  };

  const playPreview = (event) => {
    const video = event.currentTarget.querySelector('video');
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  };

  const stopPreview = (event) => {
    const video = event.currentTarget.querySelector('video');
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  if (!selectedNews) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] px-4 py-10 text-white md:px-8">
        <h2 className="section-title">Latest News</h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0f0f]">
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

      <section className="px-4 pb-5 pt-0 md:px-6 lg:px-10">
        <div className="mb-5 flex flex-col gap-3 lg:hidden">
          <h2 className="section-title">Latest News</h2>
          <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3">
            <Search className="mr-3 h-4 w-4 text-white/45" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search live news..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px] 2xl:grid-cols-[minmax(0,1fr)_500px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl bg-black shadow-[0_18px_70px_rgba(0,0,0,0.45)]">
              <div className="aspect-video bg-black">
                <video
                  key={selectedNews.id}
                  src={selectedNews.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full bg-black object-contain"
                />
              </div>
            </div>

            <div className="pt-4">
              <h1 className="line-clamp-2 text-xl font-extrabold leading-tight text-white md:text-2xl">
                {selectedNews.title}
              </h1>

              {/* <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-black text-white">
                    CN
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{selectedNews.channel || 'Camcine News'}</p>
                    <p className="text-xs text-white/55">{formatCount(selectedNews.viewCount)} subscribers</p>
                  </div>
                  <button className="ml-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-white/85">
                    Subscribe
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <div className="flex shrink-0 overflow-hidden rounded-full bg-white/10">
                    <button className="flex items-center gap-2 border-r border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10">
                      <ThumbsUp className="h-4 w-4" />
                      {formatCount(selectedNews.likes)}
                    </button>
                    <button className="px-4 py-2 text-white transition hover:bg-white/10" aria-label="Dislike">
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15" aria-label="More actions">
                  </button>
                </div>
              </div> */}

              {/* <div className="mt-4 rounded-xl bg-white/[0.07] p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                  <span>{formatCount(selectedNews.viewCount)} views</span>
                  <span className="text-white/35">&bull;</span>
                  <span>{formatTimeAgo(selectedNews.releaseYear)}</span>
                  {selectedNews.isLive && <span className="live-badge">LIVE</span>}
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-white/75">{selectedNews.description}</p>
              </div> */}
            </div>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-[65px] xl:h-[calc(100vh-7rem)] xl:self-start">
            {/* <div className="mb-3 hidden items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 xl:flex">
              <Search className="mr-3 h-4 w-4 text-white/45" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search live news..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
              />
            </div> */}

            {/* <div className="mb-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {NEWS_FILTERS.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition ${
                      active
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div> */}

            <div className="space-y-3 overflow-y-auto pr-1 xl:max-h-[calc(100vh-7rem)]">
              {recommendedNews.map((news, index) => (
                <button
                  key={news.id}
                  onClick={() => setSelectedId(news.id)}
                  onMouseEnter={playPreview}
                  onMouseLeave={stopPreview}
                  onFocus={playPreview}
                  onBlur={stopPreview}
                  className="group grid w-full grid-cols-[168px_minmax(0,1fr)] gap-3 rounded-lg p-1 text-left transition hover:bg-white/[0.06] max-sm:grid-cols-[132px_minmax(0,1fr)]"
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                    <video
                      src={news.videoUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-bold text-white">
                      {news.isLive ? 'LIVE' : getDuration(index)}
                    </span>
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white">
                      {news.title}
                    </h3>
                   
                    
                   
                  </div>

                </button>
              ))}
              {!recommendedNews.length && (
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-sm font-medium text-white/55">
                  No more news found for this view.
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
