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
      if (!res.ok) {
        // Mock data
        return [
          {
            id: '1',
            user: { username: 'Sarah Miller', avatarUrl: 'https://i.pravatar.cc/150?img=5', isVerified: true },
            content: 'Just discovered this amazing indie synthwave playlist! The transitions between tracks are flawless.',
            time: '2 hours ago',
            genre: 'Synthwave',
            likesCount: 124,
            commentsCount: 12,
            isLiked: false
          }
        ];
      }
      return res.json();
    },
    staleTime: 60000
  });

  const trendingSongs = useQuery({
    queryKey: ['trending-songs'],
    queryFn: async () => {
      // Use existing endpoint or fallback
      const res = await fetch(`${API_URL}/api/music/trending`, { headers });
      if (!res.ok) {
        return [
          { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', plays: '2.5M', artworkUrl: 'https://via.placeholder.com/150' },
          { id: '2', title: 'Starboy', artist: 'The Weeknd', plays: '1.8M', artworkUrl: 'https://via.placeholder.com/150' }
        ];
      }
      return res.json();
    },
    staleTime: 60000
  });

  const activeRooms = useQuery({
    queryKey: ['active-rooms'],
    queryFn: async () => {
      return [
        { id: '1', name: 'Rock Night', listeners: 26, isPublic: true },
        { id: '2', name: 'Pop Hits', listeners: 13, isPublic: true }
      ];
    },
    staleTime: 60000
  });

  const topContributors = useQuery({
    queryKey: ['top-contributors'],
    queryFn: async () => {
      return [
        { id: '1', name: 'Sarah', posts: 128, avatarUrl: 'https://i.pravatar.cc/150?img=5' },
        { id: '2', name: 'Rahul', posts: 96, avatarUrl: 'https://i.pravatar.cc/150?img=11' },
        { id: '3', name: 'Alex', posts: 80, avatarUrl: 'https://i.pravatar.cc/150?img=12' }
      ];
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
