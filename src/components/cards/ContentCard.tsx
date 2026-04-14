import { Link } from 'react-router-dom';
import { Play, Clock, Film, Tv, Star } from 'lucide-react';
import type { Content } from '@/types';
import { usePlayerStore } from '@/store';

interface ContentCardProps {
  content: Content;
  variant?: 'default' | 'large' | 'compact' | 'portrait';
  showBadge?: boolean;
  showPlayButton?: boolean;
  className?: string;
}

export function ContentCard({
  content,
  variant = 'default',
  showBadge = true,
  showPlayButton = true,
  className = '',
}: ContentCardProps) {
  const { openPlayer } = usePlayerStore();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openPlayer(content);
  };

  return (
    <Link
      to={`/content/${content.id}`}
      className={`content-card group ${className}`}
    >
      <div className={`relative overflow-hidden ${variant === 'portrait' ? 'aspect-[2/3]' : 'aspect-[2/3]'}`}>
        <img
          src={content.poster}
          alt={content.title}
          className="card-thumb"
          style={{ filter: 'saturate(0.9) contrast(1.05)' }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {showBadge && (
          <div className="absolute top-3 left-3">
            {content.isTrending && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-[var(--accent)] to-[#FF6B4A] text-white text-[10px] font-bold rounded-lg shadow-lg">
                NEW
              </span>
            )}
            {content.status === 'premium' && (
              <span className="ml-1 px-2.5 py-1 bg-white/20 backdrop-blur-xl text-white text-[10px] font-bold rounded-lg">
                HD
              </span>
            )}
          </div>
        )}

        <div className="absolute top-3 right-3">
          {content.type === 'movie' ? (
            <div className="p-1.5 rounded-lg glass backdrop-blur-xl">
              <Film className="w-3.5 h-3.5 text-white/80" />
            </div>
          ) : content.type === 'series' ? (
            <div className="p-1.5 rounded-lg glass backdrop-blur-xl">
              <Tv className="w-3.5 h-3.5 text-white/80" />
            </div>
          ) : null}
        </div>

        {showPlayButton && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <div className="p-4 rounded-full bg-gradient-to-r from-[var(--accent)] to-[#FF6B4A] shadow-xl shadow-[var(--accent)]/30 hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current text-white" />
            </div>
          </button>
        )}

        <div className="card-overlay">
          <div className="absolute top-2 right-2">
            <span className="rating-badge backdrop-blur-xl">
              <Star className="w-3 h-3 fill-current" />
              {content.rating || '8.0'}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <h4 className="text-white font-bold text-sm truncate mb-1 group-hover:text-[var(--accent)] transition-colors">
              {content.title}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs">{content.genres?.[0]}</span>
            </div>
          </div>
        </div>

        {content.duration && content.duration > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 glass rounded-lg backdrop-blur-xl">
            <Clock className="w-3 h-3 text-white/70" />
            <span className="text-[10px] text-white/70 font-medium">
              {Math.floor(content.duration / 3600) > 0
                ? `${Math.floor(content.duration / 3600)}h ${Math.floor((content.duration % 3600) / 60)}m`
                : `${Math.floor(content.duration / 60)}m`}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}