// Camcine - Player Store (Zustand)
import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  currentContent: null,
  currentEpisode: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  quality: 'auto',
  playbackRate: 1,
  isFullscreen: false,
  showControls: true,
  buffered: 0,
  isPlayerOpen: false,
  playerMode: 'video',
  showEpisodes: false,
  showLyrics: false,
  queue: [],
  queueIndex: 0,

  openPlayer: (content, episode) => {
    set({
      currentContent: content,
      currentEpisode: episode || null,
      isPlayerOpen: true,
      isPlaying: true,
      currentTime: 0,
      playerMode: content.type === 'song' ? 'audio' : content.type === 'news' ? 'live' : 'video',
    });
  },

  closePlayer: () => {
    set({
      currentContent: null,
      currentEpisode: null,
      isPlayerOpen: false,
      isPlaying: false,
      currentTime: 0,
    });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),

  seek: (time) => set({ currentTime: time }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  toggleMute: () => set(state => ({ isMuted: !state.isMuted })),

  setQuality: (quality) => set({ quality }),

  setPlaybackRate: (rate) => set({ playbackRate: rate }),

  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen();
      set({ isFullscreen: false });
    }
  },

  setDuration: (duration) => set({ duration }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setBuffered: (buffered) => set({ buffered }),

  showControlsTemporarily: () => {
    set({ showControls: true });
    setTimeout(() => {
      if (get().isPlaying) {
        set({ showControls: false });
      }
    }, 3000);
  },

  hideControls: () => set({ showControls: false }),

  toggleEpisodes: () => set(state => ({ showEpisodes: !state.showEpisodes })),

  toggleLyrics: () => set(state => ({ showLyrics: !state.showLyrics })),

  playNext: () => {
    const { queue, queueIndex } = get();
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      set({
        currentContent: queue[nextIndex],
        queueIndex: nextIndex,
        currentTime: 0,
      });
    }
  },

  playPrevious: () => {
    const { queue, queueIndex } = get();
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      set({
        currentContent: queue[prevIndex],
        queueIndex: prevIndex,
        currentTime: 0,
      });
    }
  },

  addToQueue: (content) => {
    set(state => ({ queue: [...state.queue, content] }));
  },

  clearQueue: () => set({ queue: [], queueIndex: 0 }),

  setPlayerMode: (mode) => set({ playerMode: mode }),
}));
