import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, MoreVertical } from 'lucide-react';

function formatClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function NewsReelCard({ news, formatTimeAgo, className = '' }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('volumechange', onVolumeChange);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('volumechange', onVolumeChange);
    };
  }, []);

  const attemptUnmutedPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  };

  const onMouseEnter = () => {
    setHasStarted(true);
    attemptUnmutedPlay();
  };

  const onMouseLeave = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setHasStarted(false);
  };

  const togglePlay = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const toggleFullscreen = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
  };

  const onSeek = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    video.currentTime = ratio * duration;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={wrapperRef}
      className={`group glass-card overflow-hidden rounded-2xl transition-all duration-500 hover-lift ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative aspect-[9/16] bg-black" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={news.videoUrl}
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-sm">
              <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
            </div>
          </div>
        )}

        <div
          className={`absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-6 transition-opacity duration-300 ${
            hasStarted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className="mb-2 h-1 w-full cursor-pointer rounded-full bg-white/25"
            onClick={onSeek}
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <button type="button" onClick={togglePlay} className="flex h-6 w-6 items-center justify-center">
                {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="ml-0.5 h-4 w-4 fill-white" />}
              </button>
              <span className="text-[11px] font-medium tabular-nums text-white/85">
                {formatClock(currentTime)} / {formatClock(duration)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={toggleMute} className="flex h-6 w-6 items-center justify-center">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button type="button" onClick={toggleFullscreen} className="flex h-6 w-6 items-center justify-center">
                <Maximize className="h-4 w-4" />
              </button>
              <button type="button" className="flex h-6 w-6 items-center justify-center">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
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
    </div>
  );
}
