import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '@/lib/api';

let socketInstance: Socket | null = null;

export function useFriendsSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('soundsphere_token') : null;
    if (!token) return;

    if (!socketInstance) {
      socketInstance = io(API_URL, {
        auth: { token }
      });

      socketInstance.on('connect', () => {
        console.log('Friends socket connected');
      });

      socketInstance.on('dm:online', ({ userId }) => {
        queryClient.setQueryData(['friends-online'], (old: any) => {
          if (!old) return [userId];
          return old.includes(userId) ? old : [...old, userId];
        });
        queryClient.invalidateQueries({ queryKey: ['friends'] });
      });

      socketInstance.on('dm:offline', ({ userId }) => {
        queryClient.setQueryData(['friends-online'], (old: any) => {
          if (!old) return [];
          return old.filter((id: string) => id !== userId);
        });
        queryClient.invalidateQueries({ queryKey: ['friends'] });
      });

      socketInstance.on('activity:new', (activity) => {
        queryClient.setQueryData(['friends-activity'], (old: any) => {
          if (!old) return [activity];
          return [activity, ...old].slice(0, 50); // Keep last 50
        });
      });

      socketInstance.on('friend:request', () => {
        queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      });

      socketInstance.on('friend:accepted', () => {
        queryClient.invalidateQueries({ queryKey: ['friends'] });
        queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      });

      socketInstance.on('room:updated', () => {
        queryClient.invalidateQueries({ queryKey: ['listening-rooms'] });
      });
    }

    return () => {
      // In a real app we might not disconnect if used globally, 
      // but for this component mount we'll leave the singleton running.
    };
  }, [queryClient]);
}

export function useFriendsQueries() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('soundsphere_token') : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const friends = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/friends`, { headers });
      if (!res.ok) throw new Error('Failed to fetch friends');
      return res.json();
    },
    staleTime: 60000
  });

  const onlineFriends = useQuery({
    queryKey: ['friends-online'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/community-social/friends-activity`, { headers });
      if (!res.ok) throw new Error('Failed to fetch online friends');
      const data = await res.json();
      return data.filter((f: any) => f.isOnline).map((f: any) => f.userId || f.id);
    },
    staleTime: 60000
  });

  const activity = useQuery({
    queryKey: ['friends-activity'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/friends/activity`, { headers });
      if (!res.ok) {
        // Fallback to mock if endpoint doesn't exist
        return [
          { id: '1', user: { name: 'Rahul', avatar: 'https://i.pravatar.cc/150?u=rahul' }, type: 'listen', target: 'Blinding Lights', time: '2 mins ago' },
          { id: '2', user: { name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=priya' }, type: 'like', target: 'Kesariya', time: '15 mins ago' },
          { id: '3', user: { name: 'Aman', avatar: 'https://i.pravatar.cc/150?u=aman' }, type: 'room', target: 'Rock Room', time: '1 hour ago' }
        ];
      }
      return res.json();
    },
    staleTime: 60000
  });

  const suggestions = useQuery({
    queryKey: ['friend-suggestions'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/friends/suggestions`, { headers });
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      return res.json();
    },
    staleTime: 60000
  });

  const requestsIncoming = useQuery({
    queryKey: ['friend-requests', 'incoming'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/friends/requests/incoming`, { headers });
      if (!res.ok) return []; // Default to empty array if fails
      return res.json();
    },
    staleTime: 60000
  });

  const requestsOutgoing = useQuery({
    queryKey: ['friend-requests', 'outgoing'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/friends/requests/outgoing`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });

  const listeningRooms = useQuery({
    queryKey: ['listening-rooms'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/rooms`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000
  });
  
  const history = useQuery({
    queryKey: ['listening-history'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/listening/history`, { headers });
      if (!res.ok) return [
         { id: '1', users: ['You', 'Rahul'], target: 'Kesariya', duration: '45 min', time: 'Yesterday' }
      ];
      return res.json();
    },
    staleTime: 60000
  });

  return {
    friends,
    onlineFriends,
    activity,
    suggestions,
    requestsIncoming,
    requestsOutgoing,
    listeningRooms,
    history
  };
}
