import { create } from 'zustand';

export interface Song {
  trackId: string;
  title: string;
  artist: string;
  cover?: string;
  thumbnail?: string;
  duration?: number;
}

interface MusicState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number; // 0 to 1
  queue: Song[];
  
  // Actions
  playSong: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  addToQueue: (song: Song) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  queue: [],

  playSong: (song) => set({ currentSong: song, isPlaying: true, progress: 0 }),
  pause: () => set({ isPlaying: false }),
  resume: () => set((state) => ({ isPlaying: !!state.currentSong })),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying && !!state.currentSong })),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
  playNext: () => set((state) => {
    if (state.queue.length === 0) return state;
    const [nextSong, ...remaining] = state.queue;
    return { currentSong: nextSong, queue: remaining, isPlaying: true, progress: 0 };
  }),
  playPrevious: () => {
    // Basic implementation - for a real app we'd keep a history queue too.
    set((state) => ({ progress: 0 }));
  }
}));
