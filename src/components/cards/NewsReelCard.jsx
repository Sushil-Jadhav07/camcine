import { useRef } from 'react';
import { Play } from 'lucide-react';

export function useHoverPlay() {
  const videoRef = useRef(null);

  const onMouseEnter = () => {
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

  const onMouseLeave = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return { videoRef, onMouseEnter, onMouseLeave };
}

export function NewsReelCard({ news, formatTimeAgo, className = '' }) {
  const { videoRef, onMouseEnter, onMouseLeave } = useHoverPlay();

  return (
    <div
      className={`group glass-card overflow-hidden rounded-2xl transition-all duration-500 hover-lift ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative aspect-[9/16]">
        <video
          ref={videoRef}
          src={news.videoUrl}
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-300 group-hover:opacity-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-sm">
            <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
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
