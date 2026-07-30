import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '@/lib/api';

let socketInstance: Socket | null = null;

export function useCommunitySocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('soundsphere_token') : null;
    if (!token) return;

    if (!socketInstance) {
      socketInstance = io(API_URL, {
        auth: { token }
      });

      socketInstance.on('connect', () => {
        console.log('Community socket connected');
      });

      // Community specific events
      socketInstance.on('post:new', (post) => {
        queryClient.setQueryData(['community-posts'], (old: any) => {
          if (!old) return [post];
          return [post, ...old];
        });
      });

      socketInstance.on('post:like', ({ postId, likesCount }) => {
        queryClient.setQueryData(['community-posts'], (old: any) => {
          if (!old) return old;
          return old.map((p: any) => p.id === postId ? { ...p, likesCount } : p);
        });
      });

      socketInstance.on('poll:vote', ({ pollId, optionId, votesCount }) => {
        // Optimistically update poll data
      });
    }

    return () => {
      // Keep singleton
    };
  }, [queryClient]);
}

export function useCommunityQueries() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('soundsphere_token') : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const posts = useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/community-social/posts`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  const trendingSongs = useQuery({
    queryKey: ['trending-songs'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/music/trending`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  const activeRooms = useQuery({
    queryKey: ['active-rooms'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/rooms`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  const topContributors = useQuery({
    queryKey: ['top-contributors'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/community-social/contributors`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  return {
    posts,
    trendingSongs,
    activeRooms,
    topContributors
  };
}
