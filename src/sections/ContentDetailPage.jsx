import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Download, VolumeX, Volume2, Heart, Bookmark, Share2, ChevronLeft } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { ContentCard } from '@/components/cards/ContentCard';
import { usePlayerStore, useAuthStore, useWatchlistStore } from '@/store';
import YouTube from 'react-youtube';

export function ContentDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { openPlayer } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerMuted, setTrailerMuted] = useState(true);

  const contentType = id?.startsWith('movie') ? 'movie' : 'series';
  const tmdbId = id ? parseInt(id.split('-')[1]) : null;

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: () =>
      contentType === 'movie'
        ? tmdbService.getMovieDetails(tmdbId)
        : tmdbService.getSeriesDetails(tmdbId),
    enabled: !!tmdbId,
  });

  const { data: similarContent } = useQuery({
    queryKey: ['similar', id],
    queryFn: () =>
      contentType === 'movie'
        ? tmdbService.getSimilarMovies(tmdbId)
        : tmdbService.getSimilarSeries(tmdbId),
    enabled: !!tmdbId,
  });

  const videoId = useMemo(() => {
    if (!content?.trailer) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = content.trailer.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }, [content?.trailer]);

  useEffect(() => {
    let timer;
    if (videoId) {
      timer = setTimeout(() => setShowTrailer(true), 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
      setShowTrailer(false);
    };
  }, [videoId]);

  useEffect(() => {
    if (contentType === 'series' && content && tmdbId) {
      const season = content.seasons?.filter((item) => item.number > 0)?.[selectedSeasonIdx];
      if (season && season.episodes.length === 0) {
        tmdbService.getSeasonDetails(tmdbId, season.number).then((episodes) => {
          queryClient.setQueryData(['content', id], (oldData) => {
            if (!oldData) return oldData;
            const newData = { ...oldData };
            const seasonIndex = newData.seasons.findIndex((item) => item.number === season.number);
            if (seasonIndex < 0) return oldData;
            newData.seasons = [...newData.seasons];
            newData.seasons[seasonIndex] = {
              ...newData.seasons[seasonIndex],
              episodes,
            };
            return newData;
          });
        });
      }
    }
  }, [selectedSeasonIdx, contentType, id, tmdbId, queryClient, content]);

  const isSeries = content?.type === 'series';
  const series = isSeries ? content : null;
  const playableSeasons = series?.seasons?.filter((season) => season.number > 0) ?? [];
  const currentSeason = playableSeasons[selectedSeasonIdx];

  useEffect(() => {
    if (selectedSeasonIdx >= playableSeasons.length && selectedSeasonIdx !== 0) {
      setSelectedSeasonIdx(0);
    }
  }, [playableSeasons.length, selectedSeasonIdx]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm font-bold uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center glass-card p-10 md:p-12 rounded-3xl">
          <h1 className="text-xl md:text-2xl font-black text-white mb-3 uppercase">Not Found</h1>
          <Link to="/browse" className="text-[var(--accent)] hover:underline text-sm">
            Browse all content
          </Link>
        </div>
      </div>
    );
  }

  const isInWatchlist = watchlist.some((item) => item.id === content.id);

  const handleWatchlistToggle = () => {
    if (!isAuthenticated) return;
    if (isInWatchlist) removeFromWatchlist('user-1', content.id);
    else addToWatchlist('user-1', content.id);
  };

  const trailerOpts = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      loop: 1,
      mute: trailerMuted ? 1 : 0,
      playlist: videoId,
      modestbranding: 1,
      showinfo: 0,
      fs: 0,
      iv_load_policy: 3,
      rel: 0,
      disablekb: 1,
    },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white">
      <div className="relative w-full min-h-[70svh] md:min-h-[75vh] lg:min-h-[85vh] overflow-hidden">
        {showTrailer && videoId ? (
          <div className="absolute inset-0 z-0 scale-110 pointer-events-none">
            <YouTube
              videoId={videoId}
              opts={trailerOpts}
              className="w-full h-full"
              iframeClassName="w-full h-full object-cover"
              onEnd={(e) => e.target.playVideo()}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0">
            <img
              src={content.backdrop}
              alt={content.title}
              className="w-full h-full object-cover brightness-60"
            />
          </div>
        )}

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/20 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--bg-base)]/80 via-transparent to-transparent hidden lg:block" />

        <Link
          to="/browse"
          className="absolute top-4 md:top-6 left-4 md:left-6 z-30 flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all text-xs md:text-sm font-bold"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        <div className="absolute inset-0 z-20 flex items-end px-4 md:px-8 lg:px-16 pb-6 md:pb-10">
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-12 items-start lg:items-end max-w-7xl w-full mx-auto">
            <div className="hidden lg:block w-52 xl:w-64 shrink-0 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 transform -rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src={content.poster} alt={content.title} className="w-full aspect-[2/3] object-cover" />
            </div>

            <div className="flex-1 w-full max-w-3xl">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="bg-[var(--accent)] text-white text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                  Premium
                </span>
                <div className="flex items-center gap-1 text-[var(--accent)] font-bold text-xs md:text-sm">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {content.tmdbRating}
                </div>
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
                  {content.releaseYear}
                </span>
                {content.duration ? (
                  <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
                    {Math.floor(content.duration / 3600)}h {content.duration % 3600 > 0 ? `${Math.floor((content.duration % 3600) / 60)}m` : ''}
                  </span>
                ) : null}
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-3 md:mb-4 italic"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {content.title}
              </h1>

              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mb-5 md:mb-6 font-medium line-clamp-3 md:line-clamp-4">
                {content.description}
              </p>

              {content.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5 md:mb-6">
                  {content.genres.slice(0, 4).map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-widest"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                <button
                  onClick={() => openPlayer(content)}
                  className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-black text-xs md:text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_30px_rgba(232,68,44,0.3)]"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  Play Now
                </button>
                <button
                  onClick={handleWatchlistToggle}
                  className="p-3 md:p-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white active:scale-90"
                >
                  {isInWatchlist ? (
                    <Bookmark className="w-5 h-5 fill-[var(--accent)] text-[var(--accent)]" />
                  ) : (
                    <Heart className="w-5 h-5" />
                  )}
                </button>
                <button className="p-3 md:p-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white active:scale-90">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showTrailer && (
          <button
            onClick={() => setTrailerMuted(!trailerMuted)}
            className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-30 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all"
          >
            {trailerMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        )}
      </div>

      <div className="px-4 md:px-8 lg:px-16 py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-7xl mx-auto">

          <div className="flex-1 space-y-10 md:space-y-14">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 md:gap-y-6">
              <DetailItem label="Country" value={content.region || 'N/A'} />
              <DetailItem label="Genre" value={content.genres?.join(', ') || 'N/A'} />
              <DetailItem label="Year" value={content.releaseYear?.toString()} />
              <DetailItem
                label="Director"
                value={content.crew?.find((c) => c.role === 'Director')?.name || 'N/A'}
              />
              <DetailItem
                label="Cast"
                value={content.cast?.slice(0, 3).map((c) => c.name).join(', ') || 'N/A'}
              />
              <DetailItem
                label="Language"
                value={content.languages?.[0] || 'EN'}
              />
            </div>

            {content.cast?.length > 0 && (
              <div>
                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-4 md:mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Cast
                </h2>
                <div className="flex gap-3 md:gap-4 overflow-x-auto pb-3 no-scrollbar">
                  {content.cast.slice(0, 8).map((person) => (
                    <div key={person.id} className="flex-shrink-0 text-center w-16 md:w-20">
                      <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden bg-[var(--bg-elevated)] border border-white/10 mx-auto mb-2">
                        {person.avatar ? (
                          <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30 text-lg font-black">
                            {person.name?.[0]}
                          </div>
                        )}
                      </div>
                      <p className="text-white text-[10px] font-black leading-tight truncate">{person.name}</p>
                      <p className="text-white/40 text-[9px] truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSeries && series?.seasons && series.seasons.length > 0 && (
              <div>
                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-4 md:mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Episodes
                </h2>

                <div className="flex gap-2 overflow-x-auto pb-2 mb-5 md:mb-6 no-scrollbar">
                  {playableSeasons.map((season, idx) => (
                      <button
                        key={season.id}
                        onClick={() => setSelectedSeasonIdx(idx)}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                          selectedSeasonIdx === idx
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        S{season.number}
                      </button>
                    ))}
                </div>

                <div className="space-y-2 md:space-y-3">
                  {currentSeason?.episodes && currentSeason.episodes.length > 0 ? (
                    currentSeason.episodes.map((ep) => (
                      <div
                        key={ep.id}
                        className="flex flex-col sm:flex-row gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group cursor-pointer"
                        onClick={() => openPlayer(content, ep)}
                      >
                        {ep.thumbnail && (
                          <div className="w-full sm:w-24 md:w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-elevated)]">
                            <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">
                              E{ep.number}
                            </span>
                            {ep.airDate && (
                              <span className="text-[10px] text-white/30 font-bold">{ep.airDate}</span>
                            )}
                          </div>
                          <h4 className="text-white font-black text-xs md:text-sm truncate">{ep.title}</h4>
                          <p className="text-white/40 text-[10px] md:text-xs line-clamp-2 mt-1 leading-relaxed">{ep.description}</p>
                        </div>
                        <div className="hidden sm:block flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-2 rounded-full bg-[var(--accent)]">
                            <Play className="w-3 h-3 fill-current text-white" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 md:h-20 skeleton rounded-xl" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {similarContent && similarContent.length > 0 && (
              <div className="pt-8 md:pt-10 border-t border-white/5">
                <h2
                  className="text-lg md:text-2xl font-black text-white uppercase mb-6 md:mb-8 tracking-tight"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  More Like This
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {similarContent.slice(0, 8).map((item) => (
                    <ContentCard key={item.id} content={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0">
            <div className="bg-[#0D1014] rounded-2xl border border-white/5 overflow-hidden shadow-2xl lg:sticky lg:top-24">
              <div className="flex items-center gap-3 p-4 md:p-5 border-b border-white/5 bg-white/[0.02]">
                <Play className="w-4 h-4 text-[var(--accent)] fill-current" />
                <h3 className="font-black text-white uppercase tracking-widest text-xs">
                  {isSeries ? 'Stream Episode' : 'Stream Movie'}
                </h3>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={() => openPlayer(content)}
                  className="w-full flex items-center justify-between p-3.5 md:p-4 rounded-xl bg-[var(--accent)] text-white font-black text-xs md:text-sm transition-all group hover:bg-[var(--accent-hover)]"
                >
                  <span>{isSeries ? 'Watch Series' : 'Stream HD'}</span>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </button>

                {[
                  { label: isSeries ? 'Download Season' : 'Download 4K', icon: Download },
                  { label: 'Stream 4K Ultra', icon: Play },
                ].map(({ label, icon: Icon }, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center justify-between p-3.5 md:p-4 rounded-xl hover:bg-white/5 text-white/40 hover:text-white font-black text-xs md:text-sm transition-all group"
                  >
                    <span>{label}</span>
                    <Icon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              <div className="lg:hidden p-4 border-t border-white/5">
                <img
                  src={content.poster}
                  alt={content.title}
                  className="w-full max-w-[160px] mx-auto aspect-[2/3] object-cover rounded-xl"
                />
              </div>

              <div className="p-4 md:p-5 bg-black/20 text-center">
                <p className="text-[9px] md:text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">
                  Premium quality streaming
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-3 md:gap-4">
      <span className="w-20 md:w-24 shrink-0 text-white/30 text-[11px] md:text-sm font-black uppercase tracking-widest">
        {label}
      </span>
      <span className="flex-1 text-white/70 text-xs md:text-sm font-bold leading-relaxed break-words">{value || 'N/A'}</span>
    </div>
  );
}
