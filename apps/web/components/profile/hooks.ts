import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/api';

export function useProfileQueries(username?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('soundsphere_token') : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  // Base profile data (user, stats, etc.)
  const baseEndpoint = username ? `/api/user/${username}` : `/api/profile`;
  
  const profile = useQuery({
    queryKey: ['profile', username || 'me'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${baseEndpoint}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    },
    staleTime: 60000,
  });

  const stats = useQuery({
    queryKey: ['profile-stats', username || 'me'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${baseEndpoint}/stats`, { headers });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60000,
  });

  const heatmap = useQuery({
    queryKey: ['profile-heatmap', username || 'me'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${baseEndpoint}/heatmap`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const musicTaste = useQuery({
    queryKey: ['profile-music-taste', username || 'me'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${baseEndpoint}/music-taste`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const achievements = useQuery({
    queryKey: ['profile-achievements', username || 'me'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${baseEndpoint}/achievements`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const wrapped = useQuery({
    queryKey: ['profile-wrapped', username || 'me'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${baseEndpoint}/wrapped`, { headers });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60000,
  });

  return {
    profile,
    stats,
    heatmap,
    musicTaste,
    achievements,
    wrapped,
  };
}
