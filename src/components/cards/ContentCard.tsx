import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import type { Content } from '@/types';

interface ContentCardProps {
  content: Content;
  variant?: 'default' | 'large' | 'compact';
  className?: string;
}

export function ContentCard({ content, variant = 'default', className = '' }: ContentCardProps) {
  const isSeries = content.type === 'series';
  const cardSizeClass =
    variant === 'large'
      ? 'rounded-2xl md:rounded-[1.75rem]'
      : variant === 'compact'
        ? 'rounded-lg md:rounded-xl'
        : 'rounded-xl md:rounded-2xl';

  return (
    <Link
      to={`/content/${content.id}`}
      className={`group relative block w-full aspect-[2/3] overflow-hidden bg-[var(--bg-elevated)] transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] border border-white/5 hover:border-[var(--accent)]/40 ${cardSizeClass} ${className}`}
    >
      {/* Poster image */}
      <img
        src={content.poster}
        alt={content.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Type badge */}
      <div className="absolute top-2 left-2 md:top-3 md:left-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <span className="px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[8px] md:text-[9px] font-black text-white tracking-widest uppercase">
          {isSeries ? 'Series' : 'HD'}
        </span>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 md:opacity-50 md:group-hover:opacity-100 transition-opacity duration-300" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-4 transform translate-y-0 md:translate-y-1 md:group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-black text-[10px] md:text-sm leading-tight mb-1 line-clamp-2 md:line-clamp-1">
          {content.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">
            {isSeries ? 'TV' : content.releaseYear}
          </span>
          {content.tmdbRating && (
            <div className="flex items-center gap-0.5 md:gap-1">
              <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-[var(--accent)] fill-current" />
              <span className="text-[9px] md:text-[10px] font-black text-white/60">{content.tmdbRating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Play button overlay */}
      <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
        <div className="p-3 md:p-4 rounded-full bg-[var(--accent)] shadow-[0_0_24px_rgba(232,68,44,0.6)]">
          <Play className="w-4 h-4 md:w-5 md:h-5 fill-current text-white" />
        </div>
      </div>
    </Link>
  );
}
