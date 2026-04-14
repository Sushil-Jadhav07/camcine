// Camcine - Player Store (Zustand)
import { create } from 'zustand';
import type { Content, Episode } from '@/types';

interface PlayerState {
  // Current content
  currentContent: Content | null;
  currentEpisode: Episode | null;
  
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  quality: string;
  playbackRate: number;
  isFullscreen: boolean;
  showControls: boolean;
  buffered: number;
  
  // UI state
  isPlayerOpen: boolean;
  playerMode: 'video' | 'audio' | 'live';
  showEpisodes: boolean;
  showLyrics: boolean;
  
  // Queue
  queue: Content[];
  queueIndex: number;
  
  // Actions
  openPlayer: (content: Content, episode?: Episode) => void;
  closePlayer: () => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setQuality: (quality: string) => void;
  setPlaybackRate: (rate: number) => void;
  toggleFullscreen: () => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setBuffered: (buffered: number) => void;
  showControlsTemporarily: () => void;
  hideControls: () => void;
  toggleEpisodes: () => void;
  toggleLyrics: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (content: Content) => void;
  clearQueue: () => void;
  setPlayerMode: (mode: 'video' | 'audio' | 'live') => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Initial state
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

  // Actions
  openPlayer: (content: Content, episode?: Episode) => {
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

  seek: (time: number) => set({ currentTime: time }),

  setVolume: (volume: number) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  toggleMute: () => set(state => ({ isMuted: !state.isMuted })),

  setQuality: (quality: string) => set({ quality }),

  setPlaybackRate: (rate: number) => set({ playbackRate: rate }),

  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen();
      set({ isFullscreen: false });
    }
  },

  setDuration: (duration: number) => set({ duration }),

  setCurrentTime: (time: number) => set({ currentTime: time }),

  setBuffered: (buffered: number) => set({ buffered }),

  showControlsTemporarily: () => {
    set({ showControls: true });
    // Auto-hide after 3 seconds
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

  addToQueue: (content: Content) => {
    set(state => ({ queue: [...state.queue, content] }));
  },

  clearQueue: () => set({ queue: [], queueIndex: 0 }),

  setPlayerMode: (mode: 'video' | 'audio' | 'live') => set({ playerMode: mode }),
}));
