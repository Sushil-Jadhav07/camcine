import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { usePlayerStore } from '@/store';
import type { Content } from '@/types';

export function SongsPage() {
  const { openPlayer } = usePlayerStore();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: songs, isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: contentService.getSongs,
  });

  const categories = [
    { title: 'New Music', songs: songs?.slice(0, 12) },
    { title: 'Pop', songs: songs?.slice(4, 16) },
    { title: 'Hip Hop', songs: songs?.slice(8, 20) },
  ];

  return (
    <div className="min-h-screen bg-[#06080A] text-white pt-6 md:pt-10 px-4 md:px-6 lg:px-16">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: 'Sora, sans-serif' }}>
            Music
          </h1>
          <p className="text-white/40 text-[10px] md:text-sm font-bold uppercase tracking-widest mt-1">
            Discover and stream your favorite music
          </p>
        </div>
        <button className="self-start md:self-auto px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest backdrop-blur-xl">
          My Songs
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 md:mb-12 group">
        <div className="absolute inset-y-0 left-5 md:left-6 flex items-center pointer-events-none">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-white/20 group-focus-within:text-[var(--accent)] transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search for songs, albums, or artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 md:h-14 pl-12 md:pl-14 pr-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 focus:border-white/10 focus:bg-white/[0.07] outline-none text-white text-sm md:text-base font-bold transition-all placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:tracking-widest"
        />
      </div>

      {/* Category Rows */}
      <div className="space-y-12 md:space-y-16 pb-20">
        {categories.map((cat, idx) => (
          <div key={idx} className="relative group/row">
            <div className="flex items-center justify-between mb-6 md:mb-8 px-2">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                {cat.title}
              </h2>
              <div className="flex items-center gap-2 md:opacity-0 md:group-hover/row:opacity-100 transition-opacity">
                <button className="p-1.5 md:p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5 active:scale-90">
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className="p-1.5 md:p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5 active:scale-90">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            <div className="scroll-row -mx-2 px-2 pb-4 no-scrollbar">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-[140px] md:w-[180px] shrink-0">
                    <div className="aspect-square skeleton rounded-xl md:rounded-2xl mb-4" />
                    <div className="skeleton h-4 w-3/4 mb-2" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                ))
              ) : (
                cat.songs?.map((song) => (
                  <SongCard key={song.id} song={song} onClick={() => openPlayer(song)} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SongCard({ song, onClick }: { song: Content, onClick: () => void }) {
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="w-[140px] md:w-[180px] shrink-0 group/card cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4 border border-white/5 shadow-2xl transition-all duration-500 md:group-hover/card:-translate-y-2 md:group-hover/card:border-[var(--accent)]/50 md:group-hover/card:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
        <img 
          src={song.poster} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-700 md:group-hover/card:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-500" />
        
        {/* Explicit Badge */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 w-5 h-5 md:w-6 md:h-6 rounded bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-80">
          <span className="text-[9px] md:text-[10px] font-black text-white">E</span>
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover/card:opacity-100 transition-all duration-500 transform scale-90 md:group-hover/card:scale-100">
           <div className="p-3 md:p-4 rounded-full bg-[var(--accent)] shadow-2xl">
             <Play className="w-5 h-5 md:w-6 md:h-6 fill-current text-white" />
           </div>
        </div>
      </div>

      <div className="px-1">
        <h4 className="text-xs md:text-sm font-black text-white truncate md:group-hover/card:text-[var(--accent)] transition-colors leading-tight">
          {song.title}
        </h4>
        <p className="text-[9px] md:text-[10px] text-white/40 font-black uppercase tracking-widest mt-1 md:mt-1.5 truncate">
          {song.genres?.[0] || 'Unknown Artist'}
        </p>
        <p className="text-[9px] md:text-[10px] text-white/20 font-black mt-0.5 md:mt-1">
          {song.duration ? formatDuration(song.duration) : '3:45'}
        </p>
      </div>
    </div>
  );
}
