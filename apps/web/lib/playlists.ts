import { API_URL } from './api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('soundsphere_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export interface PlaylistData {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  isPublic: boolean;
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
    profile?: { displayName: string };
  };
  _count?: {
    songs: number;
    followers: number;
  };
  songs?: { 
    song: { 
      id: string; 
      title: string; 
      artist?: { name: string }; 
      durationMs: number; 
      coverUrl?: string; 
      youtubeId?: string; 
      spotifyId?: string; 
    } 
  }[];
}

export const getPlaylists = async (): Promise<PlaylistData[]> => {
  const res = await fetch(`${API_URL}/api/playlists`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch playlists');
  return res.json();
};

export const getMyPlaylists = async (): Promise<PlaylistData[]> => {
  const res = await fetch(`${API_URL}/api/playlists/me`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch your playlists');
  return res.json();
};

export const getPlaylistById = async (id: string): Promise<PlaylistData> => {
  const res = await fetch(`${API_URL}/api/playlists/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch playlist');
  return res.json();
};

export const createPlaylist = async (data: { title: string; description?: string; isPublic?: boolean; coverUrl?: string }): Promise<PlaylistData> => {
  const res = await fetch(`${API_URL}/api/playlists`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create playlist');
  return res.json();
};

export const addSongToPlaylist = async (playlistId: string, trackData: { songId: string; title: string; artist: string; duration: number; thumbnail: string }) => {
  const res = await fetch(`${API_URL}/api/playlists/${playlistId}/songs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(trackData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add song to playlist');
  }
  return res.json();
};

export const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
  const res = await fetch(`${API_URL}/api/playlists/${playlistId}/songs/${songId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to remove song from playlist');
  return res.json();
};
