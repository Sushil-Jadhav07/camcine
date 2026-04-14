import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Check, Share2, Clock, Calendar, Star, Download, ChevronRight, Film, Tv } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { ContentCard } from '@/components/cards/ContentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePlayerStore, useAuthStore, useWatchlistStore } from '@/store';
import type { Series, Episode } from '@/types';

export function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { openPlayer } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: () => contentService.getContentById(id!),
    enabled: !!id,
  });

  const { data: similarContent } = useQuery({
    queryKey: ['similar', id],
    queryFn: () => contentService.getSimilarContent(id!, 6),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="skeleton h-[70vh]" />
        <div className="px-4 lg:px-16 py-10">
          <div className="skeleton h-12 w-1/3 mb-6" />
          <div className="skeleton h-4 w-2/3 mb-8" />
          <div className="flex gap-4">
            <div className="skeleton h-14 w-36" />
            <div className="skeleton h-14 w-36" />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-12 rounded-3xl">
          <h1 className="text-2xl text-white mb-3">Content not found</h1>
          <Link to="/browse" className="text-[var(--accent)] hover:underline">Browse all content</Link>
        </div>
      </div>
    );
  }

  const isInWatchlist = watchlist.some(item => item.id === content.id);
  const isSeries = content.type === 'series';
  const series = isSeries ? (content as Series) : null;

  const handleWatchlistToggle = () => {
    if (!isAuthenticated) return;
    if (isInWatchlist) removeFromWatchlist('user-1', content.id);
    else addToWatchlist('user-1', content.id);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh]">
        <img src={content.backdrop} alt={content.title} className="w-full h-full object-cover" style={{ filter: 'brightness(0.35) saturate(1.3)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[rgba(6,8,10,0.7)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)]/90 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-16 pb-14">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-5">
              <span className="rating-badge text-sm">
                <Star className="w-4 h-4 fill-current" />
                {content.rating || '8.5'}
              </span>
              <span className="text-[var(--text-muted)] text-sm">{content.releaseYear}</span>
              <span className="flex items-center gap-1.5 text-[var(--text-muted)] text-sm">
                {content.type === 'movie' ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
                {content.type === 'movie' ? 'Movie' : 'Series'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
              {content.title}
            </h1>

            <p className="text-[var(--text-secondary)] text-base lg:text-lg mb-8 max-w-2xl line-clamp-3 leading-relaxed">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => openPlayer(content)} className="btn-accent group">
                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                Watch Now
              </button>
              <button onClick={handleWatchlistToggle} className={`btn-ghost ${isInWatchlist ? 'border-[var(--accent)] text-[var(--accent)]' : ''}`}>
                {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                Watchlist
              </button>
              <button className="btn-ghost"><Download className="w-5 h-5" /> Download</button>
              <button className="btn-ghost"><Share2 className="w-5 h-5" /> Share</button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-16 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="glass-card p-6 sticky top-24 rounded-2xl">
              <div className="rounded-xl overflow-hidden mb-5">
                <img src={content.poster} alt={content.title} className="w-full" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Year</span>
                  <span className="text-white font-medium">{content.releaseYear}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Duration</span>
                  <span className="text-white font-medium">{content.duration ? formatDuration(content.duration) : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Language</span>
                  <span className="text-white font-medium">{content.languages?.join(', ') || 'N/A'}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {content.genres?.slice(0, 3).map((genre) => (
                    <span key={genre} className="genre-tag text-xs">{genre}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Tabs defaultValue={isSeries ? "episodes" : "overview"} className="w-full">
              <TabsList className="glass p-1.5 rounded-xl mb-10 grid grid-cols-4 w-fit gap-1">
                {isSeries && <TabsTrigger value="episodes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--accent)] data-[state=active]:to-[#FF6B4A] data-[state=active]:text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-all">Episodes</TabsTrigger>}
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--accent)] data-[state=active]:to-[#FF6B4A] data-[state=active]:text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-all">Overview</TabsTrigger>
                <TabsTrigger value="cast" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--accent)] data-[state=active]:to-[#FF6B4A] data-[state=active]:text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-all">Cast</TabsTrigger>
                <TabsTrigger value="trailers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--accent)] data-[state=active]:to-[#FF6B4A] data-[state=active]:text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-all">Trailers</TabsTrigger>
              </TabsList>

              {isSeries && (
                <TabsContent value="episodes">
                  {series && (
                    <div className="mb-6">
                      <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 hover-lift"
                      >
                        {series.seasons.map((season, i) => (
                          <option key={season.id} value={i}>Season {season.number}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="space-y-4">
                    {series?.seasons[selectedSeason]?.episodes.map((episode) => (
                      <div key={episode.id} className="flex gap-5 p-4 glass-card rounded-2xl hover-lift transition-all group">
                        <div className="relative w-44 aspect-video rounded-xl overflow-hidden flex-shrink-0">
                          <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />
                          <button onClick={() => openPlayer(content, episode)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="p-3 rounded-full bg-[var(--accent)]"><Play className="w-5 h-5 fill-current" /></div>
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs text-[var(--text-muted)]">EP{episode.number}</span>
                              <h4 className="font-semibold text-white text-lg">{episode.title}</h4>
                            </div>
                            <button onClick={() => setExpandedEpisode(expandedEpisode === episode.id ? null : episode.id)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                              <ChevronRight className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${expandedEpisode === episode.id ? 'rotate-90' : ''}`} />
                            </button>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">{episode.description}</p>
                          <div className="flex items-center gap-5 mt-3 text-xs text-[var(--text-muted)]">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{Math.floor(episode.duration / 60)}m</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(episode.airDate).toLocaleDateString()}</span>
                          </div>
                          {expandedEpisode === episode.id && (
                            <button onClick={() => openPlayer(content, episode)} className="btn-accent text-sm py-2.5 px-5 mt-4">
                              <Play className="w-4 h-4 fill-current" /> Play Episode
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="overview">
                <div className="glass-card p-8 rounded-2xl space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>About</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-base">{content.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {content.genres?.map((genre) => (
                      <span key={genre} className="genre-tag">{genre}</span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cast">
                <div className="flex gap-5 overflow-x-auto pb-4 scroll-row">
                  {content.cast?.map((member) => (
                    <div key={member.id} className="flex-shrink-0 text-center group">
                      <div className="w-24 h-24 mx-auto rounded-2xl bg-[var(--bg-elevated)] overflow-hidden mb-3 border-2 border-transparent group-hover:border-[var(--accent)] transition-all">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[var(--accent)]">{member.name[0]}</div>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-white truncate w-24">{member.name}</h4>
                      {member.character && <p className="text-xs text-[var(--text-muted)] truncate w-24">{member.character}</p>}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trailers">
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="relative aspect-video">
                    <img src={content.poster} alt="Trailer" className="w-full h-full object-cover opacity-60" />
                    <button className="absolute inset-0 flex items-center justify-center">
                      <div className="p-5 rounded-full bg-[var(--accent)]/90 backdrop-blur-sm hover:bg-[var(--accent)] hover:scale-110 transition-all shadow-lg">
                        <Play className="w-10 h-10 fill-current" />
                      </div>
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {similarContent && similarContent.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-8">More Like This</h2>
            <div className="scroll-row">
              {similarContent.map((item) => (
                <div key={item.id} className="w-[160px] md:w-[180px] hover-lift">
                  <ContentCard content={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}