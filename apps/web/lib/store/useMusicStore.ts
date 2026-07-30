import { create } from 'zustand';

export interface Song {
  trackId: string;
  title: string;
  artist: string;
  cover?: string;
  thumbnail?: string;
  duration?: number;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  creator: string;
  songCount: number;
  lastUpdated: string;
  images: string[];
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
  insertNext: (song: Song) => void;
  playNext: () => void;
  playPrevious: () => void;
  
  likedSongs: string[];
  toggleLike: (trackId: string) => void;

  userPlaylists: Playlist[];
  createPlaylist: (playlist: Playlist) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, trackId: string) => void;

  savedAlbums: any[];
  toggleSaveAlbum: (album: any) => void;
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
  insertNext: (song) => set((state) => ({ queue: [song, ...state.queue] })),
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
  }),
  likedSongs: [],
  toggleLike: (trackId) => set((state) => {
    if (state.likedSongs.includes(trackId)) {
      return { likedSongs: state.likedSongs.filter(id => id !== trackId) };
    } else {
      return { likedSongs: [...state.likedSongs, trackId] };
    }
  }),
  userPlaylists: [
    { id: '1', title: 'Chill Mix', creator: 'You', songCount: 12, lastUpdated: '2 days ago', images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80'] },
    { id: '2', title: 'Workout', creator: 'You', songCount: 24, lastUpdated: '1 day ago', images: ['https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&q=80'] },
    { id: '3', title: 'Party', creator: 'You', songCount: 45, lastUpdated: '1 week ago', images: ['https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=150&q=80'] },
    { id: '4', title: 'Study', creator: 'You', songCount: 8, lastUpdated: '3 hours ago', images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80'] },
  ],
  createPlaylist: (playlist) => set((state) => ({ userPlaylists: [playlist, ...state.userPlaylists] })),
  addSongToPlaylist: (playlistId, song) => set((state) => ({
    userPlaylists: state.userPlaylists.map(pl => {
      if (pl.id === playlistId) {
        return {
          ...pl,
          songCount: pl.songCount + 1,
          images: pl.images.includes(song.cover || '') ? pl.images : [song.cover || '', ...pl.images].filter(Boolean).slice(0, 4)
        };
      }
      return pl;
    })
  })),
  removeSongFromPlaylist: (playlistId, trackId) => set((state) => ({
    userPlaylists: state.userPlaylists.map(pl => {
      if (pl.id === playlistId) {
        return {
          ...pl,
          songCount: Math.max(0, pl.songCount - 1)
        };
      }
      return pl;
    })
  })),
  savedAlbums: [],
  toggleSaveAlbum: (album) => set((state) => {
    const exists = state.savedAlbums.some(a => a.id === album.id);
    if (exists) {
      return { savedAlbums: state.savedAlbums.filter(a => a.id !== album.id) };
    } else {
      return { savedAlbums: [album, ...state.savedAlbums] };
    }
  })
}));
