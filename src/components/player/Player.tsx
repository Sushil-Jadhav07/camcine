import { useRef } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Film, Tv } from 'lucide-react';
import { usePlayerStore } from '@/store';

export function Player() {
  const {
    currentContent,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    closePlayer,
    playNext,
    playPrevious,
  } = usePlayerStore();

  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  if (!currentContent) return null;

  const typeIcon = currentContent.type === 'movie' ? <Film className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />;

  return (
    <div className="player-bar">
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-4 md:flex-row md:items-center">
        <div className="flex w-full min-w-0 flex-shrink-0 items-center gap-3 md:w-56">
          <img
            src={currentContent.poster}
            alt={currentContent.title}
            className="w-14 h-14 rounded-xl object-cover cursor-pointer shadow-lg"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-white text-sm font-semibold truncate cursor-pointer hover:text-[var(--accent)] transition-colors">
              {currentContent.title}
            </h4>
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs mt-0.5">
              {typeIcon}
              <span className="truncate">{currentContent.genres?.[0]}</span>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={playPrevious} className="p-2 text-[var(--text-secondary)] hover:text-white transition-all hover:bg-white/5 rounded-full">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={isPlaying ? pause : play}
              className="p-3 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white hover:shadow-lg hover:shadow-[var(--accent)]/30 transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            <button onClick={playNext} className="p-2 text-[var(--text-secondary)] hover:text-white transition-all hover:bg-white/5 rounded-full">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="flex w-full max-w-xl items-center gap-2 md:gap-3">
            <span className="text-[var(--text-muted)] text-xs w-10 text-right font-medium">{formatTime(currentTime)}</span>
            <div ref={progressRef} className="progress-bar flex-1" onClick={handleProgressClick}>
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-[var(--text-muted)] text-xs w-10 font-medium">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex w-full flex-shrink-0 items-center justify-between gap-3 md:w-48 md:justify-end">
          <button onClick={toggleMute} className="p-2 text-[var(--text-secondary)] hover:text-white transition-all hover:bg-white/5 rounded-full">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1.5 appearance-none bg-[var(--bg-elevated)] rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
          />
          <button onClick={() => {}} className="p-2 text-[var(--text-secondary)] hover:text-white transition-all hover:bg-white/5 rounded-full">
            <Maximize className="w-5 h-5" />
          </button>
          <button onClick={closePlayer} className="p-2 text-[var(--text-secondary)] hover:text-white transition-all hover:bg-white/5 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
