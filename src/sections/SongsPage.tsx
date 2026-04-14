import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Music2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { usePlayerStore } from '@/store';

const CATEGORIES = ['All', 'Bollywood', 'Hollywood', 'Folk', 'Classical', 'Regional'];

export function SongsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { openPlayer } = usePlayerStore();

  const { data: songs, isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: contentService.getSongs,
  });

  const featuredSong = songs?.[0];

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-surface)] to-[var(--bg-card)] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="music-bar">
            {[...Array(7)].map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-16 pb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl glass"><Music2 className="w-6 h-6 text-[var(--accent)]" /></div>
            <span className="text-[var(--accent)] text-sm font-medium">Music & Songs</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            🎵 <span className="gradient-text">Music</span> & Songs
          </h1>
          <p className="text-[var(--text-secondary)] mt-3 text-lg">Stream the latest tracks, albums, and curated playlists</p>
        </div>
      </div>

      <div className="py-10 px-6 lg:px-16">
        <div className="flex gap-3 overflow-x-auto pb-6 scroll-row">
          {CATEGORIES.map((cat, idx) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`genre-tag whitespace-nowrap ${idx === 0 ? 'active' : ''}`}>
              {cat}
            </button>
          ))}
        </div>

        {featuredSong && (
          <div className="mb-14">
            <Link to={`/content/${featuredSong.id}`} className="group relative block w-full aspect-[21/9] rounded-3xl overflow-hidden">
              <img src={featuredSong.backdrop || featuredSong.poster} alt={featuredSong.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={(e) => { e.preventDefault(); openPlayer(featuredSong); }} className="p-5 rounded-full bg-[var(--accent)]/90 backdrop-blur-xl hover:bg-[var(--accent)] hover:scale-110 transition-all shadow-lg shadow-[var(--accent)]/30">
                  <Play className="w-10 h-10 fill-current" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <span className="inline-block px-3 py-1 glass-accent rounded-full text-[var(--accent)] text-xs font-semibold mb-3">Featured Track</span>
                <h3 className="text-2xl lg:text-4xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{featuredSong.title}</h3>
                <p className="text-white/70 mt-2 text-lg">{featuredSong.genres?.[0] || 'Artist'}</p>
              </div>
            </Link>
          </div>
        )}

        <div>
          <h2 className="section-title mb-8">All Songs</h2>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => (<div key={i} className="flex items-center gap-4 p-4"><div className="skeleton w-16 h-16 rounded-xl" /><div className="flex-1"><div className="skeleton h-4 w-48 mb-2" /><div className="skeleton h-3 w-32" /></div></div>))}</div>
          ) : (
            <div className="space-y-2">
              {songs?.map((song, index) => (
                <div key={song.id} className={`group flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${index % 2 === 0 ? 'bg-[var(--bg-card)]/50 hover:bg-[var(--bg-elevated)]' : 'bg-[var(--bg-surface)]/50 hover:bg-[var(--bg-elevated)]'}`}>
                  <span className="w-8 text-center text-[var(--text-muted)] font-medium">{index + 1}</span>
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={song.poster} alt={song.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-6 h-6 fill-current text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => openPlayer(song)}>
                    <h4 className="text-white font-semibold text-base truncate group-hover:text-[var(--accent)] transition-colors">{song.title}</h4>
                    <p className="text-[var(--text-muted)] text-sm truncate">{song.genres?.[0] || 'Unknown Artist'}</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-[var(--text-muted)] text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" />{song.duration ? formatDuration(song.duration) : '3:45'}</span>
                    <button onClick={(e) => { e.stopPropagation(); openPlayer(song); }} className="p-3 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all shadow-lg">
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}