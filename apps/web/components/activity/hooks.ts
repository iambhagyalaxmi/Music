import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '@/lib/api';

let socketInstance: Socket | null = null;

export function useActivitySocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('soundsphere_token') : null;
    if (!token) return;

    if (!socketInstance) {
      socketInstance = io(API_URL, {
        auth: { token }
      });

      socketInstance.on('connect', () => {
        console.log('Activity socket connected');
      });

      // Real-time friend activity updates
      socketInstance.on('activity:new', (activity) => {
        queryClient.setQueryData(['friends-activity-feed'], (old: any) => {
          if (!old) return [activity];
          return [activity, ...old].slice(0, 50); // Keep last 50
        });
      });
    }

    return () => {
      // Keep singleton
    };
  }, [queryClient]);
}

export function useActivityQueries() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('soundsphere_token') : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const stats = useQuery({
    queryKey: ['activity-stats'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/activity/stats`, { headers });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60000
  });

  const timeline = useQuery({
    queryKey: ['activity-timeline'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/activity/timeline`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  const friendsActivity = useQuery({
    queryKey: ['friends-activity-feed'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/activity/friends`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  const heatmap = useQuery({
    queryKey: ['activity-heatmap'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/activity/heatmap`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  const recentTogether = useQuery({
    queryKey: ['activity-recent-together'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/activity/recent-together`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  const recommendations = useQuery({
    queryKey: ['activity-recommendations'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/activity/recommendations`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  return {
    stats,
    timeline,
    friendsActivity,
    heatmap,
    recentTogether,
    recommendations
  };
}
