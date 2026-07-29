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
  history: Song[];
  
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
  history: [],

  playSong: (song) => set((state) => {
    const newHistory = state.currentSong ? [...state.history, state.currentSong] : state.history;
    return { currentSong: song, isPlaying: true, progress: 0, history: newHistory };
  }),
  pause: () => set({ isPlaying: false }),
  resume: () => set((state) => ({ isPlaying: !!state.currentSong })),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying && !!state.currentSong })),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
  playNext: () => set((state) => {
    if (!state.currentSong) return state;
    const newHistory = [...state.history, state.currentSong];
    
    if (state.queue.length > 0) {
      const [nextSong, ...remaining] = state.queue;
      return { currentSong: nextSong, queue: remaining, isPlaying: true, progress: 0, history: newHistory };
    }
    
    // Fallback if queue is empty to keep the music playing
    const fallbackSongs: Song[] = [
      { trackId: 'bpOSxM0rNPM', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80' },
      { trackId: 'yKNxeF4KMsY', title: 'Yellow', artist: 'Coldplay', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80' },
      { trackId: 'Ijk4j-r7qPA', title: 'Take Me Out', artist: 'Franz Ferdinand', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80' },
      { trackId: 'BddP6PYo2gs', title: 'Kesariya', artist: 'Pritam, Arijit Singh', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80' }
    ];
    // Pick a random fallback song that isn't the current one
    let nextSong = fallbackSongs[Math.floor(Math.random() * fallbackSongs.length)];
    if (nextSong.trackId === state.currentSong.trackId) {
      nextSong = fallbackSongs[(fallbackSongs.indexOf(nextSong) + 1) % fallbackSongs.length];
    }
    
    return { currentSong: nextSong, isPlaying: true, progress: 0, history: newHistory };
  }),
  playPrevious: () => set((state) => {
    if (state.history.length === 0) {
      return { progress: 0 }; // Just restart current song if no history
    }
    const previousSong = state.history[state.history.length - 1];
    const newHistory = state.history.slice(0, -1);
    const newQueue = state.currentSong ? [state.currentSong, ...state.queue] : state.queue;
    
    return { currentSong: previousSong, history: newHistory, queue: newQueue, isPlaying: true, progress: 0 };
  })
}));
